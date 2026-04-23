import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingStatus from "./LoadingStatus";
import StoryGame from "./StoryGame";
import { API_BASE_URL } from "../util";
import type { Story } from "../types";

function StoryLoader() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadStory = async (storyId: string | undefined) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/stories/${storyId}/complete`);
            setStory(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError(t("story_loader.not_found_text"))
            } else {
                setError(t("story_loader.failed_load"))
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadStory(id);
    }, [id]);

    const creatNewStory = () => {
            navigate("/");
        }

    if (loading) {
        return <LoadingStatus theme={"story"} />;
    }

    if (error) {
        return (
            <div className="story-loader">
                <div className="error-message">
                    <h2>{t("story_loader.not_found_title")}</h2>
                    <p>{error}</p>
                    <button onClick={creatNewStory}>
                        {t("story_loader.go_create")}
                    </button>
                </div>
            </div>
        );
    }

    if (story) {
        return (
            <div className="story-loader">
                <StoryGame story={story} onNewStory={creatNewStory} />
            </div>
        );
    }

    return null;
}

export default StoryLoader;