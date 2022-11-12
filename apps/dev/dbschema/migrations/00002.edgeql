CREATE MIGRATION m1hwynh377v3n6ufdd5pj6ykcez4euzbwfrh7h3zyg442f4la3pwlq
    ONTO m1d75kx72ckrzkq25o6q3prjixxhvhtfebjjx3vdifqdajk3w3t34a
{
  ALTER TYPE default::Account {
      ALTER LINK user {
          SET REQUIRED USING (std::assert_exists(.user));
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY userId {
          USING (.user.id);
      };
  };
  ALTER TYPE default::Session {
      ALTER LINK user {
          SET REQUIRED USING (std::assert_exists(.user));
      };
  };
  ALTER TYPE default::Session {
      ALTER PROPERTY userId {
          USING (.user.id);
      };
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY identifier {
          DROP CONSTRAINT std::exclusive;
      };
  };
};
