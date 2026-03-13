"use client";

import { useEffect, useState } from "react";
import { useEyeglasses, useUpdateEyeglass } from "@/hooks/products/eyeglasses";
import { IEyeglass } from "@/types/products";
import { BaseInput, BaseFile } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

const emptyForm = {
  marca: "",
  material: "",
  precio: 0,
  medida: "",
  color: "",
  formaFacial: "",
  sexo: "",
  imagenUrl: "",
};

export default function ListEyeglasses() {
  const { eyeglasses, loading, getAllEyeglassesData } = useEyeglasses();
  const {
    updateEyeglass,
    loading: updating,
    statusMessage,
    success,
  } = useUpdateEyeglass();

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IEyeglass | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [typeModal, setTypeModal] = useState<string>("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  useEffect(() => {
    getAllEyeglassesData();
  }, []);

  useEffect(() => {
    if (!updating && statusMessage) {
      setTypeModal(success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL);
      setOpenStatusModal(true);

      if (success) {
        setOpenEdit(false);
        getAllEyeglassesData();
      }
    }
  }, [updating, success, statusMessage]);

  const openEditModal = (item: IEyeglass) => {
    setSelected(item);
    setForm({
      marca: item.marca ?? "",
      material: item.material ?? "",
      precio: Number(item.precio) ?? 0,
      medida: item.medida ?? "",
      color: item.color ?? "",
      formaFacial: item.formaFacial ?? "",
      sexo: item.sexo ?? "",
      imagenUrl: item.imagenUrl ?? "",
    });
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setSelected(null);
    setForm(emptyForm);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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

    await updateEyeglass(selected.id, form);
  };

  return (
    <>
      <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="font-medium text-dark">Lista de monturas</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-1">
              <tr>
                <th className="px-6 py-3">Marca</th>
                <th className="px-6 py-3">Material</th>
                <th className="px-6 py-3">Medida</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Forma Facial</th>
                <th className="px-6 py-3">Sexo</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3 text-right">Acción</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-6">
                    Cargando...
                  </td>
                </tr>
              ) : eyeglasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-6">
                    No hay monturas registradas
                  </td>
                </tr>
              ) : (
                eyeglasses.map((item) => (
                  <tr key={item.id} className="border-t border-gray-3">
                    <td className="px-6 py-4">{item.marca}</td>
                    <td className="px-6 py-4">{item.material}</td>
                    <td className="px-6 py-4">{item.medida}</td>
                    <td className="px-6 py-4">{item.color}</td>
                    <td className="px-6 py-4">{item.formaFacial}</td>
                    <td className="px-6 py-4">{item.sexo}</td>
                    <td className="px-6 py-4">
                      S/ {Number(item.precio).toFixed(2)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-35">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeEditModal}
          />

          <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Editar montura
                </h3>
                <p className="mt-1 text-sm text-dark-5">
                  Modifica los datos de la montura
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
                  label="Marca"
                  name="marca"
                  value={form.marca}
                  placeholder="Marca"
                  type="string"
                  required
                  onChange={onChange}
                />

                <BaseInput
                  label="Material"
                  name="material"
                  value={form.material}
                  placeholder="Material"
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

                <BaseInput
                  label="Medida"
                  name="medida"
                  value={form.medida}
                  placeholder="Ej. 54-18-145"
                  type="string"
                  required
                  onChange={onChange}
                />

                <BaseInput
                  label="Color"
                  name="color"
                  value={form.color}
                  placeholder="Color"
                  type="string"
                  required
                  onChange={onChange}
                />

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Forma Facial
                  </label>
                  <select
                    name="formaFacial"
                    value={form.formaFacial}
                    onChange={onChangeSelect}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="OVALADO">Ovalado</option>
                    <option value="CUADRADO">Cuadrado</option>
                    <option value="REDONDO">Redondo</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Sexo
                  </label>
                  <select
                    name="sexo"
                    value={form.sexo}
                    onChange={onChangeSelect}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
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