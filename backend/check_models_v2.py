import google.generativeai as genai
import os
import sys
from dotenv import load_dotenv

# Suppress warnings
import warnings
warnings.filterwarnings("ignore")

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("No API Key found")
    sys.exit(1)

genai.configure(api_key=API_KEY)

print("--- START MODEL LIST ---")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Model: {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
print("--- END MODEL LIST ---")
