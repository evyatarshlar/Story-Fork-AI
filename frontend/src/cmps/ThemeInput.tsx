import { useState } from "react";

const EXAMPLE_THEMES = ["pirates", "space", "medieval", "cyberpunk", "underwater", "dinosaurs", "wizard school", "time travel"];

function ThemeInput({ onSubmit }: { onSubmit: (theme: string) => void }) {
    const [theme, setTheme] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme.trim()) {
            setError("Please enter a theme name");
            return
        }
        setError("");
        onSubmit(theme);
    };

    return (
        <div className="theme-input-container">
            <h2>Generate Your Adventure</h2>
            <p>Enter a theme for your interactive story</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Enter a theme (e.g. prirates, space, medieval...)"
                        className={error ? 'error' : ''}
                    />
                    {error && <p className="error-text">{error}</p>}
                </div>

                <button type="submit" className='generate-btn'>Generate Story</button>
            </form>

            <div className="examples">
                <h3>Or pick an example:</h3>
                <ul>
                    {EXAMPLE_THEMES.map(t => (
                        <li key={t} onClick={() => setTheme(t)}>{t}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ThemeInput;