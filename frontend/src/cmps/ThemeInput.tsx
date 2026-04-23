import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { StoryOptions } from "../types";

// Values sent to the API — never translated
const GENRES = ["", "Fantasy", "Sci-Fi", "Mystery", "Horror", "Adventure", "Romance", "Comedy"];
const TONES = ["", "Adventurous", "Funny", "Scary", "Dramatic", "Heartwarming", "Dark"];
const LENGTH_VALUES = ["", "short", "long"];
const DEPTH_VALUES = [3, 4, 5, 6];
const AGE_VALUES = ["", "7", "11", "15", "25"];

const EXAMPLES_PAGE_SIZE = 8;

function ThemeInput({ onSubmit }: { onSubmit: (theme: string, options: StoryOptions) => void }) {
    const { t } = useTranslation();
    const [theme, setTheme] = useState("");
    const [error, setError] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [options, setOptions] = useState<StoryOptions>({ depth: 4 });
    const [visibleExamples, setVisibleExamples] = useState(EXAMPLES_PAGE_SIZE);

    const exampleThemes = t("example_themes", { returnObjects: true }) as string[];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme.trim()) {
            setError(t("theme_input.error_empty"));
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
            <h2>{t("theme_input.title")}</h2>
            <p>{t("theme_input.subtitle")}</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder={t("theme_input.placeholder")}
                        className={error ? 'error' : ''}
                    />
                    {error && <p className="error-text">{error}</p>}
                </div>

                <div className="advanced-toggle">
                    <button type="button" onClick={() => setShowAdvanced(v => !v)} className="advanced-toggle-btn">
                        {showAdvanced ? t("theme_input.hide_options") : t("theme_input.customize")}
                    </button>
                </div>

                {showAdvanced && (
                    <div className="advanced-options">
                        <div className="option-row">
                            <label>{t("theme_input.age_group")}</label>
                            <select value={options.age ?? ""} onChange={e => setOption("age", e.target.value ? Number(e.target.value) : undefined)}>
                                {AGE_VALUES.map((v, i) => (
                                    <option key={v} value={v}>
                                        {i === 0 ? t("age_groups.any") : i === 1 ? t("age_groups.kids") : i === 2 ? t("age_groups.tweens") : i === 3 ? t("age_groups.teens") : t("age_groups.adults")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>{t("theme_input.story_depth")}</label>
                            <select value={options.depth ?? 4} onChange={e => setOption("depth", Number(e.target.value))}>
                                {DEPTH_VALUES.map(d => <option key={d} value={d}>{t("theme_input.depth_levels", { n: d })}</option>)}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>{t("theme_input.segment_length")}</label>
                            <select value={options.length ?? ""} onChange={e => setOption("length", e.target.value || undefined)}>
                                {LENGTH_VALUES.map((v, i) => (
                                    <option key={v} value={v}>
                                        {i === 0 ? t("lengths.medium") : i === 1 ? t("lengths.short") : t("lengths.long")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>{t("theme_input.genre_label")}</label>
                            <select value={options.genre ?? ""} onChange={e => setOption("genre", e.target.value || undefined)}>
                                {GENRES.map(g => (
                                    <option key={g} value={g}>
                                        {g ? t(`genres.${g}`) : t("genres.any")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="option-row">
                            <label>{t("theme_input.tone_label")}</label>
                            <select value={options.tone ?? ""} onChange={e => setOption("tone", e.target.value || undefined)}>
                                {TONES.map(tone => (
                                    <option key={tone} value={tone}>
                                        {tone ? t(`tones.${tone}`) : t("tones.any")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <button type="submit" className='generate-btn'>{t("theme_input.generate_btn")}</button>
            </form>

            <div className="examples">
                <h3>{t("theme_input.examples_title")}</h3>
                <ul>
                    {exampleThemes.slice(0, visibleExamples).map(theme => (
                        <li key={theme} onClick={() => setTheme(theme)}>{theme}</li>
                    ))}
                </ul>
                <div className="examples-pagination">
                    {visibleExamples < exampleThemes.length && (
                        <button
                            type="button"
                            className="read-more-btn"
                            onClick={() => setVisibleExamples(v => v + EXAMPLES_PAGE_SIZE)}
                        >
                            {t("story_generator.read_more")}
                        </button>
                    )}
                    {visibleExamples > EXAMPLES_PAGE_SIZE && (
                        <button
                            type="button"
                            className="read-less-btn"
                            onClick={() => setVisibleExamples(v => Math.max(EXAMPLES_PAGE_SIZE, v - EXAMPLES_PAGE_SIZE))}
                        >
                            {t("story_generator.read_less")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ThemeInput;
