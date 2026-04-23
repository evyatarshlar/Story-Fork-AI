import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const STEP_KEYS = [
    "loading.step_1",
    "loading.step_2",
    "loading.step_3",
    "loading.step_4",
    "loading.step_5",
];

function LoadingStatus({ theme }: { theme: string }) {
    const { t } = useTranslation();
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex(i => (i + 1) % STEP_KEYS.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <h2>{t("loading.title", { theme })}</h2>

            <div className="loading-animation">
                <div className="spinner"></div>
            </div>

            <p className="loading-step">{t(STEP_KEYS[stepIndex])}</p>
        </div>
    );
}

export default LoadingStatus;
