import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ThemeInput from "./ThemeInput.jsx";
import LoadingStatus from "./LoadingStatus.jsx";
import Contact from "./Contact";
import { API_BASE_URL } from "../util.js";
import type { StoredStory, StoryOptions } from "../types";

function StoryGenerator() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [theme, setTheme] = useState("")
    const [jobId, setJobId] = useState<string | null>(null)
    const [jobStatus, setJobStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [recentStories, setRecentStories] = useState<StoredStory[]>([])
    const [communityStories, setCommunityStories] = useState<StoredStory[]>([])
    const [visibleRecent, setVisibleRecent] = useState(4)
    const [visibleCommunity, setVisibleCommunity] = useState(4)
    const [openModal, setOpenModal] = useState<number | null>(null)
    const modalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setOpenModal(null)
            }
        }
        if (openModal !== null) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [openModal])

    useEffect(() => {
        let cancelled = false;
        const fetchStoryLists = async () => {
            try {
                const [myRes, communityRes] = await Promise.all([
                    axios.get<StoredStory[]>(`${API_BASE_URL}/stories`),
                    axios.get<StoredStory[]>(`${API_BASE_URL}/stories/community`),
                ]);
                if (!cancelled) {
                    setRecentStories(myRes.data);
                    setCommunityStories(communityRes.data);
                }
            } catch {
                // silently ignore — lists are non-critical
            }
        };
        fetchStoryLists();
        return () => { cancelled = true; };
    }, [])

    const fetchStory = useCallback(async (id: string) => {
        try {
            setLoading(false)
            setJobStatus("completed")
            navigate(`/story/${id}`)
        } catch {
            setError(t("story_generator.error_load"))
            setLoading(false)
        }
    }, [navigate, t])

    const pollJobStatus = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/${id}`)
            const { status, story_id, error: jobError } = response.data
            setJobStatus(status)

            if (status === "completed" && story_id) {
                fetchStory(story_id)
            } else if (status === "failed" || jobError) {
                setError(jobError || t("story_generator.error_generate"))
                setLoading(false)
            }
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status !== 404) {
                setError(t("story_generator.error_status"))
                setLoading(false)
            }
        }
    }, [fetchStory, t])

    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval> | undefined;
        let pollTimeout: ReturnType<typeof setTimeout> | undefined;

        if (jobId && jobStatus === "processing") {
            pollInterval = setInterval(() => {
                pollJobStatus(jobId)
            }, 2000)

            pollTimeout = setTimeout(() => {
                clearInterval(pollInterval);
                setLoading(false);
                setError(t("story_generator.timeout_error"));
            }, 120_000)
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
            if (pollTimeout) clearTimeout(pollTimeout);
        }
    }, [jobId, jobStatus, pollJobStatus, t])

    const generateStory = async (theme: string, options: StoryOptions = {}) => {
        setLoading(true)
        setError(null)
        setTheme(theme)

        try {
            const response = await axios.post(`${API_BASE_URL}/stories/create`, { theme, ...options })
            const { job_id, status } = response.data
            setJobId(job_id)
            setJobStatus(status)

            pollJobStatus(job_id)
        } catch (e) {
            setLoading(false)
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                const retryAfter = e.response.data?.detail?.retry_after
                if (retryAfter) {
                    const retryDate = new Date(retryAfter)
                    const timeStr = retryDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
                    setError(t("story_generator.rate_limit", { time: timeStr }))
                } else {
                    setError(t("story_generator.rate_limit", { time: "" }))
                }
            } else {
                setError(t("story_generator.error_generate"))
            }
        }
    }

    const reset = () => {
        setTheme("")
        setJobId(null)
        setJobStatus(null)
        setError(null)
        setLoading(false)
    }

    const renderStoryDetails = (story: StoredStory) => {
        const fields: { label: string; value: string | number }[] = []
        if (story.theme) fields.push({ label: t("story_generator.field_theme"), value: story.theme })
        if (story.genre) fields.push({ label: t("story_generator.field_genre"), value: story.genre })
        if (story.tone) fields.push({ label: t("story_generator.field_tone"), value: story.tone })
        if (story.age) fields.push({ label: t("story_generator.field_age"), value: story.age })
        if (story.depth) fields.push({ label: t("story_generator.field_depth"), value: story.depth })
        if (story.length) fields.push({ label: t("story_generator.field_length"), value: story.length })
        return (
            <div className="story-details-modal" ref={modalRef}>
                <p className="story-details-date">
                    {new Date(story.created_at).toLocaleDateString()}
                </p>
                {fields.map(f => (
                    <p key={f.label} className="story-details-row">
                        <span className="story-details-label">{f.label}:</span> {f.value}
                    </p>
                ))}
            </div>
        )
    }

    return (
        <div className="story-generator">
            {error && <div className="error-message">
                <p>{error}</p>
                <button onClick={reset}>{t("story_generator.try_again")}</button>
            </div>}

            {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory} />}

            {loading && <LoadingStatus theme={theme} />}

            {!jobId && !error && !loading && recentStories.length > 0 && (
                <div className="recent-stories">
                    <h3>{t("story_generator.your_stories")}</h3>
                    {recentStories.slice(0, visibleRecent).map(story => (
                        <div
                            key={story.id}
                            className="recent-story-item"
                            onClick={() => navigate(`/story/${story.id}`)}
                        >
                            <span className="recent-story-title">{story.title}</span>
                            <button
                                className="story-dots-btn"
                                onClick={e => { e.stopPropagation(); setOpenModal(openModal === story.id ? null : story.id) }}
                                title="Details"
                            >
                                &#8942;
                            </button>
                            {openModal === story.id && renderStoryDetails(story)}
                        </div>
                    ))}
                    <div className="stories-pagination">
                        {visibleRecent < recentStories.length && (
                            <button className="read-more-btn" onClick={() => setVisibleRecent(v => v + 4)}>
                                {t("story_generator.read_more")}
                            </button>
                        )}
                        {visibleRecent > 4 && (
                            <button className="read-less-btn" onClick={() => setVisibleRecent(v => Math.max(4, v - 4))}>
                                {t("story_generator.read_less")}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!jobId && !error && !loading && communityStories.length > 0 && (
                <div className="recent-stories community-stories">
                    <h3>{t("story_generator.community_stories")}</h3>
                    {communityStories.slice(0, visibleCommunity).map(story => (
                        <div
                            key={story.id}
                            className="recent-story-item"
                            onClick={() => navigate(`/story/${story.id}`)}
                        >
                            <span className="recent-story-title">{story.title}</span>
                            <button
                                className="story-dots-btn"
                                onClick={e => { e.stopPropagation(); setOpenModal(openModal === story.id ? null : story.id) }}
                                title="Details"
                            >
                                &#8942;
                            </button>
                            {openModal === story.id && renderStoryDetails(story)}
                        </div>
                    ))}
                    <div className="stories-pagination">
                        {visibleCommunity < communityStories.length && (
                            <button className="read-more-btn" onClick={() => setVisibleCommunity(v => v + 4)}>
                                {t("story_generator.read_more")}
                            </button>
                        )}
                        {visibleCommunity > 4 && (
                            <button className="read-less-btn" onClick={() => setVisibleCommunity(v => Math.max(4, v - 4))}>
                                {t("story_generator.read_less")}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <Contact />
        </div>
    );
}

export default StoryGenerator;