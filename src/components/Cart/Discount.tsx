"use client";

import React, { useState, useEffect } from "react";
import { BaseSearchInput } from "@/components/Common/Inputs";
import { useSearchClient } from "@/hooks/clients";
import { ISearchClient } from "@/types/clients";
import { useAppSelector } from "@/redux/store";
import { useSearchDiscountByProducts } from "@/hooks/discounts";
import { BaseButton } from "../Common/Buttons";
import { InfoModal } from "../Common/modal";
import { useDispatch } from "react-redux";
import {
  applyDiscountToItem,
  removeDiscountFromItem,
} from "@/redux/features/cart-slice";
import { Check } from "lucide-react";
import { IResponseDiscountByProduct } from "@/types/discounts";

const Discount = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoConfig, setInfoConfig] = useState({
    message: "",
    code: undefined as string | number | undefined,
  });

  const { clients, searchClients, setShowList, showList } = useSearchClient();
  const { discounts, searchDiscounts, loading, statusMessage, setDiscounts } =
    useSearchDiscountByProducts();

  const handleSelectClient = (client: ISearchClient) => {
    setSearchTerm(`${client.nombres} ${client.apellidos}`);
    setSelectedClientId(client.id);
    setShowList(false);
    setDiscounts([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const productosPayload = cartItems.map((item) => ({
      productoId: item.productId,
      esLente: item.isLens,
      cyl: item.isLens ? item.cyl : null,
    }));

    await searchDiscounts({
      clienteId: selectedClientId,
      productos: productosPayload,
    });
  };

  useEffect(() => {
    if (statusMessage.includes("No se encontraron descuentos")) {
      setInfoConfig({ message: statusMessage, code: "NO_DISCOUNTS" });
      setIsInfoOpen(true);
    }
  }, [statusMessage]);

  //  TOGGLE DESCUENTO
  const handleToggleDiscount = (discount: IResponseDiscountByProduct) => {
    const { productoId, montoDescuento, id: idDescuento } = discount;

    const item = cartItems.find((item) => item.productId === productoId);

    if (!item) return;

    const alreadyApplied = item.discount && item.discount > 0;

    if (alreadyApplied) {
      dispatch(removeDiscountFromItem({ itemId: item.id }));
    } else {
      dispatch(
        applyDiscountToItem({
          itemId: item.id,
          discount: montoDescuento,
          discountId: idDescuento,
        }),
      );
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <form
          onSubmit={handleSubmit}
          className="h-full bg-white shadow-1 rounded-[10px] flex flex-col"
        >
          <div className="p-8 sm:p-10 flex flex-col h-full">
            {/* Buscador */}
            <div className="mb-6">
              <BaseSearchInput
                label="Buscar Cliente"
                value={searchTerm}
                required
                onChange={(val) => {
                  setSearchTerm(val);
                  searchClients(val);

                  if (selectedClientId) setSelectedClientId(null);
                  setDiscounts([]);
                }}
                results={clients}
                showList={showList}
                renderItem={(c: ISearchClient) => (
                  <div
                    onMouseDown={() => handleSelectClient(c)}
                    className="w-full flex items-center justify-between gap-4 cursor-pointer p-1"
                  >
                    <span className="truncate text-sm font-medium">
                      {c.nombres} {c.apellidos}
                    </span>
                    <span className="text-[10px] font-mono text-blue bg-blue-light/10 px-2 py-0.5 rounded border border-blue/20">
                      DNI: {c.numeroDoc}
                    </span>
                  </div>
                )}
              />
            </div>

            {/* Descuentos */}
            {!loading && discounts.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[11px] font-bold text-slate-400 mb-3">
                  Descuentos Aplicables
                </h4>

                <ul className="space-y-2">
                  {discounts.map((d) => {
                    const item = cartItems.find(
                      (item) => item.productId === d.productoId,
                    );

                    const alreadyApplied = item?.discount && item.discount > 0;

                    return (
                      <li
                        key={`${d.productoId}-${d.serie ?? "no-serie"}`}
                        className="flex justify-between items-center bg-blue-light-6 px-4 py-2 rounded-xl"
                      >
                        <div>
                          <div className="text-xs font-semibold">
                            {d.nombreProducto}
                          </div>
                          <div className="text-sm text-blue font-bold">
                            - S/ {d.montoDescuento}
                          </div>
                        </div>

                        <BaseButton
                          onClick={() => handleToggleDiscount(d)}
                          fullWidth={false}
                          className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                            alreadyApplied
                              ? "bg-green-50 text-green-500 border border-green-200"
                              : "bg-blue text-white hover:bg-blue-dark"
                          }`}
                        >
                          {alreadyApplied ? <Check size={18} /> : "OK"}
                        </BaseButton>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {selectedClientId && (
              <BaseButton type="submit">
                {loading ? "Buscando..." : "Buscar"}
              </BaseButton>
            )}
          </div>
        </form>
      </div>

      <InfoModal
        isOpen={isInfoOpen}
        title="Aviso"
        message={infoConfig.message}
        code={infoConfig.code}
        onClose={() => setIsInfoOpen(false)}
      />
    </>
  );
};

export default Discount;
