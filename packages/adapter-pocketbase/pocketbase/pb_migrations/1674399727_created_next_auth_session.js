migrate(
  (db) => {
    const collection = new Collection({
      id: "0fbhwxgna5jb0k1",
      created: "2023-01-22 15:02:07.280Z",
      updated: "2023-01-22 15:02:07.280Z",
      name: "next_auth_session",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "bysaoe92",
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
          id: "8bwckxpy",
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
          id: "fc4ddcvq",
          name: "sessionToken",
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
    const collection = dao.findCollectionByNameOrId("0fbhwxgna5jb0k1")

    return dao.deleteCollection(collection)
  }
)
