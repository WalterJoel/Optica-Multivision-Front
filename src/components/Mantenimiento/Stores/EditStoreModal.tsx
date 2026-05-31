"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { IStore, IUpdateStore } from "@/types/stores";
import { ModalFrameWrapper, StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { useUpdateStore } from "@/hooks/stores/useUpdateStore";
import { Building, X } from "lucide-react";

const emptyForm: IUpdateStore = {
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
};

export default function EditStoreModal({
  isOpen,
  store,
  onClose,
  onRefresh,
}: {
  isOpen: boolean;
  store: IStore | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState<IUpdateStore>(emptyForm);
  const { updateStore, loading, success, statusMessage } = useUpdateStore();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const edit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    await updateStore(store.id, form);
  };

  useEffect(() => {
    if (store) {
      const { nombre, ruc, direccion, telefono } = store;
      setForm({
        nombre,
        ruc,
        direccion,
        telefono,
      });
    }
  }, [store]);

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
  }, [loading, success, statusMessage, onRefresh]);

  const handleCloseStatus = () => {
    setOpenStatusModal(false);
    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      onClose();
    }
  };

  if (!isOpen || !store) return null;

  return (
    <>
      <ModalFrameWrapper size="lg">
        <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                <Building size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                  Editar Sede
                </h3>
                <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                  RUC: {store.ruc} • {store.nombre}
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
                  Información de la Sede
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                  label="Nombre"
                  name="nombre"
                  value={form.nombre ?? ""}
                  onChange={onChange}
                  required
                />

                <BaseInput
                  label="RUC"
                  name="ruc"
                  value={form.ruc ?? ""}
                  onChange={onChange}
                  required
                  pattern="[0-9]{11}"
                  title="El RUC debe tener 11 dígitos"
                />

                <BaseInput
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono ?? ""}
                  onChange={onChange}
                  required
                  pattern="[0-9]{9}"
                  title="El teléfono debe tener 9 dígitos"
                />

                <BaseInput
                  label="Dirección"
                  name="direccion"
                  value={form.direccion ?? ""}
                  onChange={onChange}
                  required

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
