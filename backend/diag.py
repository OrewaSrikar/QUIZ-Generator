import google.generativeai as genai
import os
from dotenv import load_dotenv
import sys

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
genai.configure(api_key=API_KEY)

print(f"Library Version: {genai.__version__}")
print(f"API Key: {API_KEY[:5]}...")

try:
    print("Listing models...")
    found_any = False
    for m in genai.list_models():
        print(f"Model: {m.name} | Methods: {m.supported_generation_methods}")
        if 'generateContent' in m.supported_generation_methods:
            found_any = True
    
    if not found_any:
        print("NO MODELS FOUND that support generateContent")

except Exception as e:
    print(f"Error: {e}")
