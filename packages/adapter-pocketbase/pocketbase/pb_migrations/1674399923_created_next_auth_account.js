migrate(
  (db) => {
    const collection = new Collection({
      id: "kmvbgt47p7bndel",
      created: "2023-01-22 15:05:23.693Z",
      updated: "2023-01-22 15:05:23.693Z",
      name: "next_auth_account",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "m3zu6rgq",
          name: "userId",
          type: "relation",
          required: false,
          unique: false,
          options: {
            maxSelect: 1,
            collectionId: "qhn8ngzgaw4k3x1",
            cascadeDelete: true,
          },
        },
        {
          system: false,
          id: "papslhfw",
          name: "type",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "uet14quu",
          name: "provider",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "j5q5swrw",
          name: "providerAccountId",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "6izkcmmg",
          name: "refresh_token",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "vkq6dwzy",
          name: "access_token",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "rxozyv0h",
          name: "expires_at",
          type: "number",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
          },
        },
        {
          system: false,
          id: "8s4adqhe",
          name: "token_type",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "agktlck0",
          name: "scope",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "u4i6gwbz",
          name: "id_token",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "l0ijqeyq",
          name: "session_state",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "hpc1qbl9",
          name: "oauth_token_secret",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "zsp5yoed",
          name: "oauth_token",
          type: "text",
          required: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
      ],
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: "",
      options: {},
    })

    return Dao(db).saveCollection(collection)
  },
  (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("kmvbgt47p7bndel")

    return dao.deleteCollection(collection)
  }
)
