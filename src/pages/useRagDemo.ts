import { supabase } from "@/integrations/supabase/client";
import { getOpenAiApiKey } from "./useChatbotApi";

// EMBEDDING_DIMENSION should match the dimension you used with OpenAI and in pgvector, here it's 1536.
const EMBEDDING_DIMENSION = 1536;

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Function to embed the user question using OpenAI API
async function getEmbedding(text: string): Promise<number[] | null> {
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

// Fetch the best matching contract clause using Supabase's vector search
export async function getRagContext(userMessage: string): Promise<string> {
  const promptEmbedding = await getEmbedding(userMessage);
  if (!promptEmbedding) return "";

  // Prepare the embedding string to use for the search
  const embeddingString = `(${promptEmbedding.join(',')})`;

  // Get the 5 most similar clauses (Supabase returns embedding as string: '(x1,x2,...)')
  const { data, error } = await supabase
    .from("contract_clauses")
    .select("id, clause, embedding")
    .order("embedding", {
      ascending: true,
    })
    .limit(5)
    .maybeSingle();

  if (error) {
    console.error("Error querying Supabase vector search:", error);
    return "";
  }

  let bestClause = "";
  let bestScore = -1;
  if (data) {
    // When .limit(5) + .maybeSingle(), data is either null, a row, OR an array (if multiple rows)
    const rows = Array.isArray(data) ? data : [data];
    for (const row of rows) {
      let embeddingArr: number[] = [];
      if (typeof row.embedding === "string") {
        // Parse "(x1,x2,...)" to [x1, x2, ...]
        embeddingArr = row.embedding.replace(/[()]/g, "")
          .split(",")
          .map(Number);
      } else if (Array.isArray(row.embedding)) {
        embeddingArr = row.embedding;
      }
      if (embeddingArr.length === EMBEDDING_DIMENSION) {
        const score = cosineSimilarity(promptEmbedding, embeddingArr);
        if (score > bestScore) {
          bestScore = score;
          bestClause = row.clause;
        }
      }
    }
  }

  if (bestClause) {
    return `Relevant contract clause: "${bestClause}"`;
  }
  return "";
}
