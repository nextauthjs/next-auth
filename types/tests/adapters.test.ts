import Adapters from "next-auth/adapters"

// ExpectType TypeORMAdapter["Adapter"]
Adapters.Default({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
})

// ExpectType TypeORMAdapter
Adapters.TypeORM.Adapter({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
})

// ExpectType PrismaAdapter
Adapters.Prisma.LegacyAdapter({
  prisma: {},
  modelMapping: {
    User: "foo",
    Account: "bar",
    Session: "session",
    VerificationRequest: "foo",
  },
})
