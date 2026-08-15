"use client";

import { useEffect, useState } from "react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { BaseButton } from "@/components/Common/Buttons";
import { useInventoryByStores } from "@/hooks/products/useLenses";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { History } from "lucide-react";
import { ModalHistorialKardex } from "@/components/Kardex/ModalHistorialKardex";
import { useSessionUser } from "@/hooks/session";

import { addItemToCart } from "@/redux/features/cart-slice";
import { ILensStockMatrixItem } from "@/types/products";
import { CartItem } from "@/types/cart";
import { TipoProducto } from "@/commons/constants";
import { formatearMedidasLente } from "@/utils/lenses";

type DetailModalProps = {
  selected: ILensStockMatrixItem;
  lenteId: number;
  onClose: () => void;
};

export const DetailModal: React.FC<DetailModalProps> = ({
  selected,
  lenteId,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sedeId } = useSessionUser();
  const [showKardex, setShowKardex] = useState(false);

  const { getInventoryByStores, loading, inventoryByStore } =
    useInventoryByStores();

  console.log('SELECTED', selected)
  console.log('LENTEID', lenteId)

  const handleAddToCart = () => {
    const price = inventoryByStore?.precioCalculado || 0;

    const itemToCart: CartItem = {
      id: selected.id,
      productId: null,
      lenteId: lenteId,
      productName: "Lente " + selected.nombreProducto,
      productType: TipoProducto.LENTE,
      discount: 0,
      price: price,
      quantity: 1,
      stock: selected.cantidad,
      cyl: selected.cyl,
      esf: selected.esf,
      isLens: true, //TODO: MEJORAR
      imgs: {
        thumbnails: [
          "https://www.flaticon.es/icono-gratis/anteojos-con-media-montura_27114",
        ],
        previews: [
          "https://www.flaticon.es/icono-gratis/anteojos-con-media-montura_27114",
        ],
      },
    };

    dispatch(addItemToCart(itemToCart));
    onClose();
  };

  //Calcula el precio y trae el stock

  useEffect(() => {
    if (selected?.id) {
      getInventoryByStores(selected.id);
    }
  }, [selected.id]);

  return (
    <ModalFrameWrapper>
      <div className="pt-4 pb-10 max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue/5 p-4 rounded-xl border border-blue/10 text-center relative overflow-hidden">
          <p className="text-[10px] text-blue font-bold uppercase tracking-widest">
            Graduación Seleccionada
          </p>
          <p className="text-2xl font-black text-blue">
            {formatearMedidasLente(selected.esf, selected.cyl)}
          </p>

          <div className="mt-2 inline-block px-3 py-1 bg-white rounded-lg border border-blue/20 shadow-sm">
            <span className="text-xs font-bold text-blue/60 mr-1 text-[10px]">
              PRECIO:
            </span>
            <span className="text-lg font-black text-blue">
              S/ {inventoryByStore?.precioCalculado?.toFixed(2) || "CARGANDO"}
            </span>
          </div>
        </div>

        {/* Stock */}
        <div className="flex justify-between items-center px-2 mt-4">
          <span className="text-gray-500 font-medium">
            Stock en Sede Actual:
          </span>

          <span
            className={`text-xl font-black ${selected.cantidad > 0 ? "text-green" : "text-red"
              }`}
          >
            {selected.cantidad}
            <small className="text-[10px] uppercase font-bold ml-1">Und</small>
          </span>
        </div>

        {/* Sedes */}
        <div className="rounded-xl bg-gray-1 p-3 text-[11px] space-y-2 border border-gray-2 mt-4">
          <p className="font-bold text-gray-6 uppercase text-[9px] opacity-70">
            Disponibilidad otras sedes
          </p>

          {loading && <p>Cargando stock...</p>}

          {inventoryByStore?.sedes.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center text-gray-7"
            >
              <span className="italic">📍 {s.nombre}</span>
              <span className="font-bold bg-gray-2 px-2 py-0.5 rounded text-[10px]">
                {s.unidades}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER FIJO */}
      <div className="flex flex-col gap-2 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <BaseButton
              disabled={selected.cantidad <= 0 || !inventoryByStore}
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </BaseButton>
          </div>
          <button
            onClick={() => setShowKardex(true)}
            type="button"
            className="p-[14px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition duration-200 border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer"
            title="Historial de movimientos"
          >
            <History size={20} />
          </button>
        </div>

        <BaseButton variant="cancel" onClick={onClose}>
          Cancelar
        </BaseButton>
      </div>

      {showKardex && (
        <ModalHistorialKardex
          isOpen={showKardex}
          onClose={() => setShowKardex(false)}
          stockId={selected.id}
          tipoProducto={TipoProducto.LENTE}
          sedeId={sedeId}
          nombreProducto={`LENTE — ${selected.nombreProducto || ""} (ESF: ${selected.esf}, CYL: ${selected.cyl})`}
        />
      )}
    </ModalFrameWrapper>
  );
};

