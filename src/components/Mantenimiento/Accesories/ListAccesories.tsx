"use client";

import { useEffect, useState } from "react";
import { useAccessories } from "@/hooks/products/accesories/useAccessories";
import { useUpdateAccessory } from "@/hooks/products/accesories/useUpdateAccesory";
import { IAccessory } from "@/types/products";
import { BaseInput, BaseFile, BaseTarea } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

/* TIPADO LIMPIO */
type AccessoryForm = {
  nombre: string;
  precio: number;
  atributo: string;
  imagenUrl: string;
};

const emptyForm: AccessoryForm = {
  nombre: "",
  precio: 0,
  atributo: "",
  imagenUrl: "",
};

export default function ListAccesories() {
  const { accessories, loading, getAllAccessoriesData } = useAccessories();

  const {
    updateAccessory,
    loading: updating,
    statusMessage,
    success,
  } = useUpdateAccessory();

  const [selected, setSelected] = useState<IAccessory | null>(null);
  const [form, setForm] = useState<AccessoryForm>(emptyForm);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusType, setStatusType] = useState<string>("");

  /* LOAD DATA */
  useEffect(() => {
    getAllAccessoriesData();
  }, []);

  /* STATUS HANDLER */
  useEffect(() => {
    if (!updating && statusMessage) {
      setStatusType(
        success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );

      setStatusOpen(true);

      if (success) {
        setSelected(null);
        getAllAccessoriesData();
      }
    }
  }, [updating, success, statusMessage]);

  /* OPEN EDIT */
  const openEdit = (item: IAccessory) => {
    setSelected(item);

    setForm({
      nombre: item.nombre ?? "",
      precio: Number(item.precio) || 0,
      atributo: item.atributo ?? "",
      imagenUrl: item.imagenUrl ?? "",
    });
  };

  /* CLOSE EDIT */
  const closeEdit = () => {
    setSelected(null);
    setForm(emptyForm);
  };

  /* CHANGE INPUTS */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  /* IMAGE UPLOAD */
  const handleFile = async (file: File | null) => {
    if (!file) {
      setForm((p) => ({ ...p, imagenUrl: "" }));
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload-s3", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    setForm((p) => ({ ...p, imagenUrl: data.url }));
  };

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    await updateAccessory(selected.id, form);
  };

  return (
    <>
      <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-3">
          <p className="font-medium text-dark">
            Accesorios ({accessories.length})
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-1">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Detalle</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3">Imagen</th>
                <th className="px-6 py-3 text-right">Acción</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6">
                    Cargando...
                  </td>
                </tr>
              ) : accessories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6">
                    Sin accesorios
                  </td>
                </tr>
              ) : (
                accessories.map((item) => (
                  <tr key={item.id} className="border-t border-gray-3">
                    <td className="px-6 py-4 font-medium">{item.nombre}</td>

                    <td className="px-6 py-4 text-gray-500">
                      {item.atributo || "-"}
                    </td>

                    <td className="px-6 py-4 font-bold text-blue">
                      S/ {Number(item.precio).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      {item.imagenUrl ? (
                        <img
                          src={item.imagenUrl}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-2 text-xs font-bold bg-gray-1 rounded-md hover:bg-blue hover:text-white transition"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />

          <div className="relative w-full max-w-2xl bg-white rounded-xl p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold">Editar accesorio</h3>
              <p className="text-sm text-gray-500">
                Actualiza información del producto
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <BaseInput
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />

              <BaseInput
                label="Precio"
                name="precio"
                type="number"
                value={form.precio}
                onChange={handleChange}
              />

              <BaseTarea
                label="Descripción"
                name="atributo"
                value={form.atributo}
                onChange={handleChange}
              />

              <BaseFile
                label="Imagen"
                name="imagen"
                onChange={handleFile}
                currentUrl={form.imagenUrl}
              />

              <div className="flex justify-end gap-3">
                <BaseButton type="button" onClick={closeEdit}>
                  Cancelar
                </BaseButton>

                <BaseButton type="submit" loading={updating}>
                  Guardar
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <LoadingModal isOpen={updating} />

      <StatusModal
        isOpen={statusOpen}
        type={statusType}
        message={statusMessage}
        onClose={() => setStatusOpen(false)}
      />
    </>
  );
}
