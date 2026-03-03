"use client";

import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ModalFrameWrapper } from "@/components/Common/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nuevoAccesorio: {
    nombre: string;
    cantidad: number;
  };
  setNuevoAccesorio: React.Dispatch<
    React.SetStateAction<{
      nombre: string;
      cantidad: number;
    }>
  >;
  onAdd: () => void;
}

export function AddAccessoryModal({
  isOpen,
  onClose,
  nuevoAccesorio,
  setNuevoAccesorio,
  onAdd,
}: Props) {
  if (!isOpen) return null;

  return (
    <ModalFrameWrapper variant="blue" size="sm">
      <div className="flex justify-item-center flex-col">
        <BaseInput
          label="Nombre de  l accesorio"
          name="nombre"
          value={nuevoAccesorio.nombre}
          placeholder="Paño de microfibra"
          onChange={(e) =>
            setNuevoAccesorio((p) => ({
              ...p,
              nombre: e.target.value,
            }))
          }
        />

        <BaseInput
          label="Cantidad"
          type="number"
          name="cantidad"
          value={nuevoAccesorio.cantidad}
          onChange={(e) =>
            setNuevoAccesorio((p) => ({
              ...p,
              cantidad: Number(e.target.value),
            }))
          }
        />

        <div className="flex justify-end gap-3 mt-8">
          <BaseButton type="button" variant="cancel" onClick={onClose}>
            Cancelar
          </BaseButton>

          <BaseButton type="button" onClick={onAdd}>
            Agregar
          </BaseButton>
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
