"use client";

import { useEffect, useState } from "react";
import { BaseInput, BaseFile } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ILens, CreateLens } from "@/types/products";
import { ModalFrameWrapper, StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL, ClasificacionLentes, PrioridadLentes } from "@/commons/constants";
import { useUpdateLens } from "@/hooks/products/lens/useUpdateLens";
import { Eye, X } from "lucide-react";
import { useKits } from "@/hooks/kits";
import { useSessionUser } from "@/hooks/session";
import {
  BaseSelect,
  IOptionSelect,
} from "@/components/Common/Inputs/BaseSelect";

const emptyForm = {
  marca: "",
  material: "",
  precio_serie1: "" as unknown as number,
  precio_serie2: "" as unknown as number,
  precio_serie3: "" as unknown as number,
  kitId: null as number | null,
  imagenUrl: null as string | null,
  clasificacion: "" as unknown as ClasificacionLentes,
  prioridad: null as PrioridadLentes | null,
};

export default function EditLensModal({
  isOpen,
  lens,
  onClose,
  onRefresh,
}: {
  isOpen: boolean;
  lens: ILens | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const { updateLens, loading, success, statusMessage } = useUpdateLens();
  const { kits, getAllKits } = useKits();
  const { sedeId } = useSessionUser();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerUpload, setTriggerUpload] = useState(false);

  // Fetch kits
  useEffect(() => {
    getAllKits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submitLensForm = async (imageUrl: string) => {
    if (!lens) return;
    const payload: Partial<CreateLens> = {
      marca: form.marca,
      material: form.material,
      precio_serie1: Number(form.precio_serie1) || 0,
      precio_serie2: Number(form.precio_serie2) || 0,
      precio_serie3: Number(form.precio_serie3) || 0,
      kitId: form.kitId,
      imagenUrl: imageUrl || form.imagenUrl || null,
      clasificacion: form.clasificacion,
      prioridad: form.prioridad || null,
      sedeId: Number(sedeId),
    };

    await updateLens(lens.id, payload);
  };

  const edit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lens) return;

    if (selectedFile) {
      setTriggerUpload(true);
    } else {
      await submitLensForm(form.imagenUrl || "");
    }
  };

  useEffect(() => {
    if (lens) {
      setForm({
        marca: lens.marca,
        material: lens.material,
        precio_serie1: lens.precio_serie1,
        precio_serie2: lens.precio_serie2,
        precio_serie3: lens.precio_serie3,
        kitId: lens.kitId ?? null,
        imagenUrl: lens.imagenUrl ?? null,
        clasificacion: lens.clasificacion ?? "" as unknown as ClasificacionLentes,
        prioridad: lens.prioridad ?? null,
      });
      setSelectedFile(null);
    }
  }, [lens]);

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
  }, [loading, success, statusMessage]);

  const handleCloseStatus = () => {
    setOpenStatusModal(false);
    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      onClose();
    }
  };

  // Wrapper/Mapper para el BaseSelect
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

  if (!isOpen || !lens) return null;

  return (
    <>
      <ModalFrameWrapper size="lg">
        <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                <Eye size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                  Editar Lente
                </h3>
                <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                  ID Lente: {lens.id} • {lens.marca}
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
                  Información del Lente
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <BaseInput
                  label="Marca"
                  name="marca"
                  value={form.marca ?? ""}
                  onChange={handleChange}
                  required
                />

                <BaseInput
                  label="Material"
                  name="material"
                  value={form.material ?? ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

              <div className="grid grid-cols-1 gap-4">
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
