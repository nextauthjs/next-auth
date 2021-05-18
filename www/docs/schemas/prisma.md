# Prisma

Schema for the Prisma2 Adapter (`@next-auth/prisma-adapter`)

## Schema

```prisma filename="schema.prisma"
model Account {
  id                 String    @id @default(cuid())
  userId             String
  providerType       String
  providerId         String
  providerAccountId  String
  refreshToken       String?
  accessToken        String?
  accessTokenExpires DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  user               User      @relation(fields: [userId], references: [id])

  @@unique([providerId, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  expires      DateTime
  sessionToken String   @unique
  accessToken  String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model VerificationRequest {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, token])
}

```

Changes from the original Prisma Adapter

```diff
 model Account {
-  id                 Int       @default(autoincrement()) @id
+  id                 String    @id @default(cuid())
-  compoundId         String    @unique @map(name: "compound_id")
-  userId             Int       @map(name: "user_id")
+  userId             String
+  user               User      @relation(fields: [userId], references: [id])
-  providerType       String    @map(name: "provider_type")
+  providerType       String
-  providerId         String    @map(name: "provider_id")
+  providerId         String
-  providerAccountId  String    @map(name: "provider_account_id")
+  providerAccountId  String
-  refreshToken       String?   @map(name: "refresh_token")
+  refreshToken       String?
-  accessToken        String?   @map(name: "access_token")
+  accessToken        String?
-  accessTokenExpires DateTime? @map(name: "access_token_expires")
+  accessTokenExpires DateTime?
-  createdAt          DateTime  @default(now()) @map(name: "created_at")
+  createdAt          DateTime  @default(now())
-  updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+  updatedAt          DateTime  @updatedAt

-  @@index([providerAccountId], name: "providerAccountId")
-  @@index([providerId], name: "providerId")
-  @@index([userId], name: "userId")
-  @@map(name: "accounts")
+  @@unique([providerId, providerAccountId])
 }

 model Session {
-  id           Int      @default(autoincrement()) @id
+  id           String   @id @default(cuid())
-  userId       Int      @map(name: "user_id")
+  userId       String
+  user         User     @relation(fields: [userId], references: [id])
   expires      DateTime
-  sessionToken String   @unique @map(name: "session_token")
+  sessionToken String   @unique
-  accessToken  String   @unique @map(name: "access_token")
+  accessToken  String   @unique
-  createdAt    DateTime @default(now()) @map(name: "created_at")
+  createdAt    DateTime @default(now())
-  updatedAt    DateTime @default(now()) @map(name: "updated_at")
+  updatedAt    DateTime @updatedAt
-
-  @@map(name: "sessions")
 }

 model User {
-  id            Int       @default(autoincrement()) @id
+  id            String    @id @default(cuid())
   name          String?
   email         String?   @unique
-  emailVerified DateTime? @map(name: "email_verified")
+  emailVerified DateTime?
   image         String?
+  accounts      Account[]
+  sessions      Session[]
-  createdAt     DateTime  @default(now()) @map(name: "created_at")
+  createdAt     DateTime  @default(now())
-  updatedAt     DateTime  @default(now()) @map(name: "updated_at")
+  updatedAt     DateTime  @updatedAt

-  @@map(name: "users")
 }

 model VerificationRequest {
-  id         Int      @default(autoincrement()) @id
+  id         String   @id @default(cuid())
   identifier String
   token      String   @unique
   expires    DateTime
-  createdAt  DateTime  @default(now()) @map(name: "created_at")
+  createdAt  DateTime @default(now())
-  updatedAt  DateTime  @default(now()) @map(name: "updated_at")
+  updatedAt  DateTime @updatedAt

-  @@map(name: "verification_requests")
+  @@unique([identifier, token])
 }
