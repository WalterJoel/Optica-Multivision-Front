import { TipoProducto } from "@/commons/constants";
import { api } from "@/services/api";
import {
  IOutdatedProductStockResponse,
  IOutdatedStockProductosPayload,
} from "@/types/products";

export const getAllOutdatedStockProductsService = async (
  payload: IOutdatedStockProductosPayload,
): Promise<IOutdatedProductStockResponse[]> => {
  const { data } = await api.get<IOutdatedProductStockResponse[]>(
    `/productos/productosNoActualizados/${payload.idSede}/${payload.tipoProducto}`,
  );
  return data;
};
