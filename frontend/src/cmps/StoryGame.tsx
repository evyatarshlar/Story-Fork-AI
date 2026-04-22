function StoryGame({ story }: { story: Record<string, unknown> }) {
    return (
        <div className="story-game">
            {JSON.stringify(story)}
        </div>
    );
}

export default StoryGame;
