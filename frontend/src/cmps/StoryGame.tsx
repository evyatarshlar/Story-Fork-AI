import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Story } from "../types";

function StoryGame({ story, onNewStory }: { story: Story | null; onNewStory: () => void }) {
    const { id: storyId } = useParams();
    const { t } = useTranslation();
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
                {currentNode && <div className="story-node" key={currentNodeId}>
                    <p>{currentNode.content}</p>
                    {isEnding ?
                        <div className="story-ending">
                            <h3>{isWinningEnding ? t("story_game.congratulations") : t("story_game.the_end")}</h3>
                            {isWinningEnding ? t("story_game.winning_ending") : t("story_game.adventure_ended")}
                        </div>
                        :
                        <div className="story-options">
                            <h3>{t("story_game.what_will_you_do")}</h3>
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
                            {t("story_game.go_back")}
                        </button>
                    )}
                    <button onClick={restartStory} className="reset-btn">
                        {t("story_game.restart")}
                    </button>
                    <button onClick={shareStory} className={`share-btn${copied ? " copied" : ""}`}>
                        {copied ? t("story_game.copied") : t("story_game.share")}
                    </button>
                    {onNewStory && <button onClick={onNewStory} className="new-story-btn">
                        {t("story_game.new_story")}
                    </button>}
                </div>

            </div>

        </div>
    );
}

export default StoryGame;
