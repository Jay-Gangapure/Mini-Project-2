from pinecone import Pinecone
from rag.generate_embedding import embedding_service
import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------
# PINECONE INITIALIZATION
# ---------------------------------------------------------
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

index = pc.Index(
    os.getenv("PINECONE_INDEX")
)


# ---------------------------------------------------------
# RAG SERVICE
# ---------------------------------------------------------
class RAGService:

    def retrieve_context(self, query: str):

        try:

            print("\n===================================")
            print("🔍 PINECONE SEARCH STARTED")
            print("===================================")
            print("USER QUERY:")
            print(query)

            # -------------------------------------------------
            # GENERATE QUERY EMBEDDING
            # -------------------------------------------------
            query_embedding = (
                embedding_service.generate_embedding(query)
            )

            print("\n✅ QUERY EMBEDDING GENERATED")
            print(f"Embedding Length: {len(query_embedding)}")

            # -------------------------------------------------
            # PINECONE VECTOR SEARCH
            # -------------------------------------------------
            results = index.query(
                vector=query_embedding,
                top_k=5,
                include_metadata=True
            )

            matches = results.get("matches", [])

            print(f"\n✅ MATCHES FOUND: {len(matches)}")

            # -------------------------------------------------
            # EXTRACT CONTEXT
            # -------------------------------------------------
            context = []

            for i, match in enumerate(matches, start=1):

                score = match.get("score", 0)

                metadata = match.get("metadata", {})

                text = metadata.get("text", "")

                print("\n-----------------------------------")
                print(f"MATCH #{i}")
                print(f"SCORE: {score}")
                print("-----------------------------------")

                print(text[:300])  # preview first 300 chars

                context.append(text)

            final_context = "\n\n".join(context)

            print("\n===================================")
            print("✅ FINAL CONTEXT CREATED")
            print("===================================")

            return final_context

        except Exception as e:

            print("\n===================================")
            print("❌ RAG SERVICE ERROR")
            print("===================================")
            print(str(e))

            return ""


# ---------------------------------------------------------
# INSTANCE
# ---------------------------------------------------------
rag_service = RAGService()