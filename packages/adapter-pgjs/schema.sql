\set ON_ERROR_STOP true

--- Drop All Tables
--- Credit [Supabase](https://supabase.com/docs/guides/database/postgres/dropping-all-tables-in-schema)

do $$ declare
    r record;
begin
    for r in (select tablename from pg_tables where schemaname = 'public') loop
        execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
    end loop;
end $$;

--- PG-NANOID [Optional ID generation server-side]
--- Credit [Nikola Stanković](https://github.com/viascom/nanoid-postgres)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP FUNCTION IF EXISTS nanoid(int, text, float);

CREATE OR REPLACE FUNCTION nanoid(
    size int DEFAULT 7, -- The number of symbols in the NanoId String. Must be greater than 0.
    alphabet text DEFAULT '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', -- The symbols used in the NanoId String. Must contain between 1 and 255 symbols.
    additionalBytesFactor float DEFAULT 1.02 -- The additional bytes factor used for calculating the step size. Must be equal or greater then 1.
)
    RETURNS text -- A randomly generated NanoId String
    LANGUAGE plpgsql
    VOLATILE
    PARALLEL SAFE
--- Uncomment the following line if you have superuser privileges
--- LEAKPROOF
AS
$$
DECLARE
    alphabetArray  text[];
    alphabetLength int := 64;
    mask           int := 63;
    step           int := 34;
BEGIN
    IF size IS NULL OR size < 1 THEN
        RAISE EXCEPTION 'The size must be defined and greater than 0!';
    END IF;

    IF alphabet IS NULL OR length(alphabet) = 0 OR length(alphabet) > 255 THEN
        RAISE EXCEPTION 'The alphabet can''t be undefined, zero or bigger than 255 symbols!';
    END IF;

    IF additionalBytesFactor IS NULL OR additionalBytesFactor < 1 THEN
        RAISE EXCEPTION 'The additional bytes factor can''t be less than 1!';
    END IF;

    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);
    mask := (2 << cast(floor(log(alphabetLength - 1) / log(2)) as int)) - 1;
    step := cast(ceil(additionalBytesFactor * mask * size / alphabetLength) AS int);

    IF step > 1024 THEN
        step := 1024; -- The step size % can''t be bigger then 1024!
    END IF;

    RETURN nanoid_optimized(size, alphabet, mask, step);
END
$$;

-- Generates an optimized random string of a specified size using the given alphabet, mask, and step.
-- This optimized version is designed for higher performance and lower memory overhead.
-- No checks are performed! Use it only if you really know what you are doing.
DROP FUNCTION IF EXISTS nanoid_optimized (int, text, int, int);

CREATE OR REPLACE FUNCTION nanoid_optimized(
    size int, -- The desired length of the generated string.
    alphabet text, -- The set of characters to choose from for generating the string.
    mask int, -- The mask used for mapping random bytes to alphabet indices. Should be `(2^n) - 1` where `n` is a power of 2 less than or equal to the alphabet size.
    step int -- The number of random bytes to generate in each iteration. A larger value may speed up the function but increase memory usage.
)
    RETURNS text -- A randomly generated NanoId String
    LANGUAGE plpgsql
    VOLATILE
    PARALLEL SAFE
    -- Uncomment the following line if you have superuser privileges
    --LEAKPROOF
AS
$$
DECLARE
    idBuilder      text := '';
    counter        int  := 0;
    bytes          bytea;
    alphabetIndex  int;
    alphabetArray  text[];
    alphabetLength int  := 64;
BEGIN
    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);

    LOOP
        bytes := gen_random_bytes(step);
        FOR counter IN 0..step - 1
            LOOP
                alphabetIndex := (get_byte(bytes, counter) & mask) + 1;
                IF alphabetIndex <= alphabetLength THEN
                    idBuilder := idBuilder || alphabetArray[alphabetIndex];
                    IF length(idBuilder) = size THEN
                        RETURN idBuilder;
                    END IF;
                END IF;
            END LOOP;
    END LOOP;
END
$$;

-- SCHEMA

CREATE TABLE users (
    id TEXT NOT NULL DEFAULT nanoid (),
    name TEXT,
    email TEXT,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
    "userId" TEXT NOT NULL REFERENCES users (id) ON DELETE cascade,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    id_token TEXT,
    scope TEXT,
    session_state TEXT,
    token_type TEXT,
    PRIMARY KEY (provider, "providerAccountId")
);

CREATE TABLE sessions (
    "userId" TEXT NOT NULL REFERENCES users (id) ON DELETE cascade,
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" TEXT NOT NULL,
    PRIMARY KEY ("sessionToken")
);

create table authenticators (
    "credentialID" text unique not null,
    "userId" TEXT NOT NULL,
    "providerAccountId" text not null,
    "credentialPublicKey" text not null,
    counter integer not null,
    "credentialDeviceType" text not null,
    "credentialBackedUp" boolean not null,
    transports text,
    PRIMARY KEY ("userId", "credentialID"),
    CONSTRAINT "auth_user_fkey" FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);