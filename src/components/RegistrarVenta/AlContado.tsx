"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Components
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { BaseInput, BaseTarea } from "@/components/Common/Inputs";

// Hooks y Store
import { useCreateSale } from "@/hooks/sales";
import { useAppSelector } from "@/redux/store";

// Selectores de Slices
import { selectVenta } from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems } from "@/redux/features/cart-slice";

// Constants
import { TipoVenta, EstadoPago, STATUS_MODAL } from "@/commons/constants";
import { ICreateSale, VentaProducto } from "@/types/sales";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { useSessionUser } from "@/hooks/session";

import Discount from "../Cart/Discount";
import Montaje from "./Montaje";

const AlContado = () => {
    const { addSale, loading, statusMessage, success } = useCreateSale();
    const { sedeId, userId } = useSessionUser();

    const ventaStore = useAppSelector(selectVenta);
    const cartStoreItems = useAppSelector(selectCartItems);
    const cartStoreTotal = useAppSelector(selectTotalPrice);

    // Estados locales de UI
    const [change, setChange] = useState(0);
    const [showOrder, setShowOrder] = useState(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [observacionesLocal, setObservacionesLocal] = useState("");
    const [montoRecibido, setMontoRecibido] = useState("");
    const [typeModal, setTypeModal] = useState<string>("");

    useEffect(() => {
        const payment = parseFloat(montoRecibido) || 0;
        const total = cartStoreTotal || 0;
        setChange(Math.max(0, payment - total));
    }, [montoRecibido, cartStoreTotal]);

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
            sedeId: sedeId,
            userId: userId,
            metodoPago: ventaStore.metodoPago,
            kitId: ventaStore.kitRegaloId,
            montoPagado: Number(montoRecibido),
            productos: productosDesdeCart,
            total: cartStoreTotal,
            tipoVenta: TipoVenta.CONTADO,
            estadoPago:
                Number(montoRecibido) >= cartStoreTotal
                    ? EstadoPago.PAGADO
                    : EstadoPago.PENDIENTE,
            montaje: showOrder,
            nroCuotas: null,
            observaciones: observacionesLocal,
            deuda: 0,
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
        <>
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

                        <div className="flex flex-col space-y-5 flex-1">
                            <div>
                                <Discount />
                            </div>
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
                                    label="Vuelto"
                                    value={`S/ ${change.toFixed(2)}`}
                                    readOnly
                                />
                            </div>

                            <BaseTarea
                                label="Observaciones"
                                value={observacionesLocal}
                                onChange={(e) => setObservacionesLocal(e.target.value)}
                            />
                            <button
                                onClick={handleRegisterSale}
                                disabled={loading || cartStoreTotal === 0}
                                className={`mt-auto w-full rounded-xl py-4 text-white font-bold text-lg shadow-lg transition-all ${loading
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
                        <Montaje />

                    ) : (
                        <div className="h-full rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <p className="text-gray-400 italic text-sm">
                                Panel de montaje inactivo
                            </p>
                        </div>
                    )}
                </div>
            </div >

            <LoadingModal isOpen={loading} />
            <StatusModal
                isOpen={openModal}
                type={typeModal}
                message={statusMessage}
                onClose={() => setOpenModal(false)}
            />
        </>
    );
};

export default AlContado;
