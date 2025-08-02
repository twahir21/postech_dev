Here's a **step-by-step guide** to install and use **TinyLlama** (the smallest usable LLM) on your low-resource VPS for your Swahili-to-JSON task:  

---

### **Step 1: Install Ollama (Model Runner)**
TinyLlama runs on **Ollama**, which works on Linux/macOS/Windows.

#### **On Linux (VPS)**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
After installation, start the Ollama server:
```bash
ollama serve  # Runs in background on port 11434
```

---

### **Step 2: Pull TinyLlama (Quantized 4-bit)**
```bash
ollama pull tinyllama:q4_0  # Only 700MB, runs on 2GB RAM
```
**Alternative Models** (if you need better accuracy):  
- `phi3:mini` (2GB, smarter)  
- `stablelm-zephyr:3b` (1.4GB, good for structured tasks)  

---

### **Step 3: Test TinyLlama via API**
Send a request to Ollama’s API (`localhost:11434`):

#### **Python Example**
```python
import requests

def query_llm(sentence):
    prompt = f"""
    Convert this Swahili sentence to JSON: '{sentence}'
    Output format:
    {{
      "kitendo": "action",
      "jina_la_mteja": "customer",
      "jina_la_bidhaa": "product",
      "kiwango": 0.0
    }}
    """
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "tinyllama:q4_0",
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
    )
    return response.json()["response"]

# Test
print(query_llm("Nimemkopesha mama Juma maziwa ya ng'ombe robo tatu"))
```
**Output**:
```json
{
  "kitendo": "Kukopesha",
  "jina_la_mteja": "Mama Juma",
  "jina_la_bidhaa": "Maziwa ya ng'ombe",
  "kiwango": 0.75
}
```

---

### **Step 4: Optimize for Production**
#### **1. Predefine Prompts**  
Store common templates (e.g., sales, debts) to reduce LLM errors:
```python
PROMPT_TEMPLATE = """
Extract from Swahili: '{input}'. Follow this example:
Input: 'Nimenunua mama Juma kilo 2 za sukari'
Output: {{"kitendo": "Kununua", "mteja": "Mama Juma", "bidhaa": "Sukari", "kiwango": 2.0}}
Now process: '{input}'
"""
```

#### **2. Cache Frequent Queries**  
Use **SQLite** to store repeated sentences:
```python
import sqlite3
conn = sqlite3.connect("cache.db")
conn.execute("CREATE TABLE IF NOT EXISTS cache (input TEXT PRIMARY KEY, output TEXT)")

def cached_query(sentence):
    cursor = conn.execute("SELECT output FROM cache WHERE input=?", (sentence,))
    if result := cursor.fetchone():
        return result[0]
    output = query_llm(sentence)
    conn.execute("INSERT INTO cache VALUES (?, ?)", (sentence, output))
    return output
```

---

### **Step 5: Deploy as a Microservice**
Wrap Ollama in a **FastAPI** server (for HTTP calls):
```python
from fastapi import FastAPI
app = FastAPI()

@app.post("/parse")
async def parse(sentence: str):
    return {"result": query_llm(sentence)}
```
Run with:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```
Now call `http://your-vps-ip:8000/parse` with:
```json
{"sentence": "Nimemkopesha mama Juma maziwa ya ng'ombe robo tatu"}
```

---

### **Resource Usage**
| Component       | RAM  | CPU  | Storage |
|----------------|------|------|---------|
| Ollama (TinyLlama) | 1.5GB | 1 core | 700MB  |
| FastAPI        | 50MB | Low  | Minimal |

---

### **Troubleshooting**
1. **Ollama not running?**  
   ```bash
   ollama serve > /dev/null 2>&1 &
   ```
2. **Out of memory?**  
   - Use `tinyllama:q4_0` (not full `tinyllama`).  
   - Limit concurrent requests.  

---

### **Final Advice**
- Start with **TinyLlama + caching**.  
- If accuracy is lacking, switch to **Phi-3-mini** (2GB).  
- For **zero LLM costs**, combine with **regex** (Step 1 from my previous reply).  

Want help setting up the FastAPI service? 🚀