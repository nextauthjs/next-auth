migrate(
  (db) => {
    const collection = new Collection({
      id: "b1muh5lapcicift",
      created: "2023-01-22 15:03:27.861Z",
      updated: "2023-01-22 15:03:27.861Z",
      name: "next_auth_verificationToken",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "uvlrbxmy",
          name: "identifier",
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
          id: "t1halyno",
          name: "expires",
          type: "date",
          required: false,
          unique: false,
          options: {
            min: "",
            max: "",
          },
        },
        {
          system: false,
          id: "v0mjzelg",
          name: "token",
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
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      options: {},
    })

    return Dao(db).saveCollection(collection)
  },
  (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("b1muh5lapcicift")

    return dao.deleteCollection(collection)
  }
)
