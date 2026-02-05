import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str):
    """
    Scrapes a Wikipedia article and returns its content.
    """
    try:
        headers = {
            'User-Agent': 'DeepKlarityQuizBot/1.0 (educational purpose; contact@example.com)'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Get Title
        title_element = soup.find(id="firstHeading")
        title = title_element.get_text() if title_element else "Unknown Title"
        
        # Get Content (BodyContent)
        content_div = soup.find(id="bodyContent")
        
        # Remove unwanted elements (script, style, references, etc.)
        for script in content_div(["script", "style", "sup", "table", "div.reflist"]):
            script.decompose()
            
        # Get paragraphs
        paragraphs = content_div.find_all('p')
        text_content = ""
        for p in paragraphs:
            text_content += p.get_text() + "\n"
            
        # Limit text content to avoid token limits (approx first 15000 chars should be enough for a quiz)
        # We prioritize the intro and early sections
        text_content = text_content[:15000]
        
        return {
            "title": title,
            "text": text_content.strip(),
            "url": url
        }
        
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        raise Exception(f"Failed to scrape extraction from URL: {e}")
