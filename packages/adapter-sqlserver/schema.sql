-- USERS table
IF NOT EXISTS
    (SELECT 1
     FROM sys.objects
     WHERE object_id = OBJECT_ID(N'[users]')
         AND type IN ( N'U' )
    )
BEGIN
    CREATE TABLE [users]
    (
        [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [df_users_id] DEFAULT NEWSEQUENTIALID(),
        [name] NVARCHAR(100) NULL,
        [email] NVARCHAR(100) NOT NULL,
        [emailVerified] DATETIME2 NULL,
        [image] VARCHAR(8000) NULL
    );
END
GO

-- PK constraint and index
IF NOT EXISTS
    (SELECT 1
     FROM sys.indexes
     WHERE object_id = OBJECT_ID(N'[users]')
         AND name = N'pk_users'
)
BEGIN
    ALTER TABLE [users]
    ADD CONSTRAINT [pk_users]
        PRIMARY KEY CLUSTERED (
            [id] ASC
        )
    WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF) ON [PRIMARY];
END
GO

-- ACCOUNTS table
IF NOT EXISTS
    (SELECT 1
     FROM sys.objects
     WHERE object_id = OBJECT_ID(N'[accounts]')
         AND type IN ( N'U' )
    )
BEGIN
    CREATE TABLE [accounts]
    (
        [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [df_accounts_id] DEFAULT NEWSEQUENTIALID(),
        [userId] UNIQUEIDENTIFIER NOT NULL,
        [type] NVARCHAR(100) NOT NULL,
        [provider] NVARCHAR(100) NOT NULL,
        [providerAccountId] NVARCHAR(100) NOT NULL,
        [refresh_token] VARCHAR(8000) NULL,
        [access_token] VARCHAR(8000) NULL,
        [expires_at] INT NULL,
        [token_type] NVARCHAR(100) NULL,
        [scope] NVARCHAR(100) NULL,
        [id_token] VARCHAR(8000) NULL,
        [session_state] NVARCHAR(100) NULL
    );
END
GO

-- PK constraint and index
IF NOT EXISTS
    (SELECT 1
     FROM sys.indexes
     WHERE object_id = OBJECT_ID(N'[accounts]')
         AND name = N'pk_accounts'
)
BEGIN
    ALTER TABLE [accounts]
    ADD CONSTRAINT [pk_accounts]
        PRIMARY KEY CLUSTERED (
            [id] ASC
        )
    WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF) ON [PRIMARY];
END
GO

-- FK index
IF NOT EXISTS
    (SELECT 1
     FROM sys.indexes
     WHERE object_id = OBJECT_ID(N'[accounts]')
         AND name = N'ix_accounts_users'
)
BEGIN
    CREATE INDEX [ix_accounts_users] ON [accounts] (userId);
END
GO

-- FK constraint
IF NOT EXISTS
    (SELECT 1
     FROM sys.foreign_keys
     WHERE parent_object_id = OBJECT_ID(N'[accounts]')
         AND name = N'fk_accounts_users'
)
BEGIN
    ALTER TABLE [accounts] WITH CHECK
    ADD CONSTRAINT [fk_accounts_users]
        FOREIGN KEY ([userId])
        REFERENCES [users] ([id]) ON DELETE CASCADE;
END
GO

-- SESSION table
IF NOT EXISTS
    (SELECT 1
     FROM sys.objects
     WHERE object_id = OBJECT_ID(N'[sessions]')
         AND type IN ( N'U' )
    )
BEGIN
    CREATE TABLE [sessions]
    (
        [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [df_sessions_id] DEFAULT NEWSEQUENTIALID(),
        [expires] DATETIME2 NOT NULL,
        [userId] UNIQUEIDENTIFIER NOT NULL,
        [sessionToken] VARCHAR(8000) NULL
    );
END
GO

-- PK index and constraint
IF NOT EXISTS
    (SELECT 1
     FROM sys.indexes
     WHERE object_id = OBJECT_ID(N'[sessions]')
         AND name = N'pk_sessions'
)
BEGIN
    ALTER TABLE [sessions]
    ADD CONSTRAINT [pk_sessions]
        PRIMARY KEY CLUSTERED (
            [id] ASC
        )
    WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF) ON [PRIMARY];
END
GO

-- FK index
IF NOT EXISTS
    (SELECT 1
     FROM sys.indexes
     WHERE object_id = OBJECT_ID(N'[sessions]')
         AND name = N'ix_sessions_users'
)
BEGIN
    CREATE INDEX [ix_sessions_users] ON [sessions] (userId)
END
GO

-- FK constraint
IF NOT EXISTS
    (SELECT 1
     FROM sys.foreign_keys
     WHERE parent_object_id = OBJECT_ID(N'[sessions]')
         AND name = N'fk_sessions_users'
)
BEGIN
    ALTER TABLE [sessions] WITH CHECK
    ADD CONSTRAINT [fk_sessions_users]
        FOREIGN KEY ([userId])
        REFERENCES [users] ([id]) ON DELETE CASCADE;
END
GO

-- VERIFICATION_TOKENS table
IF NOT EXISTS
    (SELECT 1
     FROM sys.objects
     WHERE object_id = OBJECT_ID(N'[verification_tokens]')
         AND type IN ( N'U' )
    )
BEGIN
    CREATE TABLE [verification_tokens]
    (
        [identifier] NVARCHAR(100) NOT NULL,
        [token] VARCHAR(700) NOT NULL,
        [expires] DATETIME2 NOT NULL
    );
END
GO

-- PK index and constraint
IF NOT EXISTS
    (SELECT 1
     FROM sys.indexes
     WHERE object_id = OBJECT_ID(N'[verification_tokens]')
         AND name = N'pk_verification_tokens'
)
BEGIN
    ALTER TABLE [verification_tokens]
    ADD CONSTRAINT [pk_verification_tokens]
        PRIMARY KEY CLUSTERED (
            [identifier] ASC,
            [token] ASC
        )
    WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF) ON [PRIMARY];
END
GO

CREATE OR ALTER PROCEDURE dbo.create_user
    @name NVARCHAR(100),
    @email NVARCHAR(100),
    @emailVerified DATETIME2,
    @image VARCHAR(8000)
AS
BEGIN

    INSERT INTO [users]
    (
        [name],
        [email],
        [emailVerified],
        [image]
    )
    OUTPUT
        INSERTED.[id],
        INSERTED.[name],
        INSERTED.[email],
        INSERTED.[emailVerified],
        INSERTED.[image]
    VALUES
    (@name, @email, @emailVerified, @image);

END
GO

CREATE OR ALTER PROCEDURE dbo.get_user_by_id @id UNIQUEIDENTIFIER
AS
BEGIN

    SELECT
        *
    FROM [users]
    WHERE [id] = @id;

END
GO

CREATE OR ALTER PROCEDURE dbo.get_user_by_email @email NVARCHAR(100)
AS
BEGIN

    SELECT
        *
    FROM [users]
    WHERE [email] = @email;

END
GO

CREATE OR ALTER PROCEDURE dbo.get_user_by_account
    @providerAccountId NVARCHAR(100),
    @provider NVARCHAR(100)
AS
BEGIN

    SELECT
        u.*
    FROM [users] u
        LEFT JOIN [accounts] a
            ON a.[userId] = u.[id]
    WHERE a.[providerAccountId] = @providerAccountId
          AND a.[provider] = @provider;

END
GO

CREATE OR ALTER PROCEDURE dbo.update_user
    @id UNIQUEIDENTIFIER,
    @name NVARCHAR(100) = NULL,
    @email NVARCHAR(100) = NULL,
    @emailVerified DATETIME2 = NULL,
    @image VARCHAR(8000) = NULL
AS
BEGIN

    UPDATE [users]
    SET
        [name] = COALESCE(@name, [name]),
        [email] = COALESCE(@email, [email]),
        [emailVerified] = COALESCE(@emailVerified, [emailVerified]),
        [image] = COALESCE(@image, [image])
    OUTPUT
        INSERTED.[id],
        INSERTED.[name],
        INSERTED.[email],
        INSERTED.[emailVerified],
        INSERTED.[image]
    WHERE [id] = @id;

END
GO

CREATE OR ALTER PROCEDURE dbo.link_account_to_user
    @provider NVARCHAR(100),
    @type NVARCHAR(100),
    @providerAccountId NVARCHAR(100),
    @refresh_token VARCHAR(8000),
    @token_type NVARCHAR(100),
    @scope NVARCHAR(100),
    @expires_at INT,
    @access_token VARCHAR(8000),
    @id_token VARCHAR(8000),
    @session_state NVARCHAR(100),
    @userId UNIQUEIDENTIFIER
AS
BEGIN

    INSERT INTO [accounts]
    (
        [provider],
        [type],
        [providerAccountId],
        [refresh_token],
        [token_type],
        [scope],
        [expires_at],
        [access_token],
        [id_token],
        [session_state],
        [userId]
    )
    OUTPUT
        INSERTED.[id],
        INSERTED.[userId],
        INSERTED.[type],
        INSERTED.[provider],
        INSERTED.[providerAccountId],
        INSERTED.[refresh_token],
        INSERTED.[access_token],
        INSERTED.[expires_at],
        INSERTED.[token_type],
        INSERTED.[scope],
        INSERTED.[id_token],
        INSERTED.[session_state]
    VALUES
    (@provider, @type, @providerAccountId, @refresh_token, @token_type, @scope,
      @expires_at, @access_token, @id_token, @session_state, @userId);

END
GO

CREATE OR ALTER PROCEDURE dbo.create_session_for_user
    @sessionToken VARCHAR(100),
    @userId UNIQUEIDENTIFIER,
    @expires DATETIME2
AS
BEGIN

    INSERT INTO [sessions]
    (
        [sessionToken],
        [userId],
        [expires]
    )
    OUTPUT
        INSERTED.[id],
        INSERTED.[sessionToken],
        INSERTED.[userId],
        INSERTED.[expires]
    VALUES
    (@sessionToken, @userId, @expires);

END
GO

CREATE OR ALTER PROCEDURE dbo.get_session_and_user @sessionToken VARCHAR(100)
AS
BEGIN

    DECLARE @userId UNIQUEIDENTIFIER;

    SELECT
        *
    FROM [sessions]
    WHERE [sessionToken] = @sessionToken;

    SELECT @userId = [userId]
    FROM [sessions]
    WHERE [sessionToken] = @sessionToken;

    EXEC dbo.get_user_by_id @userId;
END
GO

CREATE OR ALTER PROCEDURE dbo.update_session
    @sessionToken VARCHAR(100),
    @userId UNIQUEIDENTIFIER,
    @expires DATETIME2
AS
BEGIN

    UPDATE [sessions]
    SET
        [userId] = @userId,
        [expires] = @expires
    WHERE [sessionToken] = @sessionToken;

END
GO

CREATE OR ALTER PROCEDURE dbo.delete_session
    @sessionToken VARCHAR(100)
AS
BEGIN

    DELETE FROM [sessions]
    WHERE [sessionToken] = @sessionToken;
END
GO

CREATE OR ALTER PROCEDURE dbo.delete_user
    @userId UNIQUEIDENTIFIER
AS
BEGIN

    DELETE FROM [users]
    WHERE [id] = @userId;
END
GO

CREATE OR ALTER PROCEDURE dbo.create_verification_token
    @identifier NVARCHAR(100),
    @token VARCHAR(8000),
    @expires DATETIME2
AS
BEGIN

    INSERT INTO [verification_tokens]
    (
        [identifier],
        [token],
        [expires]
    )
    OUTPUT
        INSERTED.[identifier],
        INSERTED.[token],
        INSERTED.[expires]
    VALUES
    (@identifier, @token, @expires);

END
GO

CREATE OR ALTER PROCEDURE dbo.use_verification_token
    @identifier NVARCHAR(100),
    @token VARCHAR(8000)
AS
BEGIN

    DELETE FROM [verification_tokens]
    OUTPUT
        DELETED.[identifier],
        DELETED.[token],
        DELETED.[expires]
    WHERE [identifier] = @identifier AND [token] = @token;

END
GO

CREATE OR ALTER PROCEDURE dbo.unlink_account
    @providerAccountId NVARCHAR(100),
    @provider NVARCHAR(100)
AS
BEGIN

    DELETE FROM [accounts]
    WHERE [providerAccountId] = @providerAccountId AND [provider] = @provider;

END
GO