--
-- Create authenticators table
--
CREATE TABLE IF NOT EXISTS  next_auth.authenticators
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "credentialID" text NOT NULL,
    "credentialPublicKey" text NOT NULL,
    "userId" uuid,
    provider text DEFAULT 'webauthn',
    "providerAccountId" text,
    counter bigint,
    "credentialDeviceType" text,
    "credentialBackedUp" boolean,
    transports text,
    CONSTRAINT authenticators_pkey PRIMARY KEY (id),
    CONSTRAINT "credentialID_unique" UNIQUE ("credentialID"),
    CONSTRAINT "authenticators_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES  next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "authenticators_provider_providerAccountId_fkey" FOREIGN KEY (provider, "providerAccountId")
        REFERENCES  next_auth.accounts (provider, "providerAccountId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.authenticators TO postgres;
GRANT ALL ON TABLE next_auth.authenticators TO service_role;
