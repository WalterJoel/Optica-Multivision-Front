"use client";

import { useEffect } from "react";
import { TipoProducto } from "@/commons/constants";
import { useOutdatedStockProducts } from "@/hooks/products/stock";
import { CheckCircle, Loader2, PackageSearch } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { useSessionUser } from "@/hooks/session";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";

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

  // Hooks
  const { sedeId } = useSessionUser();

  // Functions
  useEffect(() => {
    if (isOpenModalOutdated) {
      getOutdatedStockProductos({
        tipoProducto: TipoProducto.ACCESORIO,
        idSede: sedeId,
      });
    }
  }, [isOpenModalOutdated]);

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
        <div className="mv-table-container">
          <div className="mv-scroll-area max-h-[400px] overflow-y-auto">
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
                    <th className="mv-th !py-1.5 !px-3 text-left w-[34%]">
                      Producto
                    </th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[16%]">
                      ID Accesorio
                    </th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[20%]">
                      Código Accesorio
                    </th>
                    <th className="mv-th !py-1.5 !px-1 text-center w-[12%]">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-light-6">
                  {outdatedProducts.map((p) => (
                    <tr key={p.id} className="mv-tr">
                      {/* Producto */}
                      <td className="mv-td !py-1 !px-3">
                        <span className="mv-text-main text-[11px] text-slate-700 block line-clamp-1">
                          {p.nombre}
                        </span>
                      </td>

                      {/* ID Accesorio */}
                      <td className="mv-td !py-1 !px-1 text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                          {p.accesorio?.id}
                        </span>
                      </td>

                      {/* Codigo */}
                      <td className="mv-td !py-1 !px-1 text-center">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                          {p.accesorio?.codigoAccesorio}
                        </span>
                      </td>

                      {/* Stock */}
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

export { OutdatedProductsModal as ModalPorActualizar };
