import { MonturaExcelRow } from "@/types/excel/monturas";
import { AccesorioExcelRow } from "@/types/excel/accesorios";
import { api } from "../api";

export const obtenerMonturasExcelService = async (
  sedeId: number,
): Promise<MonturaExcelRow[]> => {
  const { data } = await api.get<MonturaExcelRow[]>(
    `/productos/monturas/obtenerMonturasExcel/${sedeId}`,
  );

  return data;
};

export const obtenerAccesoriosExcelService = async (
  sedeId: number,
): Promise<AccesorioExcelRow[]> => {
  const { data } = await api.get<AccesorioExcelRow[]>(
    `/productos/accesorios/obtenerAccesoriosExcel/${sedeId}`,
  );

  return data;
};

