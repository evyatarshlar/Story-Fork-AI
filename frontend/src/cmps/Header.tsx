import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function Header() {
  const { t, i18n } = useTranslation()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved !== null) return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === "he" ? "rtl" : "ltr"
  }, [i18n.language])

  const toggleLanguage = () => {
    const next = i18n.language === "he" ? "en" : "he"
    i18n.changeLanguage(next)
    localStorage.setItem("lang", next)
  }

  return (
    <header>
      <h1>{t("app.title")}</h1>
      <div className="header-controls">
        <button className="lang-toggle" onClick={toggleLanguage}>
          {t("app.lang_switch")}
        </button>
        <div className="theme-switch-container">
          <input
            type="checkbox"
            id="theme-toggle"
            className="theme-switch-checkbox"
            checked={isDark}
            onChange={() => setIsDark(d => !d)}
            aria-label={t("app.toggle_dark_mode")}
          />
          <label htmlFor="theme-toggle" className="theme-switch-label">
            <span className="theme-switch-slider"></span>
          </label>
        </div>
      </div>
    </header>
  )
}
