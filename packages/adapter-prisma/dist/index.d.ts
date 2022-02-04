import type * as Prisma from "@prisma/client";
import type { Profile } from "next-auth";
import type { Adapter } from "next-auth/adapters";
export declare const PrismaAdapter: Adapter<Prisma.PrismaClient, never, Prisma.User, Profile & {
    emailVerified?: Date;
}, Prisma.Session>;
