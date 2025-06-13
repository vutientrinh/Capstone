import json
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer

# Load dataset from JSON file
with open("customer_support_data.json", "r") as file:
    data = json.load(file)

# Initialize Sentence Transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to Qdrant instance
client = QdrantClient("localhost", port=6333)

# Define Qdrant collection name
collection_name = "customer_support"

if client.collection_exists(collection_name):
    client.delete_collection(collection_name)

client.create_collection(
    collection_name=collection_name,
    vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
)

# Convert text data to embeddings and prepare points for insertion
points = []
for entry in data:
    embedding = model.encode(entry["customer_issue"]).tolist()
    point = models.PointStruct(
        id=int(entry["ticket_id"].split("-")[1]),  # Convert TKT-1000 to integer ID
        vector=embedding,
        payload={
            "category": entry["category"],
            "customer_issue": entry["customer_issue"],
            "resolution_response": entry["resolution_response"]
        }
    )
    points.append(point)

# Insert points into Qdrant
client.upsert(collection_name=collection_name, points=points)

print("✅ Data successfully uploaded to Qdrant!")