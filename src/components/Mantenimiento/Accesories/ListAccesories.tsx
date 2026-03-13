"use client";

import { useEffect, useState } from "react";
import { useAccessories } from "@/hooks/products/accesories/useAccessories";
import { useUpdateAccessory } from "@/hooks/products/accesories/useUpdateAccesory";
import { IAccessory } from "@/types/products";
import { BaseInput, BaseFile, BaseTarea } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

const emptyForm = {
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

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IAccessory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [typeModal, setTypeModal] = useState<string>("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  useEffect(() => {
    getAllAccessoriesData();
  }, []);

  useEffect(() => {
    if (!updating && statusMessage) {
      setTypeModal(success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL);
      setOpenStatusModal(true);

      if (success) {
        setOpenEdit(false);
        getAllAccessoriesData();
      }
    }
  }, [updating, success, statusMessage]);

  const openEditModal = (item: IAccessory) => {
    setSelected(item);
    setForm({
      nombre: item.nombre ?? "",
      precio: Number(item.precio) ?? 0,
      atributo: item.atributo ?? "",
      imagenUrl: item.imagenUrl ?? "",
    });
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setSelected(null);
    setForm(emptyForm);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const onChangeFile = async (file: File | null) => {
    if (!file) {
      setForm((prev) => ({ ...prev, imagenUrl: "" }));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-s3", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      imagenUrl: data.url,
    }));
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    await updateAccessory(selected.id, form);
  };

  return (
    <>
      <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="font-medium text-dark">Lista de accesorios</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-1">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Descripción</th>
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
                    No hay accesorios registrados
                  </td>
                </tr>
              ) : (
                accessories.map((item) => (
                  <tr key={item.id} className="border-t border-gray-3">
                    <td className="px-6 py-4">{item.nombre}</td>
                    <td className="px-6 py-4">{item.atributo || "-"}</td>
                    <td className="px-6 py-4">
                      S/ {Number(item.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {item.imagenUrl ? (
                        <img
                          src={item.imagenUrl}
                          alt={item.nombre}
                          className="h-14 w-14 rounded-lg object-cover border border-gray-3"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="rounded-md bg-gray-1 px-3 py-2 text-sm font-medium text-dark-2 hover:bg-blue hover:text-white duration-200"
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

      {openEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-30">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeEditModal}
          />

          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Editar accesorio
                </h3>
                <p className="mt-1 text-sm text-dark-5">
                  Modifica nombre, precio o descripción
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-md px-3 py-2 text-sm font-medium bg-gray-1 text-dark-2 hover:bg-gray-2"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={submitEdit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <BaseInput
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  placeholder="Nombre del accesorio"
                  type="string"
                  required
                  onChange={onChange}
                />

                <BaseInput
                  label="Precio"
                  name="precio"
                  type="number"
                  value={form.precio}
                  placeholder="0.00"
                  step="0.01"
                  required
                  onChange={onChange}
                />

                <div className="col-span-1 md:col-span-2">
                  <BaseTarea
                    label="Descripción"
                    name="atributo"
                    value={form.atributo}
                    placeholder="Descripción breve del accesorio"
                    onChange={onChange}
                  />
                </div>
              </div>

              <BaseFile
                label="Imagen"
                name="imagen"
                onChange={onChangeFile}
                currentUrl={form.imagenUrl || undefined}
              />

              <div className="flex justify-end gap-3">
                <BaseButton
                  type="button"
                  variant="cancel"
                  fullWidth={false}
                  onClick={closeEditModal}
                  className="min-w-[120px]"
                >
                  Cancelar
                </BaseButton>

                <BaseButton
                  type="submit"
                  loading={updating}
                  fullWidth={false}
                  className="min-w-[160px]"
                >
                  Guardar cambios
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <LoadingModal isOpen={updating} />
      <StatusModal
        isOpen={openStatusModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenStatusModal(false)}
      />
    </>
  );
}