from fastapi import FastAPI, Query, Request
from search_engine import SemanticSearchEngine
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

# Initialize FastAPI app
app = FastAPI()

# Initialize the search engine
search_engine = SemanticSearchEngine()

# Load Sentence Transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")
client = QdrantClient("localhost", port=6333)

# Define Qdrant collection name
collection_name = "semantic_search"

if not client.collection_exists(collection_name):
    client.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
    )

# Define Post class
class Post(BaseModel):
    id: str
    content: str
    created_at: str
    updated_at: str
    comment_count: int    
    liked_count: int
    status: int
    type: int
    author: str
    topic: str
    post_status: int

@app.get("/search")
def search(query: str = Query(..., description="Enter search query"), top_k: int = 5):
    """
    Perform semantic search using the search engine.
    :param query: The user query
    :param top_k: Number of results to return (default: 5)
    :return: List of relevant customer support issues
    """
    results = search_engine.search(query, top_k)
    return {"query": query, "results": results}

@app.post("/receive-post")
async def receive_post(request: Request):
    full_data = await request.json()
    print("✅ Received:", full_data)  
    
    try:
        post = Post(
            id=full_data["id"],
            content=full_data["content"],
            created_at=full_data["created_at"],
            updated_at=full_data["updated_at"],
            comment_count=full_data["comment_count"],            
            liked_count=full_data["liked_count"],
            status=full_data["status"],
            type=full_data["type"],
            author=full_data["author"],
            topic=full_data["topic"],
            post_status=full_data["post_status"]
        )
        
        # Generate embedding for the post content
        embedding = model.encode(post.content).tolist()
        
        # Create point for Qdrant
        point = models.PointStruct(
            id=post.id,
            vector=embedding,
            payload={
                "id": post.id,
                "content": post.content,
                "author": post.author,
                "topic": post.topic,
                "created_at": post.created_at,
                "status": post.status,
                "post_status": post.post_status,
                "liked_count": post.liked_count,
                "comment_count": post.comment_count
            }
        )
        
        # Insert/update the point in Qdrant
        client.upsert(collection_name=collection_name, points=[point])
        
        print(f"✅ Added post {post.id} to vector database")
        return {"message": "Post received and indexed", "data": post}
    except Exception as e:
        print(f"Error creating Post: {e}")
        return {"message": f"Error: {str(e)}"}, 400

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
