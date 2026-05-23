from llama_index.embeddings.huggingface import HuggingFaceEmbedding

def get_embedding_model():
    """
    Returns embedding model (NOT embeddings)
    """
    return HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en"
    )