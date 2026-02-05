from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List

from database import engine, get_db, Base
from models import Quiz, Question, Option, RelatedTopic
import schemas
import scraper
import llm_service

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Wiki Quiz Generator API")

# CORS Setup
origins = [
    "http://localhost:5173", # Vite Default
    "http://localhost:3000", # React Default
    "*", # Allow all for simplicity during dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Quiz Generator Backend is Running"}

@app.post("/generate", response_model=schemas.Quiz)
def generate_quiz(request: schemas.QuizRequest, db: Session = Depends(get_db)):
    # 1. Check if URL already exists
    existing_quiz = db.query(Quiz).options(
        joinedload(Quiz.questions).joinedload(Question.options),
        joinedload(Quiz.related_topics)
    ).filter(Quiz.url == request.url).first()
    
    if existing_quiz:
        return existing_quiz

    # 2. Scrape Content
    try:
        scraped_data = scraper.scrape_wikipedia(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Generate Quiz via LLM
    try:
        # We pass only text and title to LLM
        generated_data = llm_service.generate_quiz_from_text(scraped_data['text'], scraped_data['title'])
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM Generation Error: {str(e)}")

    # 4. Save to Database
    # Create Quiz Record
    db_quiz = Quiz(
        url=request.url, # Use the requested URL to ensure exact match for caching
        title=scraped_data['title'],
        summary=generated_data.get('summary', ''),
        key_entities=generated_data.get('key_entities', {}),
        sections=generated_data.get('sections', [])
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    # Create Questions & Options
    for q_data in generated_data.get('quiz', []):
        db_question = Question(
            quiz_id=db_quiz.id,
            question_text=q_data['question'],
            answer=q_data['answer'],
            difficulty=q_data['difficulty'],
            explanation=q_data['explanation']
        )
        db.add(db_question)
        db.commit()
        db.refresh(db_question)

        for opt_text in q_data['options']:
             # Find index
            idx = q_data['options'].index(opt_text)
            label = chr(65 + idx) # 0->A, 1->B...

            db_option = Option(
                question_id=db_question.id,
                option_text=opt_text,
                label=label
            )
            db.add(db_option)
        
    # Create Related Topics
    for topic in generated_data.get('related_topics', []):
        db_topic = RelatedTopic(
            quiz_id=db_quiz.id,
            topic_name=topic['topic_name']
        )
        db.add(db_topic)

    db.commit()
    # Eager load relationships before returning
    db.refresh(db_quiz)
    
    # We need to re-query with options to ensure relationships are loaded for return
    return db.query(Quiz).options(
        joinedload(Quiz.questions).joinedload(Question.options),
        joinedload(Quiz.related_topics)
    ).filter(Quiz.id == db_quiz.id).first()

@app.get("/history", response_model=List[schemas.Quiz])
def get_history(db: Session = Depends(get_db)):
    return db.query(Quiz).options(
        joinedload(Quiz.questions).joinedload(Question.options),
        joinedload(Quiz.related_topics)
    ).all()

@app.get("/quiz/{quiz_id}", response_model=schemas.Quiz)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).options(
        joinedload(Quiz.questions).joinedload(Question.options),
        joinedload(Quiz.related_topics)
    ).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz
