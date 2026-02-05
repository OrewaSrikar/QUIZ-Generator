# AI Wiki Quiz Generator

A full-stack application that generates interactive quizzes from Wikipedia articles using Google Gemini LLM.

## Tech Stack
- **Backend**: Python (FastAPI), SQLAlchemy, BeautifulSoup4, Google Gemini API
- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Database**: SQLite (Default) / MySQL / PostgreSQL compatible

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API Key

### Backend Setup
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment:
   - Open `.env` and set your `GEMINI_API_KEY`.
   - Optionally update `DATABASE_URL` for MySQL/PostgreSQL.

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

## Usage
1. Go to the **Generator** tab.
2. Enter a Wikipedia URL (e.g., `https://en.wikipedia.org/wiki/Python_(programming_language)`).
3. Click "Generate Quiz".
4. Once generated, take the quiz!
5. Visit the **History** tab to see past quizzes.

## Project Structure
- `backend/`: FastAPI application, database models, scraper, LLM service.
- `frontend/`: React application, UI components, pages.
- `sample_data/`: Example JSON outputs.

## Screenshots
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ab4c447c-f77b-432d-a37f-91627e12fd21" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5371b621-76fb-4af9-8760-eb851f7fd7e6" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d83f685e-f290-4661-b502-9ea5aaf16816" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4b2bc3cb-c9c5-43b3-bd99-6b012d5fc348" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/021319a9-7688-437c-a041-73c702c1e3c1" />

