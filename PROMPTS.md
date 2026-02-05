# LLM Prompts

Since this project uses the `google-generativeai` SDK directly for efficiency, here is the exact prompt template used in `backend/llm_service.py`:

## Quiz Generation Prompt

```text
You are an expert educational AI. Your task is to generate a quiz based on the following Wikipedia article content about "{title}".

Output STRICT JSON format ONLY. Do not include markdown code block markers (like \`\`\`json).

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
```
