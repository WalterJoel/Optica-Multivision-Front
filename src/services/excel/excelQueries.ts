import { MonturaExcelRow } from "@/types/excel/monturas";
import { api } from "../api";

export const obtenerMonturasExcelService = async (
  sedeId: number,
): Promise<MonturaExcelRow[]> => {
  const { data } = await api.get<MonturaExcelRow[]>(
    `/productos/monturas/obtenerMonturasExcel/${sedeId}`,
  );

  return data;
};
