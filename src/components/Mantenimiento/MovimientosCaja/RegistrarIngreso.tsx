"use client";

import { useState, useEffect } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICrearMovimientoCaja, TipoMovimiento } from "@/types/caja-movimiento";
import { useCrearMovimientoCaja } from "@/hooks/caja-movimiento";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { MetodoPago, STATUS_MODAL } from "@/commons/constants";
import { useSessionUser } from "@/hooks/session";
import { BaseTarea } from "@/components/Common/Inputs";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";

const emptyForm: ICrearMovimientoCaja = {
  tipo: TipoMovimiento.INGRESO,
  monto: "" as unknown as number,
  sedeId: 0,
  descripcion: "",
  metodoPago: MetodoPago.EFECTIVO,
};

export default function RegistrarIngreso() {
  const [form, setForm] = useState<ICrearMovimientoCaja>(emptyForm);
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // HOOKS
  const { crearMovimientoCaja, statusMessage, loading } =
    useCrearMovimientoCaja();

  const { sedeId } = useSessionUser();



  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ICrearMovimientoCaja = {
      ...form,
      monto: Number(form.monto) || 0,
      sedeId: Number(sedeId),
    };

    const result = await crearMovimientoCaja(payload);

    // LIMPIEZA + REFRESH
    if (result?.success) {
      setForm(emptyForm);
    }

    setTypeModal(
      result?.success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
    );

    setOpenModal(true);
  };

  return (
    <>
      <form
        onSubmit={crear}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BaseInput
            label="Monto"
            name="monto"
            value={form.monto}
            placeholder="100.00"
            required
            type="number"
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
            placeholder="Ingreso por venta..."
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading} >
            Registrar ingreso
          </BaseButton>
        </div>

      </form>

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
