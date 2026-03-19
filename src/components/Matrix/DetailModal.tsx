"use client";

import { useEffect } from "react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { BaseButton } from "@/components/Common/Buttons";
import { useInventoryByStores } from "@/hooks/products/useLenses";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import { addItemToCart } from "@/redux/features/cart-slice";
import { ILensStockMatrixItem } from "@/types/products";
import { CartItem } from "@/types/cart";

type DetailModalProps = {
  selected: ILensStockMatrixItem;
  onClose: () => void;
};

export const DetailModal: React.FC<DetailModalProps> = ({
  selected,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getInventoryByStores, loading, inventoryByStore } =
    useInventoryByStores();

  const handleAddToCart = () => {
    console.log(selected, " ->>>>>>>>>>>>>>>> SELETED");
    const price = inventoryByStore?.precioCalculado || 0;

    const itemToCart: CartItem = {
      id: selected.id,
      productId: selected.productoId,
      productName: "Lente " + selected.nombreProducto,
      title: "Lente ",
      discount: 0,
      price: price,
      quantity: 1,
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

  useEffect(() => {
    if (selected?.id) {
      getInventoryByStores(selected.id);
    }
  }, [selected.id]);

  return (
    <ModalFrameWrapper>
      <div className="space-y-4">
        {/* Header con Graduación y Precio */}
        <div className="bg-blue/5 p-4 rounded-xl border border-blue/10 text-center relative overflow-hidden">
          <p className="text-[10px] text-blue font-bold uppercase tracking-widest">
            Graduación Seleccionada
          </p>
          <p className="text-2xl font-black text-blue">
            ESF {selected.esf} / CYL {selected.cyl.toFixed(2)}
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

        {/* Stock Sede Actual */}
        <div className="flex justify-between items-center px-2">
          <span className="text-gray-500 font-medium">
            Stock en Sede Actual:
          </span>
          <span
            className={`text-xl font-black ${selected.cantidad > 0 ? "text-green" : "text-red"}`}
          >
            {selected.cantidad}{" "}
            <small className="text-[10px] uppercase font-bold">Und</small>
          </span>
        </div>

        {/* Otras Sedes */}
        <div className="rounded-xl bg-gray-1 p-3 text-[11px] space-y-2 border border-gray-2">
          <p className="font-bold text-gray-6 uppercase text-[9px] opacity-70">
            Disponibilidad otras sedes
          </p>
          {loading && <p>Cargando stock...</p>}
          {/* {statusMessage && !loading && <p>{statusMessage}</p>} */}
          {inventoryByStore &&
            inventoryByStore.sedes.map((s) => (
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

      {/* Acciones */}
      <div className="mt-6 flex flex-col gap-2">
        <BaseButton
          disabled={selected.cantidad <= 0 || !inventoryByStore}
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </BaseButton>
        <BaseButton variant="cancel" onClick={onClose}>
          Cancelar
        </BaseButton>
      </div>
    </ModalFrameWrapper>
  );
};
