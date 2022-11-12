CREATE MIGRATION m1pb4vknrnmyupin234hqixgzpze7xy3p63uq4ohmymp5tw76shlvq
    ONTO m15w5oi5p3hoxkvglytf3o3ps7ofyp42ugguutv6mmkaiucv7fetbq
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
};
