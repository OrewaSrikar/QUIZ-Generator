from pydantic import BaseModel
from typing import List, Dict, Optional

# Option Schemas
class OptionBase(BaseModel):
    option_text: str
    label: str

class OptionCreate(OptionBase):
    pass

class Option(OptionBase):
    id: int
    question_id: int

    class Config:
        from_attributes = True

# Question Schemas
class QuestionBase(BaseModel):
    question_text: str
    answer: str
    difficulty: str
    explanation: str

class QuestionCreate(QuestionBase):
    options: List[OptionCreate]

class Question(QuestionBase):
    id: int
    quiz_id: int
    options: List[Option] = []

    class Config:
        from_attributes = True

# Related Topic Schemas
class RelatedTopicBase(BaseModel):
    topic_name: str

class RelatedTopicCreate(RelatedTopicBase):
    pass

class RelatedTopic(RelatedTopicBase):
    id: int
    quiz_id: int

    class Config:
        from_attributes = True

# Quiz Schemas
class QuizBase(BaseModel):
    url: str
    title: str
    summary: str
    key_entities: Dict[str, List[str]]
    sections: List[str]

class QuizCreate(QuizBase):
    questions: List[QuestionCreate]
    related_topics: List[RelatedTopicCreate]

class Quiz(QuizBase):
    id: int
    questions: List[Question] = []
    related_topics: List[RelatedTopic] = []

    class Config:
        from_attributes = True

class QuizRequest(BaseModel):
    url: str
