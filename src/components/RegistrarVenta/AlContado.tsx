"use client";

import React, { useEffect, useState } from "react";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { BaseInput, BaseTarea } from "@/components/Common/Inputs";
import { useCreateSale } from "@/hooks/sales";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
// Selectores de Slices
import { selectVenta } from "@/redux/features/sale-slice";
import { selectTotalPrice, selectCartItems, removeAllItemsFromCart } from "@/redux/features/cart-slice";
// Constants
import { TipoVenta, EstadoPago, STATUS_MODAL } from "@/commons/constants";
import { ICreateSale, VentaProducto } from "@/types/sales";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { useSessionUser } from "@/hooks/session";
import Discount from "../Cart/Discount";
import Montaje from "./Montaje";
import { BaseButton } from "../Common/Buttons";

const AlContado = () => {
    // Hooks
    const dispatch = useDispatch();
    const { addSale, loading, statusMessage, success } = useCreateSale();
    const { sedeId, userId } = useSessionUser();

    // Stores
    const ventaStore = useAppSelector(selectVenta);
    const cartStoreItems = useAppSelector(selectCartItems);
    const cartStoreTotal = useAppSelector(selectTotalPrice);

    // Estados locales de UI
    const [change, setChange] = useState(0);
    const [montaje, setmontaje] = useState(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [observacionesLocal, setObservacionesLocal] = useState("");
    const [montoRecibido, setMontoRecibido] = useState("");
    const [typeModal, setTypeModal] = useState<string>("");



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
            metodoPago: ventaStore.metodoPago,
            montoPagado: Number(montoRecibido),
            productos: productosDesdeCart,
            total: cartStoreTotal,
            tipoVenta: TipoVenta.CONTADO,
            estadoPago: EstadoPago.PAGADO,
            nroCuotas: null,
            observaciones: observacionesLocal,
            deuda: 0,
            montaje: montaje,
        };

        addSale(payload);
    };

    // Effct para calcular el vuelto
    useEffect(() => {
        const payment = parseFloat(montoRecibido) || 0;
        const total = cartStoreTotal || 0;
        setChange(Math.max(0, payment - total));
    }, [montoRecibido, cartStoreTotal]);

    // Effct para manejar los modales de respuesta
    useEffect(() => {
        if (!loading && (success || statusMessage)) {
            setTypeModal(
                success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
            );
            setOpenModal(true);
            if (success) {
                dispatch(removeAllItemsFromCart());
            }
        }
    }, [loading, success, statusMessage]);

    return (
        <>
            <div className="flex w-full gap-6">
                {/* PANEL IZQUIERDO */}
                <div className="w-[45%] flex-shrink-0 bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex flex-col rounded-xl bg-beige p-6 shadow-sm h-full">
                        <div className="mb-5 flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm">
                                <span className="text-sm font-bold text-gray-700">
                                    ¿Requiere Montaje?
                                </span>

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue border-gray-300 rounded"
                                    checked={montaje}
                                    onChange={() => setmontaje(!montaje)}
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
                                    required
                                    value={montoRecibido}
                                    min={cartStoreTotal}
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
                            <BaseButton
                                onClick={handleRegisterSale}
                                disabled={
                                    loading ||
                                    cartStoreTotal === 0 ||
                                    !montoRecibido
                                }
                            >
                                {loading ? "PROCESANDO..." : "REGISTRAR VENTA"}
                            </BaseButton>
                        </div>
                    </div>
                </div>

                {/* PANEL DERECHO */}
                <div className="w-[55%] flex-shrink-0">
                    {montaje ? (
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
