"use client";

import { useEffect } from "react";
import { TipoProducto } from "@/commons/constants";
import { ModalFrameWrapper } from "../Common/modal";
import { useOutdatedStockProducts } from "@/hooks/products/stock";
import { CheckCircle, Loader2, PackageSearch } from "lucide-react";

interface Props {
  isOpenModalOutdated: boolean;
  onCloseModalOutdated: () => void;
}

export function OutdatedProductsModal({
  isOpenModalOutdated,
  onCloseModalOutdated,
}: Props) {
  const { loading, getOutdatedStockProductos, outdatedProducts } =
    useOutdatedStockProducts();

  useEffect(() => {
    if (isOpenModalOutdated) {
      getOutdatedStockProductos({
        tipoProducto: TipoProducto.MONTURA,
        idSede: 1,
      });
    }
  }, [isOpenModalOutdated]);

  if (!isOpenModalOutdated) return null;

  return (
    <ModalFrameWrapper size="md">
      <div className="pt-4 pb-16">
        {/* Cabecera */}
        <header className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-yellow-light-4 rounded-2xl flex items-center justify-center mb-3 rotate-3 shadow-sm border border-yellow-light-2">
            <PackageSearch
              className="w-7 h-7 text-yellow-dark"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">
            Stock <span className="text-blue">Pendiente</span>
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Inventario de Hoy
          </p>
        </header>

        {/* Listado de Productos */}
        <div className="mv-table-container">
          <div className="mv-scroll-area">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue animate-spin mb-3" />
                <span className="text-[9px] font-black text-blue-light-2 uppercase animate-pulse">
                  Sincronizando...
                </span>
              </div>
            ) : outdatedProducts.length > 0 ? (
              <table className="mv-table">
                <thead>
                  <tr>
                    <th className="mv-th">Producto</th>
                    <th className="mv-th text-center">Código Interno</th>
                    <th className="mv-th text-center">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-light-6">
                  {outdatedProducts.map((p) => (
                    <tr key={p.id} className="mv-tr">
                      <td className="mv-td">
                        <span className="mv-text-main">
                          {p.producto?.nombre || "N/A"}
                        </span>
                      </td>
                      <td className="mv-td text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {p.producto?.montura?.codigo || "---"}
                        </span>
                      </td>
                      <td className="mv-td text-center">
                        <span className="mv-stock-badge">{p.cantidad}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-tighter">
                  Todo el inventario está al día
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6">
          <button
            onClick={onCloseModalOutdated}
            className="group relative w-full overflow-hidden rounded-xl bg-blue py-3.5 font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-blue/20 transition-all hover:bg-blue-dark active:scale-[0.98]"
          >
            <span className="relative z-10 text-white">Continuar</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </button>
        </footer>
      </div>
    </ModalFrameWrapper>
  );
}
