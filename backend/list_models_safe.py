import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
genai.configure(api_key=API_KEY)

try:
    with open("models_utf8.txt", "w", encoding="utf-8") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"{m.name}\n")
    print("Done")
except Exception as e:
    print(f"Error: {e}")
