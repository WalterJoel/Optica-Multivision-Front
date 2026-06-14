"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";

// Components
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import {
    BaseInput,
    BaseSearchInput,
    BaseTabs,
    BaseTarea,
} from "@/components/Common/Inputs";

// Hooks y Store
import { useCreateSale } from "@/hooks/sales";
import { useAppSelector } from "@/redux/store";

// Selectores de Slices
import { selectAuth } from "@/redux/features/auth-slice";
import { selectVenta, setMetodoPago, resetVenta } from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems, removeAllItemsFromCart } from "@/redux/features/cart-slice";

// Constants
import { TipoVenta, EstadoPago, STATUS_MODAL } from "@/commons/constants";
import { ICreateSale, VentaProducto } from "@/types/sales";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CuotasSelector from "./CuotasSelector";
import { ISearchClient } from "@/types/clients";
import { useSearchClient } from "@/hooks/clients";
import { useSessionUser } from "@/hooks/session";
import PaymentDaysSelector from "./DaysSelector";
import Discount from "../Cart/Discount";

type PaymentType = "cash" | "credit";

const AlCredito = () => {
    const dispatch = useDispatch();
    const { addSale, loading, statusMessage, success } = useCreateSale();

    const { sedeId, userId } = useSessionUser();

    const ventaStore = useAppSelector(selectVenta); // Escuchamos el store de venta
    console.log(ventaStore, " CENTA STORE -->>>>>>>>>>");
    const cartStoreItems = useAppSelector(selectCartItems);
    const cartStoreTotal = useAppSelector(selectTotalPrice);

    // Estados locales de UI
    const [paymentType, setPaymentType] = useState<PaymentType>("credit");
    const [change, setChange] = useState(0);
    const [debt, setDebt] = useState(0);
    const [showOrder, setShowOrder] = useState(false);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [nroCuotas, setNroCuotas] = useState<number>(0);
    const [observacionesLocal, setObservacionesLocal] = useState("");
    const [montoRecibido, setMontoRecibido] = useState("");
    const [typeModal, setTypeModal] = useState<string>("");
    const [diasCompromiso, setDiasCompromiso] = useState<number | null>(null);

    //Cliente
    const [searchClientTerm, setSearchClientTerm] = useState("");

    const paymentTabs = [
        { key: "cash", label: "Al Contado" },
        { key: "credit", label: "Al Crédito" },
    ];

    const {
        searchClients,
        clients,
        showList: showListClient,
        setShowList: setShowListClient,
    } = useSearchClient();

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
            precioUnitario: Number(item.price),
            cantidad: Number(item.quantity),
            subtotal: Number(
                ((Number(item.price) - (Number(item.discount) || 0)) * Number(item.quantity)).toFixed(2),
            ),
            descuento: item.discount ? Number(item.discount) : null,
            stockId: item.isLens ? item.id : null,
            cyl: item.cyl || null,
            esf: item.esf || null,
        }));

        const payload: ICreateSale = {
            sedeId: sedeId,
            userId: userId,
            clienteId: ventaStore.clienteId,
            metodoPago: ventaStore.metodoPago,
            montoPagado: Number(montoRecibido),
            productos: productosDesdeCart,
            total: cartStoreTotal,
            tipoVenta: paymentType === "cash" ? TipoVenta.CONTADO : TipoVenta.CREDITO,
            estadoPago:
                Number(montoRecibido) >= cartStoreTotal
                    ? EstadoPago.PAGADO
                    : EstadoPago.PENDIENTE,
            montaje: showOrder,
            nroCuotas: paymentType === "credit" ? nroCuotas : null,
            diasCompromisoPago: paymentType === "credit" ? diasCompromiso : null,
            observaciones: observacionesLocal,
            deuda: paymentType === "credit" ? debt : 0,
        };

        addSale(payload);
    };

    const handleSelectClient = (c: ISearchClient) => {
        setSearchClientTerm(`${c.nombres} ${c.apellidos}`);
        setShowListClient(false);
        // setForm((prev) => ({ ...prev, clienteId: c.id }));
    };

    useEffect(() => {
        if (!loading && (success || statusMessage)) {
            setTypeModal(
                success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
            );
            setOpenModal(true);
            if (success) {
                dispatch(removeAllItemsFromCart());
                dispatch(resetVenta());
                setNroCuotas(0);
                setObservacionesLocal("");
                setMontoRecibido("");
                setDiasCompromiso(null);
                setShowOrder(false);
            }
        }
    }, [loading, success, statusMessage]);

    return (
        <section className="w-full">
            <div className="w-full">
                <div className="flex flex-col lg:flex-row w-full gap-6">
                    {/* PANEL IZQUIERDO */}
                    <div className="w-full lg:w-[45%] flex-shrink-0">
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
                                {/* Buscar Cliente */}
                                <div>
                                    <Discount />
                                </div>
                                <div>
                                    <label className="mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-700">
                                        Método de Pago <span className="text-red font-bold text-xs">*</span>
                                    </label>
                                    <PaymentMethodSelector />
                                    {!ventaStore.metodoPago && (
                                        <p className="mt-2 text-xs font-semibold text-red animate-pulse">
                                            ⚠️ Por favor, seleccione un método de pago.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-700">
                                        Compromiso de Pago <span className="text-red font-bold text-xs">*</span>
                                    </label>

                                    <PaymentDaysSelector value={diasCompromiso} onChange={setDiasCompromiso} />
                                    {diasCompromiso === null && (
                                        <p className="mt-2 text-xs font-semibold text-red animate-pulse">
                                            ⚠️ Por favor, seleccione un compromiso de pago.
                                        </p>
                                    )}
                                </div>

                                {paymentType === "cash" && montoRecibido && Number(montoRecibido) < cartStoreTotal && (
                                    <p className="text-xs font-semibold text-red animate-pulse">
                                        ⚠️ El monto recibido debe ser mayor o igual al total de la venta (S/. {cartStoreTotal.toFixed(2)}).
                                    </p>
                                )}
                                {paymentType === "credit" && (
                                    <div className="w-full">
                                        <label className="mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-700">
                                            Número de Cuotas <span className="text-red font-bold text-xs">*</span>
                                        </label>
                                        <CuotasSelector value={nroCuotas} onChange={setNroCuotas} />
                                        {nroCuotas === 0 && (
                                            <p className="mt-2 text-xs font-semibold text-red animate-pulse">
                                                ⚠️ Por favor, seleccione el número de cuotas.
                                            </p>
                                        )}
                                    </div>
                                )}
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
                                        required={paymentType === "cash"}
                                        onChange={(e) => setMontoRecibido(e.target.value)}
                                    />
                                    <BaseInput
                                        label={paymentType === "cash" ? "Vuelto" : "Por Cobrar"}
                                        value={`S/ ${paymentType === "cash" ? change.toFixed(2) : debt.toFixed(2)}`}
                                        readOnly
                                    />
                                </div>
                                <BaseTarea
                                    label="Notas"
                                    value={observacionesLocal}
                                    onChange={(e) => setObservacionesLocal(e.target.value)}
                                />
                                {ventaStore.bloqueadoPorDeuda && ventaStore.deudaMensaje && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red rounded-xl flex flex-col gap-1 text-xs font-semibold animate-pulse">
                                        <span className="font-bold text-sm">⚠️ Operación Bloqueada</span>
                                        <span>{ventaStore.deudaMensaje}</span>
                                    </div>
                                )}
                                <button
                                    onClick={handleRegisterSale}
                                    disabled={
                                        loading ||
                                        cartStoreTotal === 0 ||
                                        !ventaStore.metodoPago ||
                                        (paymentType === "cash" && (!montoRecibido || Number(montoRecibido) < cartStoreTotal)) ||
                                        (paymentType === "credit" && (nroCuotas === 0 || diasCompromiso === null)) ||
                                        ventaStore.bloqueadoPorDeuda
                                    }
                                    className={`mt-auto w-full rounded-xl py-4 text-white font-bold text-lg shadow-lg transition-all ${loading ||
                                        cartStoreTotal === 0 ||
                                        !ventaStore.metodoPago ||
                                        (paymentType === "cash" && (!montoRecibido || Number(montoRecibido) < cartStoreTotal)) ||
                                        (paymentType === "credit" && (nroCuotas === 0 || diasCompromiso === null)) ||
                                        ventaStore.bloqueadoPorDeuda
                                        ? "bg-gray-400 cursor-not-allowed opacity-60"
                                        : "bg-blue hover:bg-blue-dark active:scale-[0.98]"
                                        }`}
                                >
                                    {loading ? "PROCESANDO..." : "REGISTRAR OPERACIÓN"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PANEL DERECHO */}
                    <div className="w-full lg:w-[55%] flex-shrink-0">
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

export default AlCredito;
