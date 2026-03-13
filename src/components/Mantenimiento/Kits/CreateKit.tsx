"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseButtonIcon } from "@/components/Common/Buttons/BaseButtonIcon";
import { BaseTarea } from "@/components/Common/Inputs";
import { AddAccessoryModal } from "./AddAccessoryModal";
import {
  ICreateAccesory,
  ICreateKit,
  ICreateKitAccesory,
  IKitAccesory,
} from "@/types/kits";
import { useCreateKit } from "@/hooks/kits/useCreateKit";
import { Plus, Trash2 } from "lucide-react";
import {
  StatusModal,
  LoadingModal,
  InfoModal,
} from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

const emptyForm: ICreateKit = {
  nombre: "",
  descripcion: "",
  precio: 0,
};

const emptyAccesory: IKitAccesory = {
  id: 0,
  nombre: "",
  cantidad: 1,
  productoId: 0,
  precio: 0,
};

export default function CreateKit() {
  const [form, setForm] = useState<ICreateKit>(emptyForm);
  const [accesorios, setAccesorios] = useState<IKitAccesory[]>([]);
  const [newAccesory, setNewAccesory] = useState<IKitAccesory>(emptyAccesory);

  const [openModal, setOpenModal] = useState(false);
  const [openModalAccesory, setOpenModalAccesory] = useState(false);
  const [typeModal, setTypeModal] = useState("");

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ message: "", code: "" });

  const { addKit, loading, statusMessage, success } = useCreateKit();

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

  const createKit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accesorios.length === 0) {
      setInfoConfig({
        message: "No ingresaste ningún accesorio aún",
        code: "KIT VACIO",
      });
      setIsInfoOpen(true);
      return;
    }

    const payload: ICreateKitAccesory = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio,
      accesorios: accesorios.map((a) => ({
        accesorioId: a.id,
        cantidad: a.cantidad,
      })),
    };

    await addKit(payload);
  };

  useEffect(() => {
    const total = accesorios.reduce(
      (sum, acc) => sum + acc.precio * acc.cantidad,
      0,
    );

    setForm((prev) => ({
      ...prev,
      precio: total,
    }));
  }, [accesorios]);

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        setForm(emptyForm);
        setAccesorios([]);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }

      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <form
        onSubmit={createKit}
        className="w-full rounded-xl border border-gray-3 bg-white p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseInput
            label="Nombre del Kit"
            name="nombre"
            value={form.nombre}
            placeholder="Kit de Limpieza Premium"
            required
            onChange={onChange}
          />

          <BaseInput
            label="Precio"
            name="precio"
            type="number"
            value={form.precio}
            disabled
            onChange={onChange}
          />

          <BaseTarea
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            minLength={85}
            placeholder="Ejm: Incluye cristales con filtro azul, estuche rígido y líquido de limpieza profesional...."
            onChange={onChange}
            required
            className="md:col-span-3"
          />
        </div>

        <div className="mt-12">
          <div className="flex justify-end gap-2 mb-6">
            <BaseButtonIcon
              variant="primary"
              center={false}
              onClick={() => setOpenModalAccesory(true)}
            >
              <Plus size={20} />
            </BaseButtonIcon>
          </div>

          <div className="border border-gray-3 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-3">
                <tr>
                  <th className="p-4 text-left">Accesorio</th>
                  <th className="p-4 text-center">Cantidad</th>
                  <th className="p-4 text-center">Precio</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {accesorios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400">
                      No agregaste accesorios aún
                    </td>
                  </tr>
                ) : (
                  accesorios.map((acc) => (
                    <tr key={acc.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{acc.nombre}</td>
                      <td className="p-4 text-center">{acc.cantidad}</td>
                      <td className="p-4 text-center">{acc.precio}</td>

                      <td className="p-4 text-center">
                        <BaseButtonIcon
                          type="button"
                          variant="danger"
                          onClick={() => eliminarAccesorio(acc.id)}
                        >
                          <Trash2 size={18} />
                        </BaseButtonIcon>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <BaseButton type="submit">Crear Kit</BaseButton>
        </div>
      </form>

      <AddAccessoryModal
        isOpen={openModalAccesory}
        onClose={() => setOpenModalAccesory(false)}
        newAccesory={newAccesory}
        setNewAccesory={setNewAccesory}
        onAdd={addAccesory}
      />

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
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
