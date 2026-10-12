CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  number text NOT NULL,
  client_name text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_fcfa numeric(14,0) NOT NULL DEFAULT 0 CHECK (total_fcfa >= 0),
  status text NOT NULL DEFAULT 'brouillon' CHECK (status IN ('brouillon','envoyee','payee','annulee')),
  issued_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  number text NOT NULL,
  client_name text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_fcfa numeric(14,0) NOT NULL DEFAULT 0 CHECK (total_fcfa >= 0),
  status text NOT NULL DEFAULT 'brouillon' CHECK (status IN ('brouillon','envoye','accepte','refuse')),
  valid_until date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  tool text NOT NULL CHECK (tool IN ('benefice','factures','whatsapp','lien-whatsapp','mesures')),
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 200),
  amount_fcfa numeric(14,0),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX invoices_user_idx ON public.invoices(user_id, created_at DESC);
CREATE INDEX quotes_user_idx ON public.quotes(user_id, created_at DESC);
CREATE INDEX operations_user_idx ON public.operations(user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices, public.quotes, public.operations TO authenticated;
GRANT ALL ON public.invoices, public.quotes, public.operations TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own invoices select" ON public.invoices FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own invoices insert" ON public.invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own invoices update" ON public.invoices FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own invoices delete" ON public.invoices FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own quotes select" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own quotes insert" ON public.quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own quotes update" ON public.quotes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own quotes delete" ON public.quotes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own operations select" ON public.operations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own operations insert" ON public.operations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own operations update" ON public.operations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own operations delete" ON public.operations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER invoices_touch BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER quotes_touch BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();