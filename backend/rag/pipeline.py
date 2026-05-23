# Backend/rag/pipeline.py

from rag.retriever import retrieve_docs
from google import genai
import os
import numpy as np
from dotenv import load_dotenv

load_dotenv()

# ================= CONFIG =================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_CHAT_KEY")
)

# ================= BUILD CONTEXT =================

def build_context(docs):
    context_parts = []

    for i, doc in enumerate(docs, 1):

        actions = " ".join(doc.get("action_steps", []))
        rights = " ".join(doc.get("rights", []))
        title = doc.get("title", "Legal Information")

        block = f"""
[CASE {i}]
Title:
{title}

Actions:
{actions}

Rights:
{rights}
"""

        context_parts.append(block.strip())

    return "\n\n".join(context_parts)


# ================= PROMPT =================

def build_prompt(query, context):

    return f"""
You are NyaySathi AI, a legal emergency assistant for Indian citizens.

Your task is to provide calm, practical, citizen-friendly legal guidance.

IMPORTANT RULES:
- Use SIMPLE language.
- Keep answers SHORT and STRUCTURED.
- Avoid difficult legal jargon.
- Do NOT invent fake laws.
- Use only the provided legal context.
- Be supportive and practical.

ALWAYS FOLLOW THIS FORMAT EXACTLY:

The Situation
<Brief explanation>

Your Legal Rights
- Right 1
- Right 2

Steps To Take
1. Step one
2. Step two

Important Warning
- Warning point

Helplines
- Relevant contact/help information


USER QUERY:
{query}


RETRIEVED LEGAL CONTEXT:
{context}


FINAL ANSWER:
"""


# ================= GENERATE RESPONSE =================

def generate_response(query):

    print("\n==============================")
    print("🧠 USER QUERY:")
    print(query)
    print("==============================")

    # Step 1: Retrieve documents
    docs = retrieve_docs(query)

    # Step 2: Build context
    context = build_context(docs)

    print("\n📚 RETRIEVED CONTEXT FROM PINECONE:")
    print(context)
    print("==============================")

    # Step 3: Build prompt
    prompt = build_prompt(query, context)

    # Step 4: Gemini Response
    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        final_answer = response.text

        print("\n🤖 GEMINI FINAL RESPONSE:")
        print(final_answer)
        print("==============================\n")
        
        return final_answer

    except Exception as e:

        print("\n❌ GEMINI ERROR:")
        print(str(e))
        print("==============================\n")

        return f"❌ LLM Error: {str(e)}"


# ================= RUN =================

if __name__ == "__main__":

    while True:

        query = input("\nEnter your situation (or type 'exit'): ")

        if query.lower() == "exit":
            break

        result = generate_response(query)

        print("\n🧠 NyaySathi Response:\n")
        print(result)