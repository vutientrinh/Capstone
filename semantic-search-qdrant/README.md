# Semantic Search with Qdrant & Sentence Transformers

## Overview
This project demonstrates how to build a **semantic search engine** using:
- **Sentence Transformers** for text embeddings.
- **Qdrant** as a vector database for fast similarity searches.
- **FastAPI** for exposing search functionality as a web service.

## Features
- Convert text-based customer support tickets into **vector embeddings**.
- Store embeddings in **Qdrant** for fast retrieval.
- Perform **semantic similarity search** on customer issues.

## Installation
### 1. Run Qdrant in Docker
```bash
docker run -d -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
```
This command runs Qdrant vector database as container

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```
This installs all required Python dependencies from the `requirements.txt` file.

### 3. Load the Dataset
Ensure `customer_support_data.json` is present in the project root, which contains sample customer support ticket data. You can generate it via generate_data.py script.

### 4. Generate Embeddings and Upload to Qdrant
```bash
python upload_data.py
```
This script reads the dataset, converts text-based issues into vector embeddings using **Sentence Transformers**, and uploads them to the **Qdrant** vector database.

### 5. Start the FastAPI Server
```bash
uvicorn search-service:app --reload
```
This starts the **FastAPI web service**, making the search engine accessible at `http://localhost:8000`.

### 6. Access the API

- Open the interactive API documentation:
  ```bash
  http://localhost:8000/docs
  ```
  This allows testing API endpoints via Swagger UI.

- Perform a search query using `curl`:
  ```bash
  curl "http://localhost:8000/search?query='I can't log in'&top_k=3"
  ```
  This sends a GET request to the `/search` endpoint, retrieving the top 3 most relevant support tickets.# semantic-search-qdrant
