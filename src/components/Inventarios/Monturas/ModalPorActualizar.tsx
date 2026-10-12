"use client";

import { useEffect } from "react";
import { TipoProducto } from "@/commons/constants";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { useOutdatedStockProducts } from "@/hooks/products/stock";
import { CheckCircle, Loader2, PackageSearch } from "lucide-react";
import { useSessionUser } from "@/hooks/session";

import { BaseButton } from "@/components/Common/Buttons/BaseButton";

interface Props {
  isOpenModalOutdated: boolean;
  onCloseModalOutdated: () => void;
}

export function ModalPorActualizar({
  isOpenModalOutdated,
  onCloseModalOutdated,
}: Props) {
  const { loading, getOutdatedStockProductos, outdatedProducts } =
    useOutdatedStockProducts();
  const { sedeId } = useSessionUser();

  useEffect(() => {
    if (isOpenModalOutdated) {
      getOutdatedStockProductos({
        tipoProducto: TipoProducto.MONTURA,
        idSede: sedeId,
      });
    }
  }, [isOpenModalOutdated, sedeId]);

  if (!isOpenModalOutdated) return null;

  return (
    <ModalFrameWrapper size="lg">
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
            Stock <span className="text-blue">Pendiente (Hoy)</span>
          </h3>

        </header>

        {/* Listado de Productos */}
        <div className="mv-table-container max-h-[60vh] overflow-y-auto overflow-x-hidden">
          <div className="mv-scroll-area">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue animate-spin mb-3" />
                <span className="text-[9px] font-black text-blue-light-2 uppercase animate-pulse">
                  Sincronizando...
                </span>
              </div>
            ) : outdatedProducts.length > 0 ? (
              <table className="mv-table w-full">
                <thead>
                  <tr>
                    <th className="mv-th !py-1.5 !px-3 text-left w-[28%]">Producto</th>
                    <th className="mv-th !py-1.5 !px-2 text-center w-[18%]">Material</th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[12%]">ID Montura</th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[15%]">Código</th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[17%]">Código Montura</th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[10%]">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-light-6">
                  {outdatedProducts.map((p) => (
                    <tr key={p.id} className="mv-tr">
                      <td className="mv-td !py-1 !px-3">
                        <span className="mv-text-main text-[11px] text-slate-700 block line-clamp-1">
                          {p.nombre}
                        </span>
                      </td>

                      {/* Material */}
                      <td className="mv-td !py-1 !px-2 text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                          {p.montura?.material || "---"}
                        </span>
                      </td>

                      {/* ID montura */}
                      <td className="mv-td !py-1 !px-1 text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                          {p.montura?.id}
                        </span>
                      </td>

                      {/* Codigo de montura */}
                      <td className="mv-td !py-1 !px-1 text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                          {p.montura?.codigo}
                        </span>
                      </td>

                      {/* Codigo de montura */}
                      <td className="mv-td !py-1 !px-1 text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                          {p.montura?.codigoMontura}
                        </span>
                      </td>

                      <td className="mv-td !py-1 !px-1 text-center">
                        <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-blue text-white font-black text-[10px]">
                          {p.cantidad}
                        </span>
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
          <BaseButton onClick={onCloseModalOutdated}>
            Continuar
          </BaseButton>
        </footer>
      </div>
    </ModalFrameWrapper>
  );
}

// Alias de retrocompatibilidad
export { ModalPorActualizar as OutdatedProductsModal };
