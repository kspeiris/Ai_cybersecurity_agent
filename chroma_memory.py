import chromadb
from chromadb.utils import embedding_functions
from config import CHROMA_PERSIST_DIR, OPENAI_API_KEY

# Embedding function using OpenAI
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=OPENAI_API_KEY,
    model_name="text-embedding-3-small"
)

client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
collection = client.get_or_create_collection(
    name="cybersecurity_reports",
    embedding_function=openai_ef
)

def store_report_embedding(report_id: int, content: str, metadata: dict = None):
    """Store report content as a vector with metadata."""
    if metadata is None:
        metadata = {}
    # Chroma expects a unique ID as string
    doc_id = f"report_{report_id}"
    collection.add(
        documents=[content],
        metadatas=[metadata],
        ids=[doc_id]
    )

def search_reports(query: str, n_results: int = 5) -> list:
    """Semantic search over stored reports."""
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    return results
