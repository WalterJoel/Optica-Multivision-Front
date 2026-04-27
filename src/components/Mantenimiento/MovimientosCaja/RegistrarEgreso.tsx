"use client";

import { useState, useEffect } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICrearMovimientoCaja, TipoMovimiento } from "@/types/caja-movimiento";
import { useValidarCajaAbierta } from "@/hooks/caja";
import { useCrearMovimientoCaja } from "@/hooks/caja-movimiento";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { MetodoPago, STATUS_MODAL } from "@/commons/constants";
import { useSessionUser } from "@/hooks/session";
import { BaseTarea } from "@/components/Common/Inputs";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";

const emptyForm: ICrearMovimientoCaja = {
  cajaId: 0,
  tipo: TipoMovimiento.EGRESO,
  monto: 0,
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

  const { validarCajaAbierta, caja, existe } = useValidarCajaAbierta();

  const { sedeId } = useSessionUser();

  // VALIDACIÓN INICIAL DE CAJA
  useEffect(() => {
    if (sedeId) {
      validarCajaAbierta(sedeId);
    }
  }, [sedeId]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();

    // SOLO SI HAY CAJA ABIERTA
    if (!existe || !caja?.id) return;

    const payload: ICrearMovimientoCaja = {
      ...form,
      cajaId: caja.id,
    };

    const result = await crearMovimientoCaja(payload);

    // LIMPIEZA + REFRESH
    if (result?.success) {
      setForm(emptyForm);
      await validarCajaAbierta(sedeId);
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
            disabled={!existe}
            onChange={onChange}
          />

          <BaseSelect
            label="Método de Pago"
            name="metodoPago"
            value={form.metodoPago}
            placeholder="Selecciona método"
            required
            disabled={!existe}
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
            disabled={!existe}
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading} disabled={!existe}>
            Registrar Egreso
          </BaseButton>
        </div>

        {!existe ? (
          <p className="mt-4 text-center text-sm text-red-500">
            No puedes registrar movimientos porque no hay una caja abierta.
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-green-600">
            Caja activa — Puedes registrar Egresos
          </p>
        )}
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
