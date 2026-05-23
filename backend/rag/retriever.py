# Backend/rag/retriever.py
import json
from llama_index.core import StorageContext, load_index_from_storage, Settings
from rag.gemini_embedding import get_embedding_model

import os
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

CHUNK_FILE = BASE_DIR / "rag_retrieved_output" / "chunks_with_embeddings.json"


def load_chunks():
    if not CHUNK_FILE.exists():
        raise FileNotFoundError(f"Chunk file not found at {CHUNK_FILE}")

    with open(CHUNK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)
def keyword_filter(query, chunks):
    query_words = query.lower().split()

    filtered = []
    for chunk in chunks:
        chunk_keywords = chunk.get("keywords", [])
        chunk_keywords_text = " ".join(chunk_keywords).lower()
        if any(word.lower() in chunk_keywords_text for word in query_words):
            filtered.append(chunk)

    # fallback if nothing matched
    return filtered if filtered else chunks

def load_index():
    Settings.embed_model = get_embedding_model()

    storage_context = StorageContext.from_defaults(
        persist_dir="data/index"
    )

    return load_index_from_storage(storage_context)

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def retrieve_docs(query, top_k=5):
    # Step 1: load chunks
    chunks = load_chunks()

    # Step 2: keyword filtering 🔥
    filtered_chunks = keyword_filter(query, chunks)

    # Step 3: get query embedding
    embed_model = get_embedding_model()
    query_vector = embed_model.get_text_embedding(query)
    query_vector = np.array(query_vector)


    # Step 4: compute similarity
    scored_chunks = []
    for chunk in filtered_chunks:
        chunk_vector = chunk.get("embedding")
        if not chunk_vector:
            continue
        chunk_vector = np.array(chunk_vector)

        score = cosine_similarity(query_vector, chunk_vector)
        scored_chunks.append((score, chunk))

    # Step 5: sort
    scored_chunks.sort(key=lambda x: x[0], reverse=True)

    # Step 6: remove duplicates 🔥
    unique_chunks = []
    seen_texts = set()

    for score, chunk in scored_chunks:
        text = " ".join(chunk.get("action_steps", []))

        if text in seen_texts:
            continue
        seen_texts.add(text)
        unique_chunks.append({
            "text": text,
            "rights": chunk.get("rights", []),
            "score" :float(score),
            "source": chunk.get("source", "local_dataset")
        })

        if len(unique_chunks) >= top_k:
            break

    return unique_chunks

# 🔹 TEST
if __name__ == "__main__":
    query = input("Enter query: ")

    results = retrieve_docs(query)

    print("\n🔍 RETRIEVED CONTEXT:\n")

    for i, doc in enumerate(results, 1):
        print(f"\n--- Chunk {i} ---\n")
        print(doc)