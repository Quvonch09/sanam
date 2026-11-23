-- Store only hashed session identifiers and lifecycle metadata; never store cookie tokens or credentials.
CREATE TABLE public.sanam_admin_sessions (
  session_id_hash text PRIMARY KEY CHECK (session_id_hash ~ '^[0-9a-f]{64}$'),
  credential_fingerprint text NOT NULL CHECK (credential_fingerprint ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz NULL
);

CREATE INDEX sanam_admin_sessions_expires_at_idx
  ON public.sanam_admin_sessions (expires_at);

ALTER TABLE public.sanam_admin_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.sanam_admin_sessions FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sanam_admin_sessions TO service_role;
