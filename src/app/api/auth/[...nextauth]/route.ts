import { LoginResponse } from "@/types/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Multivision",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales requeridas");
        }
        const res = await fetch(
          "https://master.d2ygexviux9rer.amplifyapp.com/auth/login",
          {
            // const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          },
        );

        const data: LoginResponse = await res.json();

        if (!res.ok || !data.user) {
          throw new Error("Error al iniciar sesión");
        }

        return {
          id: data.user.id,
          name: `${data.user.nombre} ${data.user.apellido}`,
          email: data.user.email,
          role: data.user.role,
          sedeId: data.user.sedeId,
          accessToken: data.access_token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number;
        token.role = user.role as string;
        token.sedeId = user.sedeId as number;
        token.accessToken = user.accessToken as string;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
        session.user.sedeId = token.sedeId as number;
      }

      session.accessToken = token.accessToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
