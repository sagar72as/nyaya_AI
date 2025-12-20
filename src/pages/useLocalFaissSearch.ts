
import { getOpenAiApiKey } from "./useChatbotApi";

// Helper: Compute cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Obtain OpenAI embedding for a text (same as your RAG code)
async function getEmbedding(text: string, EMBEDDING_DIMENSION = 1536): Promise<number[] | null> {
  const key = getOpenAiApiKey();
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-3-small",
    }),
  });

  const data = await res.json();
  const vector = data?.data?.[0]?.embedding;
  if (Array.isArray(vector) && vector.length === EMBEDDING_DIMENSION) {
    return vector;
  }
  return null;
}

export interface LocalClause {
  id: string;
  clause: string;
  embedding: number[];
}

export interface LocalFaissSearchOptions {
  clauses: LocalClause[];
  embeddingDimension?: number;
}

export async function searchLocalClauses(
  question: string,
  options: LocalFaissSearchOptions,
): Promise<string> {
  // Get embedding for user question
  const embedding = await getEmbedding(
    question,
    options.embeddingDimension || 1536
  );
  if (!embedding) return "";

  // Search local clauses for best match (cosine similarity)
  let topScore = -1;
  let topClause = "";
  for (const entry of options.clauses) {
    if (
      Array.isArray(entry.embedding) &&
      entry.embedding.length === (options.embeddingDimension || 1536)
    ) {
      const score = cosineSimilarity(embedding, entry.embedding);
      if (score > topScore) {
        topScore = score;
        topClause = entry.clause;
      }
    }
  }

  return topClause
    ? `Relevant contract clause: "${topClause}"`
    : "";
}

// Helper to deserialize clauses from uploaded JSON file
export function importLocalClausesFromFile(
  file: File
): Promise<LocalClause[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        // Accepts either array of {id, clause, embedding} or just array of clauses with embedding
        if (Array.isArray(data) && data.every((e) => "clause" in e && "embedding" in e)) {
          resolve(data);
        } else {
          reject("Invalid file format");
        }
      } catch (e) {
        reject("Error parsing file: " + e);
      }
    };
    reader.onerror = () => {
      reject("Could not read file");
    };
    reader.readAsText(file);
  });
}
