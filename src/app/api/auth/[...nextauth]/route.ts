import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginResponse } from "@/types/auth";

async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  if (!process.env.LOGIN_URL) {
    throw new Error("LOGIN_URL no está definido");
  }

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

  //Estrategia JWT todo vive en una cookie
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Multivision",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("EMAIL_O_PASSWORD_FALTANTE");
        }

        const data = await loginUser(credentials.email, credentials.password);
        const user = data.user;
        console.log(user, " USER 2.0");
        return {
          id: user.id,
          name: `${user.nombre} ${user.apellido}`,
          email: user.email,
          role: user.role,
          sedeId: user.sede?.id,
          sedeNombre: user.sede?.nombre,
          accessToken: data.access_token,
        };
      },
    }),
  ],

  callbacks: {
    /*
     * Todo esto forma un JWT
     * Se guarda en una cookie
     */
    async jwt({ token, user }) {
      //Si usuario logra loguearse
      if (user) {
        token.id = user.id as number;
        token.role = user.role;
        token.sedeId = user.sedeId;
        token.sedeNombre = user.sedeNombre;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
      }
      // Sino solo retorna token
      return token;
    },

    /*
     * Desencripta el JWT de la cookie
     * Construimos el objeto session que usaremos luego
     */
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.sedeId = token.sedeId;
      session.user.sedeNombre = token.sedeNombre;
      session.user.name = token.name;
      session.user.email = token.email;
      session.accessToken = token.accessToken;

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
