from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer


class SemanticSearchEngine:
    def __init__(self, host="localhost", port=6333, collection_name="semantic_search", model_name="all-MiniLM-L6-v2"):
        """
        Initialize the search engine with necessary configurations.
        """
        self.client = QdrantClient(host=host, port=port)
        self.collection_name = collection_name
        self.model = SentenceTransformer(model_name)

    def search(self, query: str, top_k: int = 5):
        """
        Perform a semantic search in Qdrant.
        :param query: Search query (text)
        :param top_k: Number of top results to return
        :return: List of matching documents
        """
        query_vector = self.model.encode(query).tolist()

        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k
            )
        except Exception as e:
            return [{"error": str(e)}]

        return [
            {
                "id": point.id,
                "content": point.payload.get("content"),
                "created_at": point.payload.get("created_at"),
                "updated_at": point.payload.get("updated_at"),
                "comment_count": point.payload.get("comment_count"),                
                "liked_count": point.payload.get("liked_count"),
                "status": point.payload.get("status"),
                "type": point.payload.get("type"),
                "author": point.payload.get("author"),
                "topic": point.payload.get("topic"),
                "post_status": point.payload.get("post_status")
            }
            for point in results
        ]


if __name__ == "__main__":
    engine = SemanticSearchEngine()
    query = "sample post content about travel"
    search_results = engine.search(query)

    for idx, result in enumerate(search_results, start=1):
        print(f"Result {idx}: {result}\n")
