import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, GitHub],
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
