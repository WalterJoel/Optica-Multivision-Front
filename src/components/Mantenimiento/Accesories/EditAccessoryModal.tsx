"use client";

import { useEffect, useState } from "react";
import { BaseInput, BaseFile, BaseSelect } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { IAccessory, IUpdateAccessory } from "@/types/products";
import { ModalFrameWrapper, StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL, ClasificacionAccesorios } from "@/commons/constants";
import { useUpdateAccessory } from "@/hooks/products/accesories/useUpdateAccesory";
import { Package, X } from "lucide-react";

const emptyForm: IUpdateAccessory = {
  nombre: "",
  codigoAccesorio: "",
  precioCompra: "" as unknown as number,
  precioVenta: "" as unknown as number,
  cantidad: "" as unknown as number,
  color: "",
  ubicacion: "",
  clasificacion: "" as unknown as ClasificacionAccesorios,
  imagenUrl: "",
};

export default function EditAccessoryModal({
  isOpen,
  accessory,
  onClose,
  onRefresh,
}: {
  isOpen: boolean;
  accessory: IAccessory | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState<IUpdateAccessory>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerUpload, setTriggerUpload] = useState(false);
  const { updateAccessory, loading, success, statusMessage } = useUpdateAccessory();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  //Select Clasificacion
  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onChangeFile = (file: File | null) => {
    setSelectedFile(file);
  };

  const submitEditForm = async (imageUrl: string) => {
    if (!accessory) return;
    await updateAccessory(accessory.id, {
      ...form,
      precioCompra: Number(form.precioCompra) || 0,
      precioVenta: Number(form.precioVenta) || 0,
      cantidad: Number(form.cantidad) || 0,
      productoId: accessory.productoId || accessory.producto?.id,
      imagenUrl: imageUrl,
    });
  };

  const edit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessory) return;

    if (selectedFile) {
      setTriggerUpload(true);
    } else {
      await submitEditForm(form.imagenUrl || "");
    }
  };

  useEffect(() => {
    if (accessory) {
      setForm({
        nombre: accessory.nombre ?? "",
        codigoAccesorio: accessory.codigoAccesorio ?? "",
        precioCompra: (accessory.precioCompra ?? "") as unknown as number,
        precioVenta: (accessory.precioVenta ?? "") as unknown as number,
        color: accessory.color ?? "",
        cantidad: (accessory.producto?.cantidad ?? accessory.cantidad ?? "") as unknown as number,
        ubicacion: accessory.producto?.ubicacion ?? accessory.ubicacion ?? "",
        clasificacion: accessory.clasificacion ?? "" as unknown as ClasificacionAccesorios,
        imagenUrl: accessory.imagenUrl ?? "",
      });
      setSelectedFile(null);
      setTriggerUpload(false);
    }
  }, [accessory]);

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      setTypeModal(
        success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL
      );
      setStatusMsg(statusMessage);
      setOpenStatusModal(true);
    }
  }, [loading, success, statusMessage]);

  const handleCloseStatus = () => {
    setOpenStatusModal(false);
    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      onRefresh();
      onClose();
    }
  };

  if (!isOpen || !accessory) return null;

  return (
    <>
      <ModalFrameWrapper size="lg">
        <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                <Package size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                  Editar Accesorio
                </h3>
                <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                  Código: {accessory.codigoAccesorio} • {accessory.nombre}
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
            {/* Sección 1: Información del Accesorio */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Detalles del Producto
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
                  label="Código Accesorio"
                  name="codigoAccesorio"
                  value={form.codigoAccesorio ?? ""}
                  onChange={onChange}
                  required
                />

                <BaseInput
                  label="Color"
                  name="color"
                  value={form.color ?? ""}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Sección 2: Precios e Inventario */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Precios e Inventario
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  label="Stock / Cantidad"
                  name="cantidad"
                  value={form.cantidad}
                  placeholder="Stock"
                  pattern="^[0-9]+$"
                  title="Solo se permiten números enteros (ej. 10)"
                  required
                  onChange={onChange}
                />

                <BaseInput
                  label="Ubicación"
                  name="ubicacion"
                  value={form.ubicacion ?? ""}
                  onChange={onChange}
                />

                <BaseSelect
                  label="Clasificación"
                  name="clasificacion"
                  value={form.clasificacion ?? ""}
                  onChange={onChangeSelect}
                  required
                  options={[
                    { label: "Seleccionar", value: "" },
                    ...Object.values(ClasificacionAccesorios).map((val) => ({
                      label: val,
                      value: val,
                    })),
                  ]}
                />
              </div>
            </div>

            {/* Sección 3: Multimedia */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Multimedia
                </h4>
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
                  await submitEditForm(url);
                }}
                onUploadError={() => setTriggerUpload(false)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <BaseButton
                type="button"
                onClick={onClose}
                variant="cancel"
                fullWidth={false}
                className="px-6"
                disabled={loading || triggerUpload}
              >
                Cancelar
              </BaseButton>

              <BaseButton
                loading={loading || triggerUpload}
                type="submit"
                fullWidth={false}
                className="px-6"
                disabled={loading || triggerUpload}
              >
                Guardar
              </BaseButton>
            </div>
          </form>
        </div>
      </ModalFrameWrapper>

      <LoadingModal isOpen={loading || triggerUpload} />
      <StatusModal
        isOpen={openStatusModal}
        type={typeModal}
        message={statusMsg}
        onClose={handleCloseStatus}
      />
    </>
  );
}
