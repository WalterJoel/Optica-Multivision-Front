"use client";

import { useEffect, useState } from "react";
import { BaseInput, BaseSelect } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { IDescuento } from "@/types/discounts";
import { ModalFrameWrapper, StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { useUpdateDiscount } from "@/hooks/discounts/useUpdateDiscount";
import { Tags, X } from "lucide-react";
import { useClients } from "@/hooks/clients";

const emptyForm = {
  montoDescuento: "" as unknown as number,
  serie: 1,
};

export default function EditDiscountModal({
  isOpen,
  discount,
  onClose,
  onRefresh,
}: {
  isOpen: boolean;
  discount: IDescuento | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const { updateDiscount, loading, success, statusMessage } = useUpdateDiscount();
  const { clientes, loadClientes } = useClients();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    loadClientes();
  }, []);

  const getClientName = (clientId: number) => {
    const client = clientes.find((c) => c.id === clientId);
    return client ? `${client.nombres} ${client.apellidos}` : `Cliente #${clientId}`;
  };

  const getProductName = (d: IDescuento) => {
    if (d.tipoProducto === "LENTE" && d.lente) {
      return `${d.lente.marca} - ${d.lente.material}`;
    }
    return d.producto?.nombre ?? "Desconocido";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === "serie" ? Number(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [e.target.name]: val }));
  };

  const edit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discount) return;
    const payload: any = {
      montoDescuento: Number(form.montoDescuento) || 0,
    };
    if (discount.tipoProducto === "LENTE") {
      payload.serie = Number(form.serie) || 1;
    }
    await updateDiscount(discount.id, payload);
  };

  useEffect(() => {
    if (discount) {
      setForm({
        montoDescuento: discount.montoDescuento,
        serie: discount.serie ?? 1,
      });
    }
  }, [discount]);

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      setTypeModal(
        success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL
      );
      setStatusMsg(statusMessage);
      setOpenStatusModal(true);
      if (success) {
        onRefresh();
      }
    }
  }, [loading, success, statusMessage]);

  const handleCloseStatus = () => {
    setOpenStatusModal(false);
    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      onClose();
    }
  };

  if (!isOpen || !discount) return null;

  return (
    <>
      <ModalFrameWrapper size="lg">
        <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                <Tags size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                  Editar Descuento
                </h3>
                <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                  ID Descuento: {discount.id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={edit}>
            {/* Card Container */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Detalles del Descuento
                </h4>
              </div>

              {/* Readonly info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-xs">
                <div>
                  <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Cliente</span>
                  <span className="font-black text-dark uppercase">{getClientName(discount.clienteId)}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Tipo Producto</span>
                  <span className="font-black text-dark uppercase">{discount.tipoProducto}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Producto / Lente</span>
                  <span className="font-bold text-dark-2 uppercase">{getProductName(discount)}</span>
                </div>
                {discount.tipoProducto === "LENTE" && (
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Serie Lente</span>
                    <span className="font-bold text-dark-2 uppercase">Serie {discount.serie}</span>
                  </div>
                )}
              </div>

              <div className={`grid grid-cols-1 ${discount.tipoProducto === "LENTE" ? "sm:grid-cols-2" : ""} gap-4`}>
                {discount.tipoProducto === "LENTE" && (
                  <BaseSelect
                    label="Serie del Lente"
                    name="serie"
                    value={form.serie}
                    options={[
                      { label: "Serie 1", value: 1 },
                      { label: "Serie 2", value: 2 },
                      { label: "Serie 3", value: 3 },
                    ]}
                    required
                    onChange={handleChange}
                  />
                )}
                <BaseInput
                  label="Monto de Descuento (S/)"
                  name="montoDescuento"
                  value={form.montoDescuento}
                  placeholder="0.00"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  title="Solo se permiten hasta 2 decimales (ej. 12.50)"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <BaseButton
                type="button"
                onClick={onClose}
                variant="cancel"
                fullWidth={false}
                className="px-6"
              >
                Cancelar
              </BaseButton>

              <BaseButton
                loading={loading}
                type="submit"
                fullWidth={false}
                className="px-6"
              >
                Guardar
              </BaseButton>
            </div>
          </form>
        </div>
      </ModalFrameWrapper>

      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openStatusModal}
        type={typeModal}
        message={statusMsg}
        onClose={handleCloseStatus}
      />
    </>
  );
}
