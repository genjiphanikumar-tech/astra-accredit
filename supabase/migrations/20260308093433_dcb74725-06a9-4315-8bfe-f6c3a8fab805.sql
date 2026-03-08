CREATE OR REPLACE FUNCTION public.setup_institution(_name text, _naac_id text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid;
  _inst_id uuid;
  _existing_count int;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if user already has an institution
  SELECT count(*) INTO _existing_count FROM institutions WHERE created_by = _user_id;
  IF _existing_count > 0 THEN
    RAISE EXCEPTION 'Institution already exists for this user';
  END IF;

  -- Create institution
  INSERT INTO institutions (name, naac_id, created_by)
  VALUES (_name, _naac_id, _user_id)
  RETURNING id INTO _inst_id;

  -- Promote user to admin
  UPDATE user_roles SET role = 'admin' WHERE user_id = _user_id;

  -- Seed 7 NAAC criteria
  INSERT INTO criteria (institution_id, criterion_number, criterion_name) VALUES
    (_inst_id, 1, 'Curricular Aspects'),
    (_inst_id, 2, 'Teaching-Learning and Evaluation'),
    (_inst_id, 3, 'Research, Innovations and Extension'),
    (_inst_id, 4, 'Infrastructure and Learning Resources'),
    (_inst_id, 5, 'Student Support and Progression'),
    (_inst_id, 6, 'Governance, Leadership and Management'),
    (_inst_id, 7, 'Institutional Values and Best Practices');

  RETURN _inst_id;
END;
$$;