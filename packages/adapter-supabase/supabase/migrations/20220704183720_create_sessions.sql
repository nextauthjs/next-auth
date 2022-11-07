-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.sessions
(
    id text COLLATE pg_catalog."default" NOT NULL DEFAULT uuid_generate_v4(),
    expires timestamp with time zone,
    "sessionToken" text COLLATE pg_catalog."default",
    "userId" text COLLATE pg_catalog."default",
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sessions
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.sessions
    OWNER to postgres;

GRANT ALL ON TABLE public.sessions TO authenticated;

GRANT ALL ON TABLE public.sessions TO postgres;

GRANT ALL ON TABLE public.sessions TO service_role;
