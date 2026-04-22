import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <h2>404</h2>
            <p>Oops! This page doesn't exist.</p>
            <button onClick={() => navigate("/")}>Go to Story Generator</button>
        </div>
    );
}

export default NotFound;
