import { IStore } from "../stores";

export interface IUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
  sede: IStore;
  sedeNombre: string;
  activo: boolean;
}

export type CreateUser = {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  role: string;
  sedeId: number;
};

export type ICreateUser = Omit<IUser, "id" | "activo">;
