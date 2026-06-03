"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseTarea } from "@/components/Common/Inputs";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";
import { IMovimientosCaja, TipoMovimiento } from "@/types/caja-movimiento";
import { useUpdateCajaMovimiento } from "@/hooks/caja-movimiento";
import { Wallet } from "lucide-react";
import {
  StatusModal,
  LoadingModal,
  ModalFrameWrapper,
} from "@/components/Common/modal";
import { MetodoPago, STATUS_MODAL } from "@/commons/constants";

interface EditCajaMovimientoModalProps {
  isOpen: boolean;
  movimiento: IMovimientosCaja | null;
  onClose: () => void;
  onRefresh: () => void;
}

const emptyForm = {
  tipo: TipoMovimiento.INGRESO,
  monto: "" as unknown as number,
  descripcion: "",
  metodoPago: MetodoPago.EFECTIVO,
};

export default function EditCajaMovimientoModal({
  isOpen,
  movimiento,
  onClose,
  onRefresh,
}: EditCajaMovimientoModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const { updateCajaMovimiento, loading, statusMessage, success } =
    useUpdateCajaMovimiento();

  useEffect(() => {
    if (isOpen && movimiento) {
      setForm({
        tipo: movimiento.tipo || TipoMovimiento.INGRESO,
        monto: movimiento.monto || ("" as unknown as number),
        descripcion: movimiento.descripcion || "",
        metodoPago: (movimiento.metodoPago as MetodoPago) || MetodoPago.EFECTIVO,
      });
    }
  }, [isOpen, movimiento]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEditForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!movimiento) return;

    const payload = {
      tipo: form.tipo,
      monto: Number(form.monto) || 0,
      descripcion: form.descripcion,
      metodoPago: form.metodoPago,
      sedeId: movimiento.sedeId,
    };

    await updateCajaMovimiento(movimiento.id, payload);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      setTypeModal(
        success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setStatusMsg(statusMessage);
      setOpenStatusModal(true);
    }
  }, [loading, success, statusMessage]);

  const handleCloseStatus = () => {
    setOpenStatusModal(false);
    if (success) {
      onRefresh();
      onClose();
    }
  };

  if (!isOpen || !movimiento) return null;

  return (
    <>
      <ModalFrameWrapper variant="yellow" size="sm">
        <div className="flex flex-col gap-4 pb-6">
          {/* Cabecera Premium */}
          <div className="flex items-center gap-4 mb-4 border-b border-gray-3 pb-5">
            <div className="h-12 w-12 flex items-center justify-center bg-yellow-light/20 rounded-2xl text-yellow-dark shadow-sm">
              <Wallet size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-[1000] text-xl text-dark uppercase tracking-wider">
                Editar Movimiento
              </h3>
              <p className="text-xs text-dark-5 font-bold uppercase mt-0.5">
                ID Movimiento: #{movimiento.id}
              </p>
            </div>
          </div>

          <form onSubmit={submitEditForm} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4">
              <BaseSelect
                label="Tipo"
                name="tipo"
                value={form.tipo}
                placeholder="Seleccione tipo"
                required
                options={[
                  { label: "Ingreso", value: TipoMovimiento.INGRESO },
                  { label: "Egreso", value: TipoMovimiento.EGRESO },
                ]}
                onChange={onChange}
              />

              <BaseInput
                label="Monto"
                name="monto"
                type="number"
                value={form.monto}
                placeholder="0.00"
                required
                onChange={onChange}
              />

              <BaseSelect
                label="Método de Pago"
                name="metodoPago"
                value={form.metodoPago}
                placeholder="Selecciona método"
                required
                options={[
                  { label: "Efectivo", value: MetodoPago.EFECTIVO },
                  { label: "Yape", value: MetodoPago.YAPE },
                  { label: "Plin", value: MetodoPago.PLIN },
                  { label: "Transferencia", value: MetodoPago.TRANSFERENCIA },
                ]}
                onChange={onChange}
              />

              <BaseTarea
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                placeholder="Descripción del movimiento..."
                onChange={onChange}
              />
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 mt-4 border-t border-gray-3 pt-5">
              <BaseButton
                type="button"
                onClick={onClose}
                variant="cancel"
                fullWidth={false}
                className="px-6"
                disabled={loading}
              >
                Cancelar
              </BaseButton>

              <BaseButton
                loading={loading}
                type="submit"
                fullWidth={false}
                className="px-6"
                disabled={loading}
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
