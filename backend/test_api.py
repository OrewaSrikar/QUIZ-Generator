import requests
import json

url = "http://localhost:8000/generate"
payload = {"url": "https://en.wikipedia.org/wiki/Rohit_Sharma"}
headers = {"Content-Type": "application/json"}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
