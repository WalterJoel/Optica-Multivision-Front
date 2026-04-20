export interface IUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
  sedeId: number;
  activo: boolean;
}

export type CreateUser = {
  email: string;
  password: string;
  role: string;
  sedeId: number;
};

export type ICreateUser = Omit<IUser, "id" | "activo">;
