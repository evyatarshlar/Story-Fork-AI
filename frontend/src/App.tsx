import { useState, useEffect } from "react"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import StoryLoader from "./cmps/StoryLoader"
import StoryGenerator from "./cmps/StoryGenerator";
import NotFound from "./cmps/NotFound";
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light")
  }, [isDark])

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Interactive Story Generator</h1>
          <button className="theme-toggle" onClick={() => setIsDark(d => !d)} aria-label="Toggle dark mode">
            {isDark ? "☀️" : "🌙"}
          </button>
        </header>
        <main>
          <Routes>
            <Route path={"/story/:id"} element={<StoryLoader />} />
            <Route path={"/"} element={<StoryGenerator />}/>
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
