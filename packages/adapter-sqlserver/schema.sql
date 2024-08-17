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
        [id] UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT [df_users_id] DEFAULT NEWSEQUENTIALID()
            CONSTRAINT [pk_users] PRIMARY KEY CLUSTERED ([id]),
        [name] NVARCHAR(100) NULL,
        [email] NVARCHAR(100) NOT NULL,
        [emailVerified] DATETIME2 NULL,
        [image] VARCHAR(8000) NULL
    );
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
        [id] UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT [df_accounts_id] DEFAULT NEWSEQUENTIALID()
            CONSTRAINT [pk_accounts] PRIMARY KEY CLUSTERED ([id]),
        [userId] UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT [fk_accounts_users] FOREIGN KEY ([userId])
            REFERENCES [users] ([id]) ON DELETE CASCADE,
        [type] NVARCHAR(100) NOT NULL,
        [provider] NVARCHAR(100) NOT NULL,
        [providerAccountId] NVARCHAR(100) NOT NULL,
        [refresh_token] VARCHAR(8000) NULL,
        [access_token] VARCHAR(8000) NULL,
        [expires_at] INT NULL,
        [token_type] NVARCHAR(100) NULL,
        [scope] NVARCHAR(100) NULL,
        [id_token] VARCHAR(8000) NULL,
        [session_state] NVARCHAR(100) NULL,

        INDEX [ix_accounts_users] (userId)
    );
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
        [id] UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT [df_sessions_id] DEFAULT NEWSEQUENTIALID()
            CONSTRAINT [pk_sessions] PRIMARY KEY CLUSTERED ([id]),
        [expires] DATETIME2 NOT NULL,
        [userId] UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT [fk_sessions_users] FOREIGN KEY ([userId])
            REFERENCES [users] ([id]) ON DELETE CASCADE,
        [sessionToken] VARCHAR(8000) NULL,

        INDEX [ix_sessions_users] (userId)
    );
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
        [identifier] NVARCHAR(100) NOT NULL
            CONSTRAINT [pk_verification_tokens] PRIMARY KEY CLUSTERED ([identifier], [token]),
        [token] VARCHAR(700) NOT NULL,
        [expires] DATETIME2 NOT NULL
    );
END
GO

-- AUTHENTICATOR table
IF NOT EXISTS
    (SELECT 1
     FROM sys.objects
     WHERE object_id = OBJECT_ID(N'[authenticators]')
         AND type IN ( N'U' )
    )
BEGIN
    CREATE TABLE [authenticators]
    (
        [credentialID] NVARCHAR(100) NOT NULL
            CONSTRAINT [pk_authenticators] PRIMARY KEY CLUSTERED ([userId], [credentialID]),
        [userId] UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT [fk_authenticators_user_id] FOREIGN KEY REFERENCES [dbo].[users]([id]),
        [providerAccountId] NVARCHAR(100) NOT NULL,
        [credentialPublicKey] VARCHAR(1000) NOT NULL,
        [counter] INT NOT NULL,
        [credentialDeviceType] NVARCHAR(100) NOT NULL,
        [credentialBackedUp] BIT NOT NULL,
        [transports] NVARCHAR(1000) NOT NULL,

        INDEX [ix_authenticators_credentialId] ([credentialId]),
    );
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

CREATE OR ALTER PROCEDURE dbo.get_accounts_by_provider
    @providerAccountId NVARCHAR(100),
    @provider NVARCHAR(100)
AS
BEGIN

    SELECT
        *
    FROM [accounts]
    WHERE [providerAccountId] = @providerAccountId AND [provider] = @provider;

END
GO

CREATE OR ALTER PROCEDURE dbo.create_authenticator
    @credentialID NVARCHAR(100),
    @userId UNIQUEIDENTIFIER,
    @providerAccountId NVARCHAR(100),
    @credentialPublicKey VARCHAR(1000),
    @counter INT,
    @credentialDeviceType NVARCHAR(100),
    @credentialBackedUp BIT,
    @transports NVARCHAR(1000)
AS
BEGIN

    INSERT INTO [authenticators]
    (
        [credentialID],
        [userId],
        [providerAccountId],
        [credentialPublicKey],
        [counter],
        [credentialDeviceType],
        [credentialBackedUp],
        [transports]
    )
    OUTPUT
        INSERTED.[credentialID],
        INSERTED.[userId],
        INSERTED.[providerAccountId],
        INSERTED.[credentialPublicKey],
        INSERTED.[counter],
        INSERTED.[credentialDeviceType],
        INSERTED.[credentialBackedUp],
        INSERTED.[transports]
    VALUES
    (@credentialID, @userId, @providerAccountId, @credentialPublicKey, @counter,
      @credentialDeviceType, @credentialBackedUp, @transports);

END
GO

CREATE OR ALTER PROCEDURE dbo.get_authenticator
    @credentialID NVARCHAR(100)
AS
BEGIN

    SELECT
        *
    FROM [authenticators]
    WHERE [credentialID] = @credentialID;

END
GO

CREATE OR ALTER PROCEDURE dbo.list_authenticators_by_user_id
    @userId UNIQUEIDENTIFIER
AS
BEGIN

    SELECT
        *
    FROM [authenticators]
    WHERE [userId] = @userId;

END
GO

CREATE OR ALTER PROCEDURE dbo.update_authenticator_counter
    @credentialID NVARCHAR(100),
    @counter INT
AS
BEGIN

    UPDATE [authenticators]
    SET
        [counter] = @counter
    OUTPUT
        INSERTED.[credentialID],
        INSERTED.[userId],
        INSERTED.[providerAccountId],
        INSERTED.[credentialPublicKey],
        INSERTED.[counter],
        INSERTED.[credentialDeviceType],
        INSERTED.[credentialBackedUp],
        INSERTED.[transports]
    WHERE [credentialID] = @credentialID;

END 