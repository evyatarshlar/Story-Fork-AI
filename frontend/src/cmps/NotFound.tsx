import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="not-found">
            <h2>404</h2>
            <p>{t("not_found.message")}</p>
            <button onClick={() => navigate("/")}>{t("not_found.go_home")}</button>
        </div>
    );
}

export default NotFound;
