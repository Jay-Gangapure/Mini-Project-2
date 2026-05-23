# rag/generate_embedding.py

from sentence_transformers import SentenceTransformer
from typing import List

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        """
        return self.model.encode(text).tolist()

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts
        """
        return self.model.encode(texts).tolist()


embedding_service = EmbeddingService()

def generate_query_embedding(text: str) -> List[float]:
    return embedding_service.generate_embedding(text)


def generate_embeddings(texts: List[str]) -> List[List[float]]:
    return embedding_service.generate_embeddings(texts)