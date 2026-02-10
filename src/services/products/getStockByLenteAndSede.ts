import { api } from "../api";

export type StockCell = {
  id: number;
  cantidad: number;
  esf: number | null;
  cyl: number | null;
};

export type StockMatrix = Record<"NEGATIVO" | "POSITIVO", StockCell[][]>;

/**
 * Trae el stock para un lente y sede específicos.
 * Retorna matrices completas NEGATIVO y POSITIVO listas para pintar.
 */

export const getStockByLenteAndSede = async (
  lenteId: number,
  sedeId: number,
): Promise<StockMatrix> => {
  const { data } = await api.get<StockMatrix>(
    `/productos/stockForLenteAndSede/${lenteId}/${sedeId}`,
  );
  return data;
};
