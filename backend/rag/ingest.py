def chunk_text(text, size=500):
    chunks = []
    for i in range(0, len(text), size):
        chunks.append(text[i:i+size])
    return chunks

import uuid
from rag.gemini_embedding import get_embedding
from rag.pinecone_client import index

def store_chunks(chunks):
    vectors = []

    for chunk in chunks:
        embedding = get_embedding(chunk)

        vectors.append({
            "id": str(uuid.uuid4()),
            "values": embedding,
            "metadata": {
                "text": chunk
            }
        })

    index.upsert(vectors)