import { useState } from "react";

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

function StoryGame({ story, onNewStory }: { story: Story | null; onNewStory: () => void }) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Falls back to root node when story changes or selectedNodeId is not in current story
    const currentNodeId = selectedNodeId && story?.all_nodes?.[selectedNodeId]
        ? selectedNodeId
        : story?.root_node?.id ?? null;

    const currentNode = currentNodeId && story?.all_nodes ? story.all_nodes[currentNodeId] : null;
    const isEnding = currentNode?.is_ending ?? false;
    const isWinningEnding = currentNode?.is_winning_ending ?? false;
    const options = !isEnding && currentNode?.options ? currentNode.options : [];

    const chooseOption = (optionId: string) => {
        setSelectedNodeId(optionId)
    }

    const restartStory = () => {
        setSelectedNodeId(null)
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
                    <button onClick={restartStory} className="reset-btn">
                        Restart Story
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
