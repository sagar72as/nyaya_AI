import pandas as pd
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer

# === Step 1: Load your CSV ===
csv_path = "legal_dataset.csv"
df = pd.read_csv(csv_path)
assert 'text' in df.columns, "CSV must have a 'text' column."

# === Step 2: Prepare data ===
documents = []
texts = []

for _, row in df.iterrows():
    text = str(row['text']).strip()
    if text:
        documents.append({
            'id': row.get('id', ''),    # '' if no id column
            'content': text
        })
        texts.append(text)

print(f"Loaded {len(texts)} clauses from {csv_path}")

# === Step 3: Generate embeddings ===
print("Generating embeddings (this may take a few minutes)...")
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(texts, show_progress_bar=True)
embeddings = np.array(embeddings)

# === Step 4: Save as .npy and .pkl ===
np.save("nyaya_embeddings.npy", embeddings)
with open("nyaya_docs.pkl", "wb") as f:
    pickle.dump(documents, f)

print("✅ Saved embeddings to nyaya_embeddings.npy")
print("✅ Saved documents to nyaya_docs.pkl")
