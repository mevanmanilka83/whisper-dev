import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import { randomUUID } from "crypto";
import type { Adapter } from "next-auth/adapters";

// Custom adapter that generates profileId
const customPrismaAdapter: Adapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data) => {
    const profileId = randomUUID();
    // Remove the id field to let Prisma auto-generate MongoDB ObjectID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...userData } = data;
    const user = await prisma.user.create({
      data: {
        ...userData,
        profileId,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email || "",
      image: user.image,
      emailVerified: user.emailVerified,
    };
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: customPrismaAdapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      // Include the user ID in the session
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    signIn: async ({ user, account }) => {
      if (!user.email) return false;

      // Get all accounts associated with the email
      const existingUser = await prisma.user.findFirst({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser) {
        // If this is a different provider but same email, link the accounts
        const existingAccount = existingUser.accounts.find(
          (acc) => acc.provider === account?.provider
        );

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account?.type || "oauth",
              provider: account?.provider || "",
              providerAccountId: account?.providerAccountId || "",
              access_token: account?.access_token,
              token_type: account?.token_type,
              scope: account?.scope,
              id_token: account?.id_token,
            },
          });
        }
        return true;
      }

      return true;
    },
  },
});
