import { api } from "@/services/api";
import { IQueryKardexParams, IKardexResponse } from "@/types/kardex";

export async function obtenerHistorialKardex(
  params: IQueryKardexParams,
): Promise<IKardexResponse> {
  const response = await api.get<IKardexResponse>("/kardex/obtenerhistorial", {
    params,
  });
  return response.data;
}
