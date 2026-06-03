"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseButtonIcon } from "@/components/Common/Buttons/BaseButtonIcon";
import { BaseTarea } from "@/components/Common/Inputs";
import { AddAccessoryModal } from "./AddAccessoryModal";
import { IKit, IKitAccesory, ICreateKitAccesory } from "@/types/kits";
import { useUpdateKit } from "@/hooks/kits/useUpdateKit";
import { Plus, Trash2, Briefcase } from "lucide-react";
import {
  StatusModal,
  LoadingModal,
  InfoModal,
  ModalFrameWrapper,
} from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

interface EditKitModalProps {
  isOpen: boolean;
  kit: IKit | null;
  onClose: () => void;
  onRefresh: () => void;
}

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: 0,
};

const emptyAccesory: IKitAccesory = {
  id: 0,
  nombre: "",
  cantidad: 1,
  productoId: 0,
  precioVenta: 0,
};

export default function EditKitModal({
  isOpen,
  kit,
  onClose,
  onRefresh,
}: EditKitModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [accesorios, setAccesorios] = useState<IKitAccesory[]>([]);
  const [newAccesory, setNewAccesory] = useState<IKitAccesory>(emptyAccesory);

  const [openModalAccesory, setOpenModalAccesory] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ message: "", code: "" });

  const { updateKit, loading, statusMessage, success } = useUpdateKit();

  // Populate data when modal opens with a valid kit
  useEffect(() => {
    if (isOpen && kit) {
      setForm({
        nombre: kit.nombre || "",
        descripcion: kit.descripcion || "",
        precio: kit.precio || 0,
      });

      if (kit.accesorios) {
        const mapped = kit.accesorios.map((a) => ({
          id: a.accesorio.id,
          nombre: a.accesorio.nombre,
          cantidad: a.cantidad,
          productoId: a.accesorio.id,
          precioVenta: a.accesorio.precioVenta ?? 0,
        }));
        setAccesorios(mapped);
      } else {
        setAccesorios([]);
      }
    }
  }, [isOpen, kit]);

  // Recalculate total price when accessories change
  useEffect(() => {
    const total = accesorios.reduce(
      (sum, acc) => sum + acc.precioVenta * acc.cantidad,
      0,
    );

    setForm((prev) => ({
      ...prev,
      precio: total,
    }));
  }, [accesorios]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const addAccesory = () => {
    if (!newAccesory.productoId) {
      setInfoConfig({
        message: "Debes seleccionar un accesorio válido",
        code: "ACC_INV",
      });
      setIsInfoOpen(true);
      return;
    }

    const existe = accesorios.some((a) => a.id === newAccesory.id);

    if (existe) {
      setInfoConfig({
        message: "Este accesorio ya fue agregado al kit.",
        code: "DUPLICADO",
      });
      setIsInfoOpen(true);
      return;
    }

    setAccesorios((prev) => [...prev, newAccesory]);
    setNewAccesory(emptyAccesory);
    setOpenModalAccesory(false);
  };

  const eliminarAccesorio = (id: number) => {
    setAccesorios((prev) => prev.filter((a) => a.id !== id));
  };

  const submitEditForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kit) return;

    if (accesorios.length === 0) {
      setInfoConfig({
        message: "No ingresaste ningún accesorio aún",
        code: "KIT VACIO",
      });
      setIsInfoOpen(true);
      return;
    }

    const payload: Partial<ICreateKitAccesory> = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio,
      accesorios: accesorios.map((a) => ({
        accesorioId: a.id,
        cantidad: a.cantidad,
      })),
    };

    await updateKit(kit.id, payload);
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

  if (!isOpen || !kit) return null;

  return (
    <>
      <ModalFrameWrapper variant="yellow" size="lg">
        {/* Envoltorio del contenido con scroll interno si es necesario */}
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Cabecera Premium */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-3 pb-5">
            <div className="h-12 w-12 flex items-center justify-center bg-yellow-light/20 rounded-2xl text-yellow-dark shadow-sm">
              <Briefcase size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-[1000] text-xl text-dark uppercase tracking-wider">
                Editar Kit de Accesorios
              </h3>
              <p className="text-xs text-dark-5 font-bold uppercase mt-0.5">
                ID KIT: #{kit.id}
              </p>
            </div>
          </div>

          <form onSubmit={submitEditForm} className="flex flex-col gap-6 pb-6">
            {/* Sección 1: Datos Básicos */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Información Básica
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  label="Nombre del Kit"
                  name="nombre"
                  value={form.nombre}
                  placeholder="Kit de Limpieza Premium"
                  required
                  onChange={onChange}
                />

                <BaseInput
                  label="Precio Total (S/)"
                  name="precio"
                  type="number"
                  value={form.precio}
                  disabled
                  onChange={onChange}
                />
              </div>

              <div className="mt-4">
                <BaseTarea
                  label="Descripción"
                  name="descripcion"
                  value={form.descripcion}
                  minLength={10}
                  placeholder="Ejm: Incluye estuche rígido y líquido de limpieza..."
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Sección 2: Lista de Accesorios */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                  <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                    Accesorios del Kit
                  </h4>
                </div>

                <BaseButtonIcon
                  type="button"
                  variant="primary"
                  center={false}
                  onClick={() => setOpenModalAccesory(true)}
                  className="rounded-xl scale-95"
                >
                  <Plus size={18} />
                </BaseButtonIcon>
              </div>

              <div className="border border-gray-3 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-3 text-dark font-black">
                    <tr>
                      <th className="p-4 text-left text-xs uppercase tracking-wider">
                        Accesorio
                      </th>
                      <th className="p-4 text-center text-xs uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="p-4 text-center text-xs uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th className="p-4 text-center text-xs uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {accesorios.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                        >
                          No hay accesorios agregados aún
                        </td>
                      </tr>
                    ) : (
                      accesorios.map((acc) => (
                        <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-semibold text-dark-2">
                            {acc.nombre}
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-dark bg-beige px-3 py-1 rounded-xl border border-slate-200">
                              {acc.cantidad} uds
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-dark">
                            S/ {Number(acc.precioVenta).toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <BaseButtonIcon
                              type="button"
                              variant="danger"
                              onClick={() => eliminarAccesorio(acc.id)}
                            >
                              <Trash2 size={16} />
                            </BaseButtonIcon>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Acciones del Formulario */}
            <div className="flex justify-end gap-3 border-t border-gray-3 pt-5 mt-2">
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
                Guardar Cambios
              </BaseButton>
            </div>
          </form>
        </div>
      </ModalFrameWrapper>

      <AddAccessoryModal
        isOpen={openModalAccesory}
        onClose={() => setOpenModalAccesory(false)}
        newAccesory={newAccesory}
        setNewAccesory={setNewAccesory}
        onAdd={addAccesory}
      />

      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openStatusModal}
        type={typeModal}
        message={statusMsg}
        onClose={handleCloseStatus}
      />

      <InfoModal
        isOpen={isInfoOpen}
        title="Aviso"
        message={infoConfig.message}
        code={infoConfig.code}
        onClose={() => setIsInfoOpen(false)}
      />
    </>
  );
}
