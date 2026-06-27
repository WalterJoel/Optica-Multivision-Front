"use client";

import { useState, useEffect } from "react";
import { useCreateLens } from "@/hooks/products";
import { BaseInput, BaseFile } from "@/components/Common/Inputs";
import { PRODUCTOS, STATUS_MODAL, ClasificacionLentes, PrioridadLentes } from "@/commons/constants";
import { CreateLens } from "@/types/products";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import {
  BaseSelect,
  IOptionSelect,
} from "@/components/Common/Inputs/BaseSelect";
import { BaseButton } from "@/components/Common/Buttons";
import { useKits } from "@/hooks/kits";
import { AlertTriangle, Info } from "lucide-react";
import { useSessionUser } from "@/hooks/session";

const initialForm: CreateLens = {
  marca: "",
  material: "",
  precio_serie1: "" as unknown as number,
  precio_serie2: "" as unknown as number,
  precio_serie3: "" as unknown as number,
  kitId: null,
  imagenUrl: null,
  tipo: PRODUCTOS.LENTE,
  clasificacion: "" as unknown as ClasificacionLentes,
  prioridad: null as PrioridadLentes | null,
  sedeId: 0,
};

export default function LensForm() {
  const [form, setForm] = useState<CreateLens>(initialForm);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerUpload, setTriggerUpload] = useState(false);

  // Hooks
  const { sedeId } = useSessionUser();
  const { addLens, success, statusMessage, loading } = useCreateLens();
  const { kits, getAllKits } = useKits();

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitLensForm = async (imageUrl: string) => {
    const payload: CreateLens = {
      ...form,
      precio_serie1: Number(form.precio_serie1) || 0,
      precio_serie2: Number(form.precio_serie2) || 0,
      precio_serie3: Number(form.precio_serie3) || 0,
      imagenUrl: imageUrl || null,
      prioridad: form.prioridad || null,
      sedeId: Number(sedeId),
    };

    await addLens(payload);
  };

  const createLens = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      setTriggerUpload(true);
    } else {
      await submitLensForm(form.imagenUrl || "");
    }
  };

  //Wrapper/Mapper para el BaseSelect
  const kitOptions: IOptionSelect[] = [
    {
      label: "Ninguno",
      value: "",
    },
    ...kits.map((kit) => ({
      label: kit.nombre,
      value: String(kit.id),
    })),
  ];

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        resetForm();
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  useEffect(() => {
    getAllKits();
  }, []);

  return (
    <>
      <form
        onSubmit={createLens}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseInput
            label="Marca"
            name="marca"
            placeholder="Marca del lente"
            value={form.marca}
            required
            onChange={handleChange}
          />
          <BaseInput
            label="Material"
            name="material"
            placeholder="Material del lente"
            value={form.material}
            required
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseInput
            label="Precio Serie 1"
            name="precio_serie1"
            value={form.precio_serie1}
            placeholder="0.00"
            pattern="^[0-9]+(\.[0-9]{1,2})?$"
            title="Solo se permiten hasta 2 decimales (ej. 12.50)"
            required
            onChange={handleChange}
          />
          <BaseInput
            label="Precio Serie 2"
            name="precio_serie2"
            value={form.precio_serie2}
            placeholder="0.00"
            pattern="^[0-9]+(\.[0-9]{1,2})?$"
            title="Solo se permiten hasta 2 decimales (ej. 12.50)"
            required
            onChange={handleChange}
          />
          <BaseInput
            label="Precio Serie 3"
            name="precio_serie3"
            value={form.precio_serie3}
            placeholder="0.00"
            pattern="^[0-9]+(\.[0-9]{1,2})?$"
            title="Solo se permiten hasta 2 decimales (ej. 12.50)"
            required
            onChange={handleChange}
          />
          <BaseSelect
            label="Seleccione un Kit"
            name="kitId"
            value={form.kitId ?? ""}
            options={kitOptions}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                kitId: e.target.value === "" ? null : Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseSelect
            label="Clasificación"
            name="clasificacion"
            value={form.clasificacion}
            required
            options={[
              { label: "Seleccione una clasificación", value: "" },
              ...Object.values(ClasificacionLentes).map((val) => ({
                label: val,
                value: val,
              })),
            ]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                clasificacion: e.target.value as ClasificacionLentes,
              }))
            }
          />
          <BaseSelect
            label="Prioridad de Visualización"
            name="prioridad"
            value={form.prioridad ?? ""}
            options={[
              { label: "Sin prioridad (Orden por defecto)", value: "" },
              ...Object.values(PrioridadLentes)
                .filter((val) => typeof val === "number")
                .map((val) => {
                  const key = PrioridadLentes[val as number];
                  return {
                    label: key.replace("MOSTRAR_", "MOSTRAR ").replace("_", " "),
                    value: val,
                  };
                }),
            ]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                prioridad: e.target.value === "" ? null : (Number(e.target.value) as PrioridadLentes),
              }))
            }
          />
        </div>

        <BaseFile
          label="Imagen"
          name="imagen"
          value={selectedFile}
          onChange={(file) => setSelectedFile(file)}
          currentUrl={form.imagenUrl || undefined}
          triggerUpload={triggerUpload}
          onUploadSuccess={async (url) => {
            setTriggerUpload(false);
            await submitLensForm(url);
          }}
          onUploadError={() => setTriggerUpload(false)}
        />

        {/* ADVERTENCIA SEDE PRECIOS */}
        <div className="mt-6 p-4 rounded-2xl bg-yellow-light-4 border border-yellow-light-2 text-yellow-dark-2 text-xs flex gap-3 items-start shadow-sm text-left w-full">
          <AlertTriangle className="text-yellow-dark shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-bold">Nota importante:</span> Recuerda que al crear lentes, se registrarán estos precios únicamente para la sede actual y para el resto de sedes el precio será cero.
          </div>
        </div>

        {/* INFO KIT */}
        <div className="mt-3 p-4 rounded-2xl bg-blue-light-6 border border-blue-light-5 text-blue text-xs flex gap-3 items-start shadow-sm text-left w-full">
          <Info className="text-blue shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-bold">Información:</span> Puedes cambiar de KIT luego.
          </div>
        </div>

        <div className="flex flex-col items-center mt-6">
          <BaseButton className="min-w-[240px]" type="submit" disabled={loading}>
            Guardar
          </BaseButton>
        </div>
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
