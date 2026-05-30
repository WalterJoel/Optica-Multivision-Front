"use client";

import { useState, useEffect } from "react";
import { BaseInput, BaseFile, BaseSelect } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL, PRODUCTOS } from "@/commons/constants";
import { ICreateEyeglass } from "@/types/products";
import { useCreateEyeglass } from "@/hooks/products/eyeglasses";
import { useSessionUser } from "@/hooks/session";

const emptyForm: ICreateEyeglass = {
  marca: "",
  material: "",
  precioVenta: "" as unknown as number,
  precioCompra: "" as unknown as number,
  codigoMontura: "",
  codigo: "",
  color: "",
  formaFacial: "",
  sexo: "",
  imagenUrl: "",
  talla: "",
  ubicacion: "",
  sedeId: 0,
  cantidad: "" as unknown as number,
};

export default function CreateEyeglass() {

  const [form, setForm] = useState<ICreateEyeglass>(emptyForm);

  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerUpload, setTriggerUpload] = useState(false);

  //Hooks
  const { addEyeglass, loading, statusMessage, success } = useCreateEyeglass();
  const { sedeId } = useSessionUser()

  //Functions
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onChangeFile = (file: File | null) => {
    setSelectedFile(file);
  };

  const submitEyeglassForm = async (imageUrl: string) => {
    await addEyeglass({
      ...form,
      precioCompra: Number(form.precioCompra) || 0,
      precioVenta: Number(form.precioVenta) || 0,
      cantidad: Number(form.cantidad) || 0,
      imagenUrl: imageUrl,
      sedeId,
    });
  };


  const createEyeglass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      setTriggerUpload(true);
    } else {
      await submitEyeglassForm(form.imagenUrl);
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
      onSubmit={createEyeglass}
      className="w-full rounded-xl border border-gray-3 bg-beige p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <BaseInput
          label="Marca"
          name="marca"
          value={form.marca}
          placeholder="Marca de la montura"
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
          label="Codigo"
          name="codigo"
          value={form.codigo}
          placeholder="Ejemplo: 900C"
          type="string"
          required
          onChange={onChange}
        />
        <BaseInput
          label="Codigo Montura"
          name="codigoMontura"
          value={form.codigoMontura}
          placeholder="Ejemplo: PZ8010"
          type="string"
          required
          onChange={onChange}
        />
        <BaseInput
          label="Precio Compra"
          name="precioCompra"
          type="number"
          value={form.precioCompra}
          placeholder="0.00"
          step="0.01"
          required
          onChange={onChange}
        />
        <BaseInput
          label="Precio Venta"
          name="precioVenta"
          type="number"
          value={form.precioVenta}
          placeholder="0.00"
          step="0.01"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Talla"
          name="talla"
          value={form.talla}
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
        <BaseInput
          label="Cantidad"
          name="cantidad"
          value={form.cantidad}
          placeholder="Stock"
          type="number"
          required
          onChange={onChange}
        />
        <BaseInput
          label="Ubicación"
          name="ubicacion"
          value={form.ubicacion}
          placeholder="Ejemplo: Estante 32 ..."
          type="string"

          onChange={onChange}
        />

        <BaseSelect
          label="Forma Facial"
          name="formaFacial"
          value={form.formaFacial}
          onChange={onChangeSelect}
          required
          options={[
            { label: "Seleccionar", value: "" },
            { label: "Ovalado", value: "OVALADO" },
            { label: "Cuadrado", value: "CUADRADO" },
            { label: "Redondo", value: "REDONDO" },
          ]}
        />

        <BaseSelect
          label="Sexo"
          name="sexo"
          value={form.sexo}
          onChange={onChangeSelect}
          required
          options={[
            { label: "Seleccionar", value: "" },
            { label: "Masculino", value: "M" },
            { label: "Femenino", value: "F" },
            { label: "Unisex", value: "UNISEX" },
          ]}
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
          await submitEyeglassForm(url);
        }}
        onUploadError={() => setTriggerUpload(false)}
      />

      <div className="flex justify-center">
        <BaseButton type="submit" loading={loading} className="min-w-[200px]">
          Crear Montura
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
