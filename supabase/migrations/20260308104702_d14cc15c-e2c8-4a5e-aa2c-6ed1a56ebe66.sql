
-- Create key_indicators table for NAAC sub-criteria
CREATE TABLE public.key_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria_id uuid NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
  indicator_code text NOT NULL, -- e.g., "1.1", "1.2"
  indicator_name text NOT NULL,
  weightage numeric DEFAULT 0,
  completion_percentage numeric DEFAULT 0,
  evidence_count integer DEFAULT 0,
  required_evidence_count integer DEFAULT 5,
  status text DEFAULT 'not_started',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.key_indicators ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can view key indicators"
  ON public.key_indicators FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and editors can manage key indicators"
  ON public.key_indicators FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_key_indicators_updated_at
  BEFORE UPDATE ON public.key_indicators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
