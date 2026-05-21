from chroma_memory import collection
from modules.summarizer import _make_completion

def retrieve_context(query: str, n_results: int = 5) -> str:
    results = collection.query(query_texts=[query], n_results=n_results)
    documents = results.get("documents", [[]])[0]
    return "\n\n---\n\n".join(documents)

def ask_with_context(query: str) -> str:
    """Retrieve relevant past reports and generate an answer using RAG."""
    context = retrieve_context(query)
    prompt = f"""You are a cybersecurity AI assistant. Use the following context to answer the user's question.
If the context doesn't contain the answer, say so and provide general guidance.

Context:
{context}

User question: {query}

Answer:"""
    return _make_completion(prompt)
