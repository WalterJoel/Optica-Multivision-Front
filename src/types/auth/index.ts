import { DefaultSession, DefaultUser } from "next-auth";
import { IUser } from "../users";

// Usamos este tipado porque debemos extender los tipos por defecto que trae next-auth

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      sedeId: number;
    } & DefaultSession["user"];

    accessToken: string;
  }

  interface User extends DefaultUser {
    id: number;
    role: string;
    sedeId: number;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    role?: string;
    sedeId?: number;
    accessToken?: string;
  }
}

export interface LoginResponse {
  ok: boolean;
  access_token: string;
  user: IUser;
}
