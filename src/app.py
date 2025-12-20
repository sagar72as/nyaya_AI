from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np
import pickle
import faiss

app = Flask(__name__)
CORS(app, origins="*")

# === Load assets at startup ===
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = np.load("nyaya_embeddings.npy")
with open("nyaya_docs.pkl", "rb") as f:
    documents = pickle.load(f)
embedding_dim = embeddings.shape[1]
index = faiss.IndexFlatL2(embedding_dim)
index.add(embeddings)

@app.route("/rag", methods=["POST"])
def rag():
    data = request.get_json()
    question = data.get("query", "")
    if not question:
        return jsonify({"error": "Query required"}), 400

    # Embed the query
    query_emb = model.encode([question])
    D, I = index.search(query_emb, 5)  # Top 5 results

    results = []
    for idx, dist in zip(I[0], D[0]):
        results.append({
            "content": documents[idx]['content'],
            "score": float(dist)
        })
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
