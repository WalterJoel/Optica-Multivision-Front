"use client";

import React, { useState, useEffect } from "react";
import { BaseSearchInput } from "@/components/Common/Inputs";
import { useSearchClient } from "@/hooks/clients";
import { ISearchClient } from "@/types/clients";
import { useAppSelector } from "@/redux/store";
import { useSearchDiscountByProducts } from "@/hooks/discounts";
import { useRevisarDeudas } from "@/hooks/sales";
import {
  setClienteId,
  setBloqueadoPorDeuda,
  setDeudaMensaje,
  selectVenta,
} from "@/redux/features/sale-slice";
import { BaseButton } from "../Common/Buttons";
import { InfoModal } from "../Common/modal";
import { useDispatch } from "react-redux";
import {
  applyDiscountToItem,
  removeDiscountFromItem,
} from "@/redux/features/cart-slice";
import { Check, Loader2 } from "lucide-react";
import { IResponseDiscountByProduct } from "@/types/discounts";

const Discount = () => {
  // 1. Redux Hooks & Dispatch
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const ventaStore = useAppSelector(selectVenta);

  // 2. Local State Hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoConfig, setInfoConfig] = useState({
    message: "",
    code: undefined as string | number | undefined,
  });

  // 3. Custom Hooks
  const { clients, searchClients, setShowList, showList } = useSearchClient();
  const { discounts, searchDiscounts, loading, statusMessage, setDiscounts } =
    useSearchDiscountByProducts();
  const { checkDeudas, loading: loadingDeudas } = useRevisarDeudas();

  // 4. Functions & Handlers
  const getProductTypeBadge = (productType: string) => {
    switch (productType) {
      case "LENTE":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-light/10 text-blue mb-1">
            Lente
          </span>
        );
      case "MONTURA":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-yellow-light-4 text-yellow-dark mb-1">
            Montura
          </span>
        );
      case "ACCESORIO":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 mb-1">
            Accesorio
          </span>
        );
      default:
        return null;
    }
  };

  const handleSelectClient = async (client: ISearchClient) => {
    setSearchTerm(`${client.nombres} ${client.apellidos}`);
    setSelectedClientId(client.id);
    setShowList(false);
    setDiscounts([]);

    // 1. Dispatch clienteId to Redux
    dispatch(setClienteId(client.id));

    // 2. Check for overdue debts
    const debtRes = await checkDeudas(client.id);
    if (debtRes && debtRes.tieneDeudasVencidas) {
      dispatch(setBloqueadoPorDeuda(true));
      dispatch(setDeudaMensaje(debtRes.mensaje));
      setInfoConfig({ message: debtRes.mensaje, code: "DEUDA_VENCIDA" });
      setIsInfoOpen(true);
      return; // Stop and do not fetch discounts
    }

    // 3. Clear any existing block state
    dispatch(setBloqueadoPorDeuda(false));
    dispatch(setDeudaMensaje(null));

    const productosPayload = cartItems.map((item) => ({
      productoId: item.productId,
      esLente: item.isLens,
      cyl: item.isLens ? item.cyl : null,
      lenteId: item.isLens ? item.lenteId : null,
    }));

    searchDiscounts({
      clienteId: client.id,
      productos: productosPayload,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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

  // 5. UseEffects
  // Sincronizar el input si el clienteId en Redux se limpia (por ejemplo, después de una venta exitosa)
  useEffect(() => {
    if (ventaStore.clienteId === null) {
      setSearchTerm("");
      setSelectedClientId(null);
      setDiscounts([]);
    }
  }, [ventaStore.clienteId]);

  // Aplica automaticamente los descuentos
  useEffect(() => {
    if (discounts && discounts.length > 0) {
      discounts.forEach((d) => {
        const item = cartItems.find((item) => item.productId === d.productoId);
        if (item && (!item.discount || item.discount === 0)) {
          dispatch(
            applyDiscountToItem({
              itemId: item.id,
              discount: d.montoDescuento,
              discountId: d.id,
            })
          );
        }
      });
    }
  }, [discounts]);

  useEffect(() => {
    if (statusMessage.includes("No se encontraron descuentos")) {
      setInfoConfig({ message: statusMessage, code: "NO_DISCOUNTS" });
      setIsInfoOpen(true);
    }
  }, [statusMessage]);

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
              <span className="block text-sm font-medium text-gray-500 mb-1.5">Buscar Cliente</span>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <BaseSearchInput
                    value={searchTerm}
                    required
                    placeholder="Buscar por nombre, apellido o doc..."
                    onChange={(val) => {
                      setSearchTerm(val);
                      searchClients(val);

                      dispatch(setClienteId(null));
                      dispatch(setBloqueadoPorDeuda(false));
                      dispatch(setDeudaMensaje(null));

                      if (selectedClientId) {
                        setSelectedClientId(null);
                        cartItems.forEach((item) => {
                          if (item.discount && item.discount > 0) {
                            dispatch(removeDiscountFromItem({ itemId: item.id }));
                          }
                        });
                      }
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
                {(loading || loadingDeudas) && (
                  <Loader2 className="animate-spin text-blue shrink-0" size={18} />
                )}
              </div>
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
                    const productType = item?.productType || (d.esLente ? "LENTE" : "MONTURA");

                    return (
                      <li
                        key={`${d.productoId}-${d.serie ?? "no-serie"}`}
                        className="flex justify-between items-center bg-blue-light-6 px-4 py-2 rounded-xl"
                      >
                        <div>
                          {getProductTypeBadge(productType)}
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
                          className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${alreadyApplied
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
