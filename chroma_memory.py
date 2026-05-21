import chromadb
from chromadb.utils import embedding_functions
from config import CHROMA_PERSIST_DIR

# Local embedding function, so semantic search does not require an external LLM key.
embedding_function = embedding_functions.DefaultEmbeddingFunction()

client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
collection = client.get_or_create_collection(
    name="cybersecurity_reports",
    embedding_function=embedding_function
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
