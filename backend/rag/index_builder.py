# Backend/rag/index_builder.py

import json
import os
from llama_index.core import VectorStoreIndex, Document, Settings
from rag.gemini_embedding import get_embedding_model


def load_chunks():
    path = "rag_retrieved_output/chunks_with_embeddings.json"

    if not os.path.exists(path):
        raise Exception(f"❌ chunks.json not found at {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"✅ Loaded {len(data)} chunks")
    return data


def build_index():
    print("🔥 Starting index build...")

    Settings.embed_model = get_embedding_model()

    chunks = load_chunks()

    documents = []

    for chunk in chunks:
        text = f"""
SCENARIO: {chunk.get('scenario', '')}
ACTION_STEPS: {chunk.get('action_steps', [])}
RIGHTS: {chunk.get('rights', [])}
AUTHORITIES: {chunk.get('authorities', [])}
"""

        documents.append(Document(text=text))

    print(f"📄 Documents created: {len(documents)}")

    if len(documents) == 0:
        raise Exception("❌ No documents to index")

    index = VectorStoreIndex.from_documents(documents)

    save_path = "data/index"

    print("📁 Saving index to:", os.path.abspath(save_path))

    index.storage_context.persist(persist_dir=save_path)

    print("✅ INDEX CREATED SUCCESSFULLY")

if __name__ == "__main__":
    try:
        build_index()
    except Exception as e:
        print("❌ ERROR:", e)