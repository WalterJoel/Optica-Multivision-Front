"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import { BaseInput, BaseTabs, BaseTarea } from "@/components/Common/Inputs";
// Hook
import { useCreateSale } from "@/hooks/sales";

// Redux
import {
  selectVenta,
  setMetodoPago,
  setObservaciones,
  setTotal,
} from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems } from "@/redux/features/cart-slice";

import {
  MetodoPago,
  TipoVenta,
  EstadoPago,
  TipoProducto,
} from "@/commons/constants";
import { ICreateSale, VentaProducto } from "@/types/sales";

type PaymentType = "cash" | "credit";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const venta = useSelector(selectVenta);
  const totalFromCart = useSelector(selectTotalPrice);
  const cartItems = useSelector(selectCartItems);

  const [paymentType, setPaymentType] = useState<PaymentType>("credit");
  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);
  const [showOrder, setShowOrder] = useState(false);

  // Inputs locales para payload
  const [responsableVenta, setResponsableVenta] = useState("");
  const [nroCuotas, setNroCuotas] = useState<number>(0);
  const [observaciones, setObservacionesLocal] = useState("");

  // Hook
  const { addSale, loading, statusMessage, success } = useCreateSale();

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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "observaciones") {
      dispatch(setObservaciones(value));
      setObservacionesLocal(value);
    }
    if (name === "payment") dispatch(setTotal(parseFloat(value) || 0));
  };

  useEffect(() => {
    const payment = venta.total || 0;
    const total = totalFromCart || 0;

    if (paymentType === "cash") {
      setChange(payment - total);
      setDebt(0);
    } else {
      setDebt(total - payment);
      setChange(0);
    }
  }, [venta.total, totalFromCart, paymentType]);

  const handleRegisterSale = () => {
    const productos: VentaProducto[] = cartItems.map((item) => ({
      productoId: item.productId,
      tipoProducto: item.isLens
        ? TipoProducto.LENTE
        : item.stockProductoId
          ? TipoProducto.MONTURA
          : TipoProducto.ACCESORIO,
      precioUnitario: item.price,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity,
      descuento: item.discount || 0,
      stockId: item.isLens ? item.id : undefined,
      cyl: item.cyl,
      esf: item.esf,
      stockProductoId: !item.isLens ? item.id : undefined,
    }));

    const payload: ICreateSale = {
      sedeId: venta.sedeId || 1,
      userId: venta.userId || 123,
      responsableVenta,
      metodoPago: venta.metodoPago,
      tipoVenta: paymentType === "cash" ? TipoVenta.CONTADO : TipoVenta.CREDITO,
      estadoPago:
        venta.total && totalFromCart <= venta.total
          ? EstadoPago.PAGADO
          : EstadoPago.PENDIENTE,
      montaje: showOrder,
      nroCuotas,
      observaciones,
      kitId: venta.kitRegaloId,
      productos,
      total: totalFromCart,
      montoPagado: venta.total || 0,
      deuda: Math.max(0, totalFromCart - (venta.total || 0)),
    };

    addSale(payload);
  };

  return (
    <section className="overflow-hidden pt-[200px] pb-20 bg-gray-2 min-h-screen">
      <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
        <div className="flex w-full gap-6">
          {/* Panel Venta - Fijo 45% */}
          <div className="w-[45%] flex-shrink-0">
            <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg h-full">
              <div className="mb-5 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm">
                  <span className="text-sm font-semibold text-gray-600">
                    ¿Requiere Montaje?
                  </span>
                  <input
                    type="checkbox"
                    checked={showOrder}
                    onChange={() => setShowOrder(!showOrder)}
                  />
                </label>
              </div>

              <div className="mb-5 border-b border-gray-300">
                <BaseTabs
                  tabs={paymentTabs}
                  activeTab={paymentType}
                  onChange={(value) => setPaymentType(value as PaymentType)}
                />
              </div>

              <div className="flex flex-col space-y-5 flex-1">
                <BaseInput
                  label="Responsable de la Venta"
                  name="responsableVenta"
                  type="text"
                  placeholder="Nombre del vendedor"
                  value={responsableVenta}
                  onChange={(e) => setResponsableVenta(e.target.value)}
                />

                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-600">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const active = venta.metodoPago === method.key;
                      return (
                        <motion.button
                          key={method.key}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            dispatch(setMetodoPago(method.key as any))
                          }
                          className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all duration-300 ${
                            active ? "border-blue bg-blue/5" : "border-gray-200"
                          }`}
                        >
                          <Image
                            src={method.icon}
                            alt={method.label}
                            width={36}
                            height={36}
                          />
                          <span className="text-sm">{method.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BaseInput
                    label="Total"
                    name="total"
                    type="text"
                    value={`S/ ${totalFromCart}`}
                    readOnly
                  />
                  <BaseInput
                    label="Pago"
                    name="payment"
                    type="number"
                    value={venta.total || 0}
                    onChange={onChange}
                  />
                  <BaseInput
                    label={paymentType === "cash" ? "Cambio" : "Deuda"}
                    name="result"
                    type="text"
                    value={`S/ ${
                      paymentType === "cash"
                        ? change.toFixed(2)
                        : debt.toFixed(2)
                    }`}
                    readOnly
                  />
                </div>

                <BaseInput
                  label="Nro Cuotas"
                  name="nroCuotas"
                  type="number"
                  value={nroCuotas}
                  onChange={(e) => setNroCuotas(Number(e.target.value))}
                />

                <BaseTarea
                  label="Observaciones"
                  name="observaciones"
                  value={observaciones}
                  placeholder="Descripción breve"
                  onChange={(e) => setObservacionesLocal(e.target.value)}
                />

                <button
                  onClick={handleRegisterSale}
                  className="mt-auto w-full rounded-2xl bg-blue py-3 text-white font-bold hover:bg-blue-dark transition-all"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrar Venta"}
                </button>
              </div>
            </div>
          </div>

          {/* Panel Montaje - Fijo 55% */}
          <div className="w-[55%] flex-shrink-0">
            {showOrder && (
              <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg h-full animate-in fade-in duration-500">
                <h2 className="text-lg font-bold mb-4">Detalles de Montaje</h2>
                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">
                    Panel de configuración de montaje
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethod;
