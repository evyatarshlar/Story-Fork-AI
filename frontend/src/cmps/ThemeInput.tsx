import { useState } from "react";
import type { StoryOptions } from "../types";

const EXAMPLE_THEMES = ["pirates", "space", "medieval", "cyberpunk", "underwater", "dinosaurs","jungle survival", "haunted mansion", "robot uprising",
  "arctic expedition", "ancient Egypt", "ninja village",
  "sunken city of Atlantis", "dragon tamer", "secret spy academy",
  "wild west", "enchanted forest", "alien first contact",
  "underground kingdom", "sky islands", "volcano explorer", "wizard school", "time travel"];

const GENRES = ["", "Fantasy", "Sci-Fi", "Mystery", "Horror", "Adventure", "Romance", "Comedy"];
const TONES = ["", "Adventurous", "Funny", "Scary", "Dramatic", "Heartwarming", "Dark"];
const LENGTHS = [
    { value: "", label: "Medium (default)" },
    { value: "short", label: "Short (2-3 sentences)" },
    { value: "long", label: "Long (5-7 sentences)" },
];
const DEPTHS = [3, 4, 5, 6];
const AGE_GROUPS = [
    { value: "", label: "Any age" },
    { value: "7", label: "Kids (6-8)" },
    { value: "11", label: "Tweens (9-12)" },
    { value: "15", label: "Teens (13-17)" },
    { value: "25", label: "Adults (18+)" },
];

function ThemeInput({ onSubmit }: { onSubmit: (theme: string, options: StoryOptions) => void }) {
    const [theme, setTheme] = useState("");
    const [error, setError] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [options, setOptions] = useState<StoryOptions>({ depth: 4 });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme.trim()) {
            setError("Please enter a theme name");
            return;
        }
        setError("");
        onSubmit(theme, options);
    };

    const setOption = <K extends keyof StoryOptions>(key: K, value: StoryOptions[K]) => {
        setOptions(prev => ({ ...prev, [key]: value }));
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
                        placeholder="Enter a theme (e.g. pirates, space, medieval...)"
                        className={error ? 'error' : ''}
                    />
                    {error && <p className="error-text">{error}</p>}
                </div>

                <div className="advanced-toggle">
                    <button type="button" onClick={() => setShowAdvanced(v => !v)} className="advanced-toggle-btn">
                        {showAdvanced ? "▲ Hide options" : "▼ Customize story"}
                    </button>
                </div>

                {showAdvanced && (
                    <div className="advanced-options">
                        <div className="option-row">
                            <label>Age group</label>
                            <select value={options.age ?? ""} onChange={e => setOption("age", e.target.value ? Number(e.target.value) : undefined)}>
                                {AGE_GROUPS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>Story depth</label>
                            <select value={options.depth ?? 4} onChange={e => setOption("depth", Number(e.target.value))}>
                                {DEPTHS.map(d => <option key={d} value={d}>{d} levels</option>)}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>Segment length</label>
                            <select value={options.length ?? ""} onChange={e => setOption("length", e.target.value || undefined)}>
                                {LENGTHS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>Genre</label>
                            <select value={options.genre ?? ""} onChange={e => setOption("genre", e.target.value || undefined)}>
                                {GENRES.map(g => <option key={g} value={g}>{g || "Any"}</option>)}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>Tone</label>
                            <select value={options.tone ?? ""} onChange={e => setOption("tone", e.target.value || undefined)}>
                                {TONES.map(t => <option key={t} value={t}>{t || "Any"}</option>)}
                            </select>
                        </div>
                    </div>
                )}

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
