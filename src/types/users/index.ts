export type IUser = {
  id: number;
  email: string;
  role: string;
  sedeId: number;
  activo: boolean;
};

export type CreateUser = {
  email: string;
  password: string;
  role: string;
  sedeId: number;
};

export type ICreateUser = Omit<IUser, "id" | "activo">;