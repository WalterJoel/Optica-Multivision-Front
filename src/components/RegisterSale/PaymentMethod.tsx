"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";

// Components
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { BaseInput, BaseTabs, BaseTarea } from "@/components/Common/Inputs";

// Hooks y Store
import { useCreateSale } from "@/hooks/sales";
import { useAppSelector } from "@/redux/store";

// Selectores de Slices
import { selectAuth } from "@/redux/features/auth-slice";
import { selectVenta, setMetodoPago } from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems } from "@/redux/features/cart-slice";

// Constants
import { TipoVenta, EstadoPago, STATUS_MODAL } from "@/commons/constants";
import { ICreateSale, VentaProducto } from "@/types/sales";
import PaymentMethodSelector from "./PaymentMethodSelector";

type PaymentType = "cash" | "credit";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { addSale, loading, statusMessage, success } = useCreateSale();

  const authStore = useAppSelector(selectAuth);
  const ventaStore = useAppSelector(selectVenta); // Escuchamos el store de venta
  console.log(ventaStore, " CENTA STORE -->>>>>>>>>>");
  const cartStoreItems = useAppSelector(selectCartItems);
  const cartStoreTotal = useAppSelector(selectTotalPrice);

  // Estados locales de UI
  const [paymentType, setPaymentType] = useState<PaymentType>("credit");
  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [responsableVenta, setResponsableVenta] = useState(
    authStore.name || "",
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nroCuotas, setNroCuotas] = useState<number>(0);
  const [observacionesLocal, setObservacionesLocal] = useState("");
  const [montoRecibido, setMontoRecibido] = useState("");
  const [typeModal, setTypeModal] = useState<string>("");

  const paymentTabs = [
    { key: "cash", label: "Al Contado" },
    { key: "credit", label: "Al Crédito" },
  ];

  useEffect(() => {
    const payment = parseFloat(montoRecibido) || 0;
    const total = cartStoreTotal || 0;

    if (paymentType === "cash") {
      setChange(Math.max(0, payment - total));
      setDebt(0);
    } else {
      setDebt(Math.max(0, total - payment));
      setChange(0);
    }
  }, [montoRecibido, cartStoreTotal, paymentType]);

  const handleRegisterSale = () => {
    const productosDesdeCart: VentaProducto[] = cartStoreItems.map((item) => ({
      productoId: item.productId,
      tipoProducto: item.productType,
      precioUnitario: item.price,
      cantidad: item.quantity,
      subtotal: Number(
        ((item.price - (item.discount || 0)) * item.quantity).toFixed(2),
      ),
      descuento: item.discount || null,
      stockId: item.isLens ? item.id : null,
      cyl: item.cyl || null,
      esf: item.esf || null,
      stockProductoId: !item.isLens ? item.id : null,
    }));

    const payload: ICreateSale = {
      sedeId: Number(authStore.sedeId),
      userId: Number(authStore.userId),
      metodoPago: ventaStore.metodoPago,
      kitId: ventaStore.kitRegaloId,
      montoPagado: Number(montoRecibido),
      productos: productosDesdeCart,
      total: cartStoreTotal,
      responsableVenta,
      tipoVenta: paymentType === "cash" ? TipoVenta.CONTADO : TipoVenta.CREDITO,
      estadoPago:
        Number(montoRecibido) >= cartStoreTotal
          ? EstadoPago.PAGADO
          : EstadoPago.PENDIENTE,
      montaje: showOrder,
      nroCuotas: paymentType === "credit" ? nroCuotas : null,
      observaciones: observacionesLocal,
      deuda: paymentType === "credit" ? debt : 0,
    };

    addSale(payload);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      setTypeModal(
        success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <section className="overflow-hidden pt-[180px] pb-20 bg-gray-2 min-h-screen">
      <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
        <div className="flex w-full gap-6">
          {/* PANEL IZQUIERDO */}
          <div className="w-[45%] flex-shrink-0">
            <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg h-full">
              <div className="mb-5 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-bold text-gray-700">
                    ¿Requiere Montaje?
                  </span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue border-gray-300 rounded"
                    checked={showOrder}
                    onChange={() => setShowOrder(!showOrder)}
                  />
                </label>
              </div>

              <div className="mb-6">
                <BaseTabs
                  tabs={paymentTabs}
                  activeTab={paymentType}
                  onChange={(value) => setPaymentType(value as PaymentType)}
                />
              </div>

              <div className="flex flex-col space-y-5 flex-1">
                <BaseInput
                  label="Responsable de la Venta"
                  value={responsableVenta}
                  onChange={(e) => setResponsableVenta(e.target.value)}
                />

                <div>
                  <label className="mb-3 block text-sm font-bold text-gray-700">
                    Método de Pago
                  </label>
                  <PaymentMethodSelector />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <BaseInput
                    label="Total Venta"
                    value={`S/ ${cartStoreTotal.toFixed(2)}`}
                    readOnly
                  />
                  <BaseInput
                    label="Monto Recibido"
                    type="number"
                    value={montoRecibido}
                    onChange={(e) => setMontoRecibido(e.target.value)}
                  />
                  <BaseInput
                    label={paymentType === "cash" ? "Vuelto" : "Por Cobrar"}
                    value={`S/ ${paymentType === "cash" ? change.toFixed(2) : debt.toFixed(2)}`}
                    readOnly
                  />
                </div>

                {paymentType === "credit" && (
                  <BaseInput
                    label="Número de Cuotas"
                    type="number"
                    value={nroCuotas}
                    onChange={(e) => setNroCuotas(Number(e.target.value))}
                  />
                )}

                <BaseTarea
                  label="Notas"
                  value={observacionesLocal}
                  onChange={(e) => setObservacionesLocal(e.target.value)}
                />

                <button
                  onClick={handleRegisterSale}
                  disabled={loading || cartStoreTotal === 0}
                  className={`mt-auto w-full rounded-xl py-4 text-white font-bold text-lg shadow-lg transition-all ${
                    loading
                      ? "bg-gray-400"
                      : "bg-blue hover:bg-blue-dark active:scale-[0.98]"
                  }`}
                >
                  {loading ? "PROCESANDO..." : "REGISTRAR OPERACIÓN"}
                </button>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="w-[55%] flex-shrink-0">
            {showOrder ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col rounded-xl bg-white p-8 shadow-lg h-full border-2 border-blue/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-blue rounded-full" />
                  <h2 className="text-xl font-extrabold text-gray-800">
                    Orden de Laboratorio
                  </h2>
                </div>
                <div className="flex-1 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50">
                  <Image
                    src="/images/cart/montaje-placeholder.png"
                    alt="Montaje"
                    width={80}
                    height={80}
                    className="opacity-20 mb-4"
                  />
                  <p className="text-gray-400 font-medium">
                    Parámetros del cristal
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <p className="text-gray-400 italic text-sm">
                  Panel de montaje inactivo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </section>
  );
};

export default PaymentMethod;
