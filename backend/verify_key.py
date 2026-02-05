import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
print(f"Key present: {bool(key)}")
if key:
    print(f"Key starts with: {key[:4]}...")
    print(f"Key length: {len(key)}")

genai.configure(api_key=key)

print("Attempting to generate with gemini-1.5-flash...")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    resp = model.generate_content("Hello")
    print(f"Success! Response: {resp.text}")
except Exception as e:
    print(f"Failed with gemini-1.5-flash: {e}")

print("\nAttempting to list available models:")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"List models failed: {e}")
