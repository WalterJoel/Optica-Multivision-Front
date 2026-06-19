"use client";

import { useState, useEffect } from "react";
import { BaseInput, BaseFile, BaseTarea } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICreateAccessory } from "@/types/products";
import { useCreateAccessory } from "@/hooks/products/accesories/useCreateAccesory";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { useSessionUser } from "@/hooks/session";

const emptyForm: ICreateAccessory = {
  nombre: "",
  precioVenta: "" as unknown as number,
  precioCompra: "" as unknown as number,
  codigoAccesorio: "",
  imagenUrl: "",
  ubicacion: "",
  cantidad: "" as unknown as number,
  color: "",
};

export default function CreateAccessory() {
  const [form, setForm] = useState<ICreateAccessory>(emptyForm);

  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerUpload, setTriggerUpload] = useState(false);

  // Hooks
  const { sedeId } = useSessionUser();
  const { addAccessory, loading, statusMessage, success } =
    useCreateAccessory();

  // Functions
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const onChangeFile = (file: File | null) => {
    setSelectedFile(file);
  };

  const submitAccessoryForm = async (imageUrl: string) => {
    await addAccessory({
      ...form,
      precioCompra: Number(form.precioCompra) || 0,
      precioVenta: Number(form.precioVenta) || 0,
      cantidad: Number(form.cantidad) || 0,
      imagenUrl: imageUrl,
    });
  };

  const createAccessory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      setTriggerUpload(true);
    } else {
      await submitAccessoryForm(form.imagenUrl || "");
    }
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        setForm(emptyForm);
        setSelectedFile(null);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <form
      onSubmit={createAccessory}
      className="w-full rounded-xl border border-gray-3 bg-beige p-6"
    >

      {/* GRID DE INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
          label="Código Accesorio"
          name="codigoAccesorio"
          value={form.codigoAccesorio}
          placeholder="Código de fábrica o interno"
          type="string"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Precio Compra"
          name="precioCompra"
          value={form.precioCompra}
          placeholder="0.00"
          pattern="^[0-9]+(\.[0-9]{1,2})?$"
          title="Solo se permiten hasta 2 decimales (ej. 12.50)"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Precio Venta"
          name="precioVenta"
          value={form.precioVenta}
          placeholder="0.00"
          pattern="^[0-9]+(\.[0-9]{1,2})?$"
          title="Solo se permiten hasta 2 decimales (ej. 12.50)"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Cantidad"
          name="cantidad"
          value={form.cantidad}
          placeholder="Stock"
          pattern="^[0-9]+$"
          title="Solo se permiten números enteros (ej. 10)"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Color"
          name="color"
          value={form.color}
          placeholder="Color del accesorio"
          type="string"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Ubicación"
          name="ubicacion"
          value={form.ubicacion}
          placeholder="Estante / Cajón"
          type="string"
          onChange={onChange}
        />


      </div>

      <BaseFile
        label="Imagen"
        name="imagen"
        value={selectedFile}
        onChange={onChangeFile}
        currentUrl={form.imagenUrl || undefined}
        triggerUpload={triggerUpload}
        onUploadSuccess={async (url) => {
          setTriggerUpload(false);
          await submitAccessoryForm(url);
        }}
        onUploadError={() => setTriggerUpload(false)}
      />

      <div className="flex justify-center mt-6">
        <BaseButton type="submit" loading={loading} className="min-w-[200px]">
          Crear Accesorio
        </BaseButton>
      </div>

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </form>
  );
}
