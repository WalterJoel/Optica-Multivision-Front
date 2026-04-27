"use client";

import { useState, useEffect } from "react";
import { ICerrarCaja } from "@/types/caja";
import { useCerrarCaja, useValidarCajaAbierta } from "@/hooks/caja";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { BaseButton } from "@/components/Common/Buttons";
import { useSessionUser } from "@/hooks/session";
import { BaseInput } from "@/components/Common/Inputs";

const emptyForm: ICerrarCaja = {
  cajaId: 0,
  saldoFinal: 0,
};

export default function CerrarCaja() {
  const [form, setForm] = useState<ICerrarCaja>(emptyForm);
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // 🔥 hooks
  const { cerrarCaja, statusMessage, loading } = useCerrarCaja();
  const { validarCajaAbierta, caja, existe } = useValidarCajaAbierta();
  const { sedeId } = useSessionUser();

  // 🔥 validar caja al entrar
  useEffect(() => {
    if (sedeId) validarCajaAbierta(sedeId);
  }, [sedeId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]: name === "saldoFinal" ? Number(value) : value,
    }));
  };

  const cerrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!existe || !caja?.id) return;

    const payload: ICerrarCaja = {
      cajaId: caja.id,
      saldoFinal: Number(form.saldoFinal),
    };

    const result = await cerrarCaja(payload);

    if (result?.success) {
      setForm(emptyForm);
      await validarCajaAbierta(sedeId);

      setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
    } else {
      setTypeModal(STATUS_MODAL.ERROR_MODAL);
    }

    setOpenModal(true);
  };

  return (
    <>
      <form
        onSubmit={cerrar}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <BaseInput
            label="Saldo Final"
            name="saldoFinal"
            value={form.saldoFinal}
            placeholder="140.00"
            min={1}
            required
            disabled={!existe}
            type="number"
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading} disabled={!existe}>
            Cerrar caja
          </BaseButton>
        </div>

        {existe ? (
          <p className="mt-4 text-center text-sm text-red-500">
            Hay una caja abierta. Puedes cerrarla.
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-green-600">
            No hay caja abierta.
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
