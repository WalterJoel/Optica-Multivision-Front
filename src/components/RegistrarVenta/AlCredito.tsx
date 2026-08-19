import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";

// Components
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import {
    BaseInput,
    BaseSearchInput,
    BaseTarea,
} from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { TicketVenta } from "../Ventas/TicketVenta";
import { ModalVentaExitosa } from "./ModalVentaExitosa";

// Hooks y Store
import { useCreateSale } from "@/hooks/sales";
import { useStores } from "@/hooks/stores";
import { useAppSelector } from "@/redux/store";

// Selectores de Slices
import { selectAuth } from "@/redux/features/auth-slice";
import { selectVenta, setMetodoPago, resetVenta, setClienteId } from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems, removeAllItemsFromCart } from "@/redux/features/cart-slice";

// Constants
import { TipoVenta, EstadoPago, STATUS_MODAL, TipoProducto, MetodoPago } from "@/commons/constants";
import { ICreateSale, VentaProducto, IResponseSale } from "@/types/sales";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CuotasSelector from "./CuotasSelector";
import { ISearchClient } from "@/types/clients";
import { useSearchClient } from "@/hooks/clients";
import { useSessionUser } from "@/hooks/session";
import PaymentDaysSelector from "./DaysSelector";
import Discount from "../Cart/Discount";

const AlCredito = () => {
    const dispatch = useDispatch();
    const { addSale, loading, statusMessage, success, createdSale } = useCreateSale();

    const { sedeId, userId, fullName } = useSessionUser();
    const { sedes } = useStores();

    const ventaStore = useAppSelector(selectVenta); // Escuchamos el store de venta

    const cartStoreItems = useAppSelector(selectCartItems);
    const cartStoreTotal = useAppSelector(selectTotalPrice);

    // Estados locales de UI
    const [debt, setDebt] = useState(0);
    const [showOrder, setShowOrder] = useState(false);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [nroCuotas, setNroCuotas] = useState<number>(0);
    const [observacionesLocal, setObservacionesLocal] = useState("");
    const [montoRecibido, setMontoRecibido] = useState("");
    const [typeModal, setTypeModal] = useState<string>("");
    const [diasCompromiso, setDiasCompromiso] = useState<number | null>(null);
    const [clienteError, setClienteError] = useState(false);

    // Impresión de ticket
    const refImpresion = useRef<HTMLDivElement>(null);

    const ejecutarImpresion = useReactToPrint({
        contentRef: refImpresion,
        documentTitle: createdSale ? `ticket-venta-${createdSale.id}` : "ticket-venta",
    });

    //Cliente
    const [searchClientTerm, setSearchClientTerm] = useState("");

    const {
        searchClients,
        clients,
        showList: showListClient,
        setShowList: setShowListClient,
    } = useSearchClient();

    useEffect(() => {
        const payment = parseFloat(montoRecibido) || 0;
        const total = cartStoreTotal || 0;
        setDebt(Math.max(0, total - payment));
    }, [montoRecibido, cartStoreTotal]);

    const handleRegisterSale = () => {
        // Validar cliente obligatorio en ventas a crédito
        if (!ventaStore.clienteId) {
            setClienteError(true);
            return;
        }
        setClienteError(false);
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

        const abonoReal = Math.min(Number(montoRecibido || 0), cartStoreTotal);

        const payload: ICreateSale = {
            sedeId: sedeId,
            userId: userId,
            clienteId: ventaStore.clienteId,
            metodoPago: ventaStore.metodoPago,
            montoPagado: abonoReal,
            productos: productosDesdeCart,
            total: cartStoreTotal,
            tipoVenta: TipoVenta.CREDITO,
            estadoPago:
                abonoReal >= cartStoreTotal
                    ? EstadoPago.PAGADO
                    : EstadoPago.PENDIENTE,
            montaje: showOrder,
            nroCuotas: nroCuotas,
            diasCompromisoPago: diasCompromiso,
            observaciones: observacionesLocal,
            deuda: debt,
        };

        addSale(payload);
    };

    const handleSelectClient = (c: ISearchClient) => {
        const displayName = c.tipoCliente === "EMPRESA" ? (c.razonSocial || "") : `${c.nombres || ""} ${c.apellidos || ""}`.trim();
        setSearchClientTerm(displayName);
        setShowListClient(false);
        dispatch(setClienteId(c.id));
        setClienteError(false);
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
                setSearchClientTerm("");
                setClienteError(false);
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

                                {/* CLIENTE - Requerido para crédito */}
                                <div className="relative">
                                    <label className="mb-1 flex items-center gap-1 text-sm font-bold text-gray-700">
                                        Cliente <span className="text-red font-bold text-xs">*</span>
                                        <span className="text-[10px] font-normal text-gray-400 ml-1">(requerido para crédito)</span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={searchClientTerm}
                                            onChange={(e) => {
                                                setSearchClientTerm(e.target.value);
                                                searchClients(e.target.value);
                                                if (!e.target.value) dispatch(setClienteId(null));
                                                if (clienteError) setClienteError(false);
                                            }}
                                            placeholder="Buscar por nombre o DNI..."
                                            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${clienteError
                                                ? "border-red focus:border-red ring-2 ring-red/20"
                                                : "border-gray-200 focus:border-blue focus:ring-2 focus:ring-blue/10"
                                                }`}
                                        />
                                    </div>
                                    {showListClient && clients.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                                            {clients.map((c) => {
                                                const name = c.tipoCliente === "EMPRESA"
                                                    ? c.razonSocial
                                                    : `${c.nombres || ""} ${c.apellidos || ""}`.trim();
                                                return (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => handleSelectClient(c)}
                                                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                                                    >
                                                        <span className="font-bold text-gray-800 text-sm">{name}</span>
                                                        <span className="text-[10px] text-gray-400 font-mono">{c.numeroDoc}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {clienteError && (
                                        <p className="mt-1.5 text-xs font-bold text-red">
                                            ✕ Debes seleccionar un cliente para ventas a crédito.
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
                                <div className="grid grid-cols-3 gap-4">
                                    <BaseInput
                                        label="Total Venta"
                                        value={`S/ ${cartStoreTotal.toFixed(2)}`}
                                        readOnly
                                    />
                                    <BaseInput
                                        label="Abono Inicial"
                                        type="number"
                                        value={montoRecibido}
                                        onChange={(e) => setMontoRecibido(e.target.value)}
                                    />
                                    <BaseInput
                                        label="Por Cobrar"
                                        value={`S/ ${debt.toFixed(2)}`}
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
                                <BaseButton
                                    onClick={handleRegisterSale}
                                    disabled={
                                        loading ||
                                        cartStoreTotal === 0 ||
                                        !ventaStore.metodoPago ||
                                        nroCuotas === 0 ||
                                        diasCompromiso === null ||
                                        !ventaStore.clienteId ||
                                        ventaStore.bloqueadoPorDeuda
                                    }
                                >
                                    {loading ? "PROCESANDO..." : "REGISTRAR VENTA"}
                                </BaseButton>
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
            {success ? (
                <ModalVentaExitosa
                    estaAbierto={openModal}
                    mensaje={statusMessage}
                    onCerrar={() => setOpenModal(false)}
                    onImprimirTicket={() => {
                        ejecutarImpresion();
                        setOpenModal(false);
                    }}
                />
            ) : (
                <StatusModal
                    isOpen={openModal}
                    type={typeModal}
                    message={statusMessage}
                    onClose={() => setOpenModal(false)}
                />
            )}

            {/* Ticket de Impresión (Oculto en pantalla, visible solo al imprimir) */}
            {createdSale && (
                <div className="hidden print:block">
                    <div ref={refImpresion}>
                        <TicketVenta
                            venta={createdSale}
                            sede={sedes.find((s) => s.id === createdSale.sedeId)}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default AlCredito;
