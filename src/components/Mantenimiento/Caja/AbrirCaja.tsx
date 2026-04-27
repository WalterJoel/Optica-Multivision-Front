"use client";

import { useState, useEffect } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICreateCaja } from "@/types/caja";
import { useCreateCaja, useValidarCajaAbierta } from "@/hooks/caja";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { useSessionUser } from "@/hooks/session";

const emptyForm: ICreateCaja = {
  saldoInicial: 0,
  sedeId: 0,
  userId: 0,
};

export default function CreateCaja() {
  const [form, setForm] = useState<ICreateCaja>(emptyForm);
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // Hooks
  const { createCaja, statusMessage, loading } = useCreateCaja();
  const { validarCajaAbierta, existe } = useValidarCajaAbierta();
  const { sedeId, userId, fullName, user } = useSessionUser();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]: name === "saldoInicial" ? Number(value) : value,
    }));
  };

  // CREAR CAJA
  const create = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createCaja(form);

    if (result?.success) {
      await validarCajaAbierta(sedeId);
      setForm(emptyForm);

      setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
    } else {
      setTypeModal(STATUS_MODAL.ERROR_MODAL);
    }

    setOpenModal(true);
  };

  // INIT + VALIDACIÓN CAJA
  useEffect(() => {
    if (sedeId && userId) {
      const init = {
        saldoInicial: 0,
        sedeId,
        userId,
      };

      setForm(init);
      validarCajaAbierta(sedeId);
    }
  }, [sedeId, userId]);

  return (
    <>
      <form
        onSubmit={create}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <BaseInput
            label="Saldo Inicial"
            name="saldoInicial"
            value={form.saldoInicial}
            placeholder="140.00"
            required
            disabled={existe}
            type="number"
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading} disabled={existe}>
            Crear caja
          </BaseButton>
        </div>

        {existe ? (
          <p className="mt-4 text-center text-sm text-red-500">
            Ya existe una caja abierta. Debes cerrarla antes de abrir otra.
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-green-600">
            No hay caja abierta. Puedes abrir una nueva para la sede{" "}
            {user?.sedeNombre} y el usuario {fullName}.
          </p>
        )}
      </form>

      {/* MODALS */}
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
