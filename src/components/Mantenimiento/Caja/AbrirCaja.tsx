"use client";

import { useState, useEffect } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICreateCaja } from "@/types/caja";
import { useCreateCaja } from "@/hooks/stores";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

const emptyForm: ICreateCaja = {
  saldoInicial: 0,
  sedeId: 0,
  userId: 0,
};

export default function CreateCaja() {
  const [form, setForm] = useState<ICreateCaja>(emptyForm);
  const { addStore, success, statusMessage, loading } = useCreateCaja();
  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const CreateCaja = async (e: React.FormEvent) => {
    e.preventDefault();

    await addStore(form);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        setForm(emptyForm);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <form
        onSubmit={CreateCaja}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <BaseInput
            label="Saldo Inicial"
            name="saldo"
            value={form.saldoInicial}
            placeholder="140.00"
            required
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading}>
            Crear sede
          </BaseButton>
        </div>
        {/* Aviso  */}
        <p className="mt-4 text-center text-sm text-red-500">
          Abriendo caja para la sede y el usuario logueado ...
        </p>
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
