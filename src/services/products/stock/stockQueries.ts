import { TipoProducto } from "@/commons/constants";
import { api } from "@/services/api";
import {
  IOutdatedProductStockResponse,
  IOutdatedStockProductosPayload,
  IReporteInventarioPayload,
  IReporteInventarioResponse
} from "@/types/products";

export const getAllOutdatedStockProductsService = async (
  payload: IOutdatedStockProductosPayload,
): Promise<IOutdatedProductStockResponse[]> => {
  const { data } = await api.get<IOutdatedProductStockResponse[]>(
    `/productos/productosNoActualizados/${payload.idSede}/${payload.tipoProducto}`,
  );
  return data;
};



export const obtenerReporteInventarioService = async (
  payload: IReporteInventarioPayload,
): Promise<IReporteInventarioResponse[]> => {
  const { data } = await api.get<IReporteInventarioResponse[]>(
    `/productos/reporteInventario/${payload.idSede}/${payload.tipoProducto}`,
  );
  return data;
};
