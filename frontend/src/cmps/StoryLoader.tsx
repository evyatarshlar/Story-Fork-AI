import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingStatus from "./LoadingStatus";
import StoryGame from "./StoryGame";
import { API_BASE_URL } from "../util";

interface StoryOption {
    node_id: string;
    text: string;
}

interface StoryNode {
    id: string;
    content: string;
    is_ending: boolean;
    is_winning_ending: boolean;
    options: StoryOption[];
}

interface Story {
    title: string;
    root_node: StoryNode;
    all_nodes: Record<string, StoryNode>;
}

function StoryLoader() {
    const { id } = useParams();
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
                setError("Story is not found.")
            } else {
                setError("Failed to load story.")
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadStory(id);
    }, [id]);

    // useEffect(() => {
    //     const loadStory = async () => {
    //         setLoading(true);
    //         setError(null);
    //         try {
    //             const response = await axios.get(`${API_BASE_URL}/stories/${id}/complete`);
    //             setStory(response.data);
    //         } catch (err) {
    //             if (axios.isAxiosError(err) && err.response?.status === 404) {
    //                 setError("Story is not found.");
    //             } else {
    //                 setError("Failed to load story.");
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     loadStory();
    // }, [id]);

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
                    <h2>Story Not Found</h2>
                    <p>{error}</p>
                    <button onClick={creatNewStory}>
                        Go to Story Generator & Create New Story
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

}

export default StoryLoader;