
ALTER TABLE public.contract_clauses
ADD COLUMN text text;

ALTER TABLE public.contract_clauses
ADD COLUMN relevant_candidates jsonb;
