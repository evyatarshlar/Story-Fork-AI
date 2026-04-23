import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import StoryLoader from "./cmps/StoryLoader"
import StoryGenerator from "./cmps/StoryGenerator";
import NotFound from "./cmps/NotFound";
import Footer from "./cmps/Footer";
import Header from "./cmps/Header";
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path={"/story/:id"} element={<StoryLoader />} />
            <Route path={"/"} element={<StoryGenerator />}/>
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
