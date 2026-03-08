
ALTER TABLE public.evidence_files
ADD COLUMN key_indicator_id uuid REFERENCES public.key_indicators(id) ON DELETE SET NULL;

CREATE INDEX idx_evidence_files_key_indicator_id ON public.evidence_files(key_indicator_id);
