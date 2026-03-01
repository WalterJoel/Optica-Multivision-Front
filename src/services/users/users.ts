import { api } from "../api";
import { CreateUser } from "@/types/users";

export const createUserService = async (payload: CreateUser) => {
  const { data } = await api.post("/users", payload);
  return data;
};