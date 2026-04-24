import { LoginResponse } from "@/types/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(process.env.LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data?.message || "AUTH_API_ERROR");
  }

  return data;
}

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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("EMAIL_OR_PASSWORD_NO_INGRESADO_EN_FORMULARIO");
          }

          const data = await loginUser(credentials.email, credentials.password);

          return {
            id: data.user.id,
            name: `${data.user.nombre} ${data.user.apellido}`,
            email: data.user.email,
            role: data.user.role,
            sedeId: data.user.sedeId,
            accessToken: data.access_token,
          };
        } catch (err: any) {
          throw new Error(err.message || "API_ERROR");
        }
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

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
