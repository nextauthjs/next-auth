CREATE MIGRATION m15w5oi5p3hoxkvglytf3o3ps7ofyp42ugguutv6mmkaiucv7fetbq
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Account {
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE PROPERTY access_token -> std::str;
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY expires_at -> std::int64;
      CREATE PROPERTY id_token -> std::str;
      CREATE PROPERTY refresh_token -> std::str;
      CREATE PROPERTY scope -> std::str;
      CREATE PROPERTY session_state -> std::str;
      CREATE PROPERTY token_type -> std::str;
      CREATE REQUIRED PROPERTY type -> std::str;
      CREATE REQUIRED PROPERTY userId -> std::str;
  };
  CREATE TYPE default::User {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY emailVerified -> std::datetime;
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
  };
  ALTER TYPE default::Account {
      CREATE LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
  };
  CREATE TYPE default::Session {
      CREATE LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires -> std::datetime;
      CREATE REQUIRED PROPERTY sessionToken -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY userId -> std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK sessions := (.<user[IS default::Session]);
  };
  CREATE TYPE default::VerificationToken {
      CREATE REQUIRED PROPERTY identifier -> std::str;
      CREATE REQUIRED PROPERTY token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.identifier, .token));
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires -> std::datetime;
  };
};
