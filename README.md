# PT Gym WebApp

A mobile-first gym tracking and AI coaching application.

## Structure

- `frontend/`: Next.js Web Application (PWA).
- `backend/`: FastAPI Backend with OpenAI integration.

## Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create `.env` file and add your OpenAI API Key:
   ```
   OPENAI_API_KEY=sk-...
   ```
5. Run server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Features
- **Persistence**: User profile and plans are saved in a local SQLite database (`pt_gym.db`).
- **Global Chat & Speech-to-Text**: AI Coach accessible from any screen with voice input support.
- **Dynamic Navigation**:
    - **Intro**: Onboarding for new users.
    - **Home**: Dashboard with Muscle Calendar and Cost Tracker.
    - **Workout**: Daily exercise view with interactive logging.
    - **Nutrition**: Daily meal plan view.
- **Cost Tracker**: Editable cost per session and total cost.
- **Muscle Calendar**: Clickable calendar to view specific daily plans.
