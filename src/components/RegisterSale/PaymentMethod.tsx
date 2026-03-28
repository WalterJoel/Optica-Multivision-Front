"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import { LoadingModal, StatusModal } from "@/components/Common/modal";

// Components
import { BaseInput, BaseTabs, BaseTarea } from "@/components/Common/Inputs";

// Hooks y Store
import { useCreateSale } from "@/hooks/sales";
import { useAppSelector } from "@/redux/store";

// Selectores de Slices
import { selectAuth } from "@/redux/features/auth-slice";
import {
  selectVenta,
  setMetodoPago,
  setTotal,
} from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems } from "@/redux/features/cart-slice";

// Constants
import {
  TipoVenta,
  EstadoPago,
  TipoProducto,
  STATUS_MODAL,
} from "@/commons/constants";
import { ICreateSale, VentaProducto } from "@/types/sales";

type PaymentType = "cash" | "credit";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { addSale, loading, statusMessage, success } = useCreateSale();

  const authStore = useAppSelector(selectAuth);
  const ventaStore = useAppSelector(selectVenta);
  const cartStoreItems = useAppSelector(selectCartItems);
  const cartStoreTotal = useAppSelector(selectTotalPrice);

  // Estados locales de UI (Volátiles)
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

  const paymentMethods = [
    { key: "efectivo", label: "Efectivo", icon: "/images/cart/efectivo.png" },
    { key: "tarjeta", label: "Interbancario", icon: "/images/cart/int.png" },
    { key: "yape", label: "Yape", icon: "/images/cart/yape.png" },
    { key: "plin", label: "Plin", icon: "/images/cart/plin.png" },
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
    // Mapeo lógico desde CART_STORE
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
      // 1. DATA DESDE AUTH_STORE
      sedeId: Number(authStore.sedeId),
      userId: Number(authStore.userId),

      // 2. DATA DESDE VENTA_STORE
      metodoPago: ventaStore.metodoPago,
      kitId: ventaStore.kitRegaloId,
      montoPagado: Number(montoRecibido),

      // 3. DATA DESDE CART_STORE
      productos: productosDesdeCart,
      total: cartStoreTotal,

      // 4. DATA DESDE UI / LÓGICA LOCAL
      responsableVenta,
      tipoVenta: paymentType === "cash" ? TipoVenta.CONTADO : TipoVenta.CREDITO,
      estadoPago:
        (ventaStore.total || 0) >= cartStoreTotal
          ? EstadoPago.PAGADO
          : EstadoPago.PENDIENTE,
      montaje: showOrder,
      nroCuotas: null,
      observaciones: observacionesLocal,
      deuda: 0, //TODO CASH AHORA MISMO
    };

    console.log("🚀 Payload estructurado:", payload);
    addSale(payload);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <section className="overflow-hidden pt-[180px] pb-20 bg-gray-2 min-h-screen">
      <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
        <div className="flex w-full gap-6">
          {/* PANEL IZQUIERDO: GESTIÓN DE PAGO (45%) */}
          <div className="w-[45%] flex-shrink-0">
            <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg h-full">
              <div className="mb-5 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-bold text-gray-700">
                    ¿Requiere Montaje?
                  </span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue border-gray-300 rounded focus:ring-blue"
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
                  type="text"
                  value={responsableVenta}
                  onChange={(e) => setResponsableVenta(e.target.value)}
                />

                <div>
                  <label className="mb-3 block text-sm font-bold text-gray-700">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const isSelected = ventaStore.metodoPago === method.key;
                      return (
                        <motion.button
                          key={method.key}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            dispatch(setMetodoPago(method.key as any))
                          }
                          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                            isSelected
                              ? "border-blue bg-blue/5 ring-1 ring-blue"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <Image
                            src={method.icon}
                            alt={method.label}
                            width={32}
                            height={32}
                          />
                          <span
                            className={`text-xs font-bold ${isSelected ? "text-blue" : "text-gray-500"}`}
                          >
                            {method.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
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
                  label="Notas de la Venta"
                  value={observacionesLocal}
                  placeholder="Ej: Cliente solicita entrega urgente..."
                  onChange={(e) => setObservacionesLocal(e.target.value)}
                />

                <button
                  onClick={handleRegisterSale}
                  disabled={loading || cartStoreTotal === 0}
                  className={`mt-auto w-full rounded-xl py-4 text-white font-bold text-lg shadow-lg transition-all ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue hover:bg-blue-dark active:scale-[0.99]"
                  }`}
                >
                  {loading ? "Procesando Venta..." : "REGISTRAR OPERACIÓN"}
                </button>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: DETALLES DE MONTAJE (55%) */}
          <div className="w-[55%] flex-shrink-0">
            {showOrder ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col rounded-xl bg-white p-8 shadow-lg h-full border border-blue/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-blue rounded-full" />
                  <h2 className="text-xl font-extrabold text-gray-800">
                    Orden de Laboratorio / Montaje
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
                    Configure los parámetros del cristal aquí
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <p className="text-gray-400 italic text-sm">
                  El panel de montaje se activará al marcar el check
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
