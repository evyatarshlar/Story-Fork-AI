# Story-Fork-AI

**Story-Fork-AI** is an AI-powered interactive storytelling platform. Enter a theme, and the application generates a full branching "Choose Your Own Adventure" story — powered by GPT-4o-mini. At every step you choose your path, and the story unfolds differently based on your decisions.

---

## Features

- AI-generated branching stories based on a custom theme
- Interactive gameplay with multiple-choice decisions
- Winning / losing story endings
- Story history navigation (go back a step)
- Share any story via a unique link
- Community stories feed
- Multi-language support — English & Hebrew

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Internationalization | i18next, react-i18next |
| Backend | FastAPI, Python |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| AI / LLM | LangChain, OpenAI GPT-4o-mini |
| Config | pydantic-settings, python-dotenv |

---

## Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [Python](https://www.python.org/) 3.10 or higher
- [PostgreSQL](https://www.postgresql.org/) (running locally or a remote instance)
- An [OpenAI API key](https://platform.openai.com/api-keys)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Story-Fork-AI.git
cd Story-Fork-AI
```

### 2. Backend setup

```bash
cd backend
```

Create a virtual environment and activate it:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# PostgreSQL
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=story_fork_ai

# App
DEBUG=False
ALLOWED_ORIGINS=http://localhost:5173
```

> **Tip:** For local development, set `DEBUG=True` to use a local SQLite database instead of PostgreSQL (no extra configuration needed).

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend/` folder (optional — defaults to `http://localhost:8000`):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Running the Application

### Development mode

**Start the backend** (from the `backend/` directory, with the virtual environment active):

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Start the frontend** (from the `frontend/` directory):

```bash
npm run dev
```

The app will be available at **http://localhost:5173**  
The API docs (Swagger UI) will be available at **http://localhost:8000/docs**

---

### Production build

**Build the frontend:**

```bash
cd frontend
npm run build
```

The compiled static files will be in `frontend/dist/`.

**Run the backend in production mode:**

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

> In production, make sure `DEBUG=False` in your `.env` and that your PostgreSQL database is properly configured.

---

## Project Structure

```
Story-Fork-AI/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt
│   ├── core/
│   │   ├── config.py         # App settings (pydantic-settings)
│   │   ├── models.py         # LLM response models
│   │   ├── prompts.py        # LangChain prompt templates
│   │   └── story_generator.py# AI story generation logic
│   ├── db/
│   │   └── database.py       # SQLAlchemy engine & session
│   ├── models/               # SQLAlchemy ORM models
│   ├── routers/              # FastAPI route handlers
│   └── schemas/              # Pydantic request/response schemas
└── frontend/
    ├── index.html
    ├── src/
    │   ├── App.tsx
    │   ├── types.ts
    │   ├── util.ts
    │   ├── cmps/             # React components
    │   └── locales/          # i18n translation files (en, he)
    └── vite.config.ts
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `DB_USER` | PostgreSQL username | Yes (if `DEBUG=False`) |
| `DB_PASSWORD` | PostgreSQL password | Yes (if `DEBUG=False`) |
| `DB_HOST` | PostgreSQL host | Yes (if `DEBUG=False`) |
| `DB_PORT` | PostgreSQL port (default: `5432`) | Yes (if `DEBUG=False`) |
| `DB_NAME` | PostgreSQL database name | Yes (if `DEBUG=False`) |
| `DEBUG` | Enable debug mode (`True` / `False`) | No (default: `False`) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | No |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |

---

## License

This project is licensed under the [MIT License](LICENSE).
