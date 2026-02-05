from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), unique=True, index=True)
    title = Column(String(255))
    summary = Column(Text)
    # Storing simpler lists as JSON strings if using SQLite/MySQL without native array support
    # Or we can use separate tables for normalized design. Let's use JSON for simplicity regarding "sections" and "key_entities"
    key_entities = Column(JSON) 
    sections = Column(JSON) 
    
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    related_topics = relationship("RelatedTopic", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(Text)
    answer = Column(Text) # The correct answer text
    difficulty = Column(String(50))
    explanation = Column(Text)

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    option_text = Column(Text)
    label = Column(String(1)) # A, B, C, D

    question = relationship("Question", back_populates="options")


class RelatedTopic(Base):
    __tablename__ = "related_topics"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    topic_name = Column(String(255))

    quiz = relationship("Quiz", back_populates="related_topics")
