import { DefaultSession, DefaultUser } from "next-auth";
import { IUser } from "../users";

// Usamos este tipado porque debemos extender los tipos por defecto que trae next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      sedeId: number;
      sedeNombre: string;
    } & DefaultSession["user"];

    accessToken: string;
  }

  interface User extends DefaultUser {
    id: number;
    role: string;
    sedeId: number;
    sedeNombre: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
    sedeId: number;
    sedeNombre: string;
    accessToken: string;
    name?: string | null;
    email?: string | null;
  }
}

export interface LoginResponse {
  ok: boolean;
  access_token: string;
  message: string;
  user: IUser;
}
