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
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  basePath: "/api/auth",
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    signIn: async ({ user, account }) => {
      try {
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
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
});
