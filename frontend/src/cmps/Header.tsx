import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

export default function Header() {
  const { t, i18n } = useTranslation()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved !== null) return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === "he" ? "rtl" : "ltr"
  }, [i18n.language])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [])

  const toggleLanguage = () => {
    const next = i18n.language === "he" ? "en" : "he"
    i18n.changeLanguage(next)
    localStorage.setItem("lang", next)
  }

  const isRTL = i18n.language === "he"

  return (
    <header>
      <h1>{t("app.title")}</h1>
      <div className="hamburger-wrapper" ref={menuRef}>
        <button
          className={`hamburger-btn${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={t("app.menu")}
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {menuOpen && (
          <div className={`hamburger-menu${isRTL ? " menu-rtl" : ""}`} role="menu">
            <div className="menu-item">
              <span className="menu-item-label">{t("app.language")}</span>
              <button className="menu-action-btn lang-toggle" onClick={toggleLanguage}>
                {t("app.lang_switch")}
              </button>
            </div>

            <div className="menu-item">
              <span className="menu-item-label">
                {isDark ? "🌙 " : "☀️ "}
                {isDark ? t("app.theme_dark") : t("app.theme_light")}
              </span>
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

            <div className="menu-divider"></div>

            <div className="menu-item menu-item-login">
              <button className="login-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                {t("app.login")}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
