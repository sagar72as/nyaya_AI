
-- Enable the pgvector extension (if it's not already enabled)
create extension if not exists vector;

-- Create the table to store contract clauses and their embeddings
create table public.contract_clauses (
  id uuid primary key default gen_random_uuid(),
  clause text not null,
  embedding vector(1536) not null  -- 1536 is common for OpenAI embeddings, adjust if needed
);

-- (Optional) Create an index on the embedding column for faster search
create index on public.contract_clauses using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Enable Row Level Security (RLS) but allow full access for now (for easy ingestion and querying)
alter table public.contract_clauses enable row level security;

create policy "Allow full access to contract_clauses"
  on public.contract_clauses
  for all
  using (true);

