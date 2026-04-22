import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Story } from "../types";

function StoryGame({ story, onNewStory }: { story: Story | null; onNewStory: () => void }) {
    const { id: storyId } = useParams();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    // Falls back to root node when story changes or selectedNodeId is not in current story
    const currentNodeId = selectedNodeId && story?.all_nodes?.[selectedNodeId]
        ? selectedNodeId
        : story?.root_node?.id ?? null;

    const currentNode = currentNodeId && story?.all_nodes ? story.all_nodes[currentNodeId] : null;
    const isEnding = currentNode?.is_ending ?? false;
    const isWinningEnding = currentNode?.is_winning_ending ?? false;
    const options = !isEnding && currentNode?.options ? currentNode.options : [];

    const chooseOption = (optionId: string) => {
        if (currentNodeId) {
            setHistory(prev => [...prev, currentNodeId]);
        }
        setSelectedNodeId(optionId);
    }

    const goBack = () => {
        const prev = history[history.length - 1];
        setHistory(h => h.slice(0, -1));
        setSelectedNodeId(prev ?? null);
    }

    const restartStory = () => {
        setSelectedNodeId(null);
        setHistory([]);
    }

    const shareStory = async () => {
        const url = `${window.location.origin}/story/${storyId}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="story-game">
            <header className="story-header">
                <h2>{story?.title}</h2>
            </header>
            <div className="story-content">
                {currentNode && <div className="story-node">
                    <p>{currentNode.content}</p>
                    {isEnding ?
                        <div className="story-ending">
                            <h3>{isWinningEnding ? "Congratulations" : "The End"}</h3>
                            {isWinningEnding ? "You reached a winning ending" : "Your adventure has ended."}
                        </div>
                        :
                        <div className="story-options">
                            <h3>What will you do?</h3>
                            <div className="options-list">
                                {options.map((option, index) => {
                                    return <button
                                        key={index}
                                        onClick={() => chooseOption(option.node_id)}
                                        className="option-btn"
                                    >
                                        {option.text}
                                    </button>
                                })}
                            </div>
                        </div>
                    }
                </div>}

                <div className="story-controls">
                    {history.length > 0 && (
                        <button onClick={goBack} className="back-btn">
                            ← Go Back
                        </button>
                    )}
                    <button onClick={restartStory} className="reset-btn">
                        Restart Story
                    </button>
                    <button onClick={shareStory} className={`share-btn${copied ? " copied" : ""}`}>
                        {copied ? "Copied!" : "Share Story"}
                    </button>
                    {onNewStory && <button onClick={onNewStory} className="new-story-btn">
                        New Story
                    </button>}
                </div>

            </div>

        </div>
    );
}

export default StoryGame;
