import { useState, useEffect } from "react";

const STEPS = [
    "Building your world...",
    "Creating characters...",
    "Writing your story...",
    "Connecting story paths...",
    "Almost ready...",
];

function LoadingStatus({ theme }: { theme: string }) {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex(i => (i + 1) % STEPS.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <h2>Generating Your {theme} Story</h2>

            <div className="loading-animation">
                <div className="spinner"></div>
            </div>

            <p className="loading-step">{STEPS[stepIndex]}</p>
        </div>
    );
}

export default LoadingStatus;
