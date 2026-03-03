import { api } from "../api";
import { CreateUser, IUser } from "@/types/users";

export const createUserService = async (payload: CreateUser) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUserService = async (id: number, payload: Partial<IUser> & { password?: string }) => {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data;
};

export const updateUserStatusService = async (id: number, activo: boolean) => {
  const { data } = await api.patch(`/users/${id}/status`, { activo });
  return data;
};