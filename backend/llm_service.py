import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Get API Key and strip any accidental whitespace
API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_quiz_from_text(text: str, title: str):
    """
    Generates a quiz from the provided text using Gemini API with model fallback.
    """
    if not API_KEY:
         raise ValueError("GEMINI_API_KEY not found in environment variables.")

    # Extensive list of models to try
    candidate_models = [
        'models/gemini-2.0-flash',
        'models/gemini-2.0-flash-001',
        'models/gemini-flash-latest',
        'models/gemini-pro-latest',
        'models/gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'models/gemini-1.5-flash'
    ]

    last_exception = None

    prompt = f"""
    You are an expert educational AI. Your task is to generate a quiz based on the following Wikipedia article content about "{title}".

    Output STRICT JSON format ONLY. Do not include markdown code block markers (like ```json).

    The JSON must match this structure:
    {{
      "summary": "A concise summary of the article (max 2 sentences)",
      "key_entities": {{
        "people": ["List of up to 3 key people associated"],
        "organizations": ["List of up to 3 key organizations"],
        "locations": ["List of up to 3 key locations"]
      }},
      "sections": ["List of 3-5 main sections covered in the quiz"],
      "quiz": [
        {{
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Correct Option Text (Must result in one of the options)",
          "difficulty": "easy|medium|hard",
          "explanation": "Short explanation of the answer"
        }}
        // Generate 5 questions total
      ],
      "related_topics": [
        {{ "topic_name": "Topic 1" }},
        {{ "topic_name": "Topic 2" }},
        {{ "topic_name": "Topic 3" }}
      ] 
    }}

    Article Content:
    {text}
    """

    for model_name in candidate_models:
        try:
            print(f"Trying model: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            response_text = response.text
            
            # Clean up if markdown blocks are included despite instructions
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
                
            data = json.loads(response_text)
            return data
        except Exception as e:
            print(f"Model {model_name} failed: {e}")
            last_exception = e
            continue
    
    raise Exception(f"All models failed. Please check your API key permissions. Last error: {str(last_exception)}")
