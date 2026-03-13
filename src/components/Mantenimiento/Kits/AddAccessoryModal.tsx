"use client";

import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { useSearchAccesory } from "@/hooks/products/accesories";
import { BaseSearchInput } from "@/components/Common/Inputs";
import { IResponseKitAccesory, IKitAccesory } from "@/types/kits";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newAccesory: IKitAccesory;
  setNewAccesory: React.Dispatch<React.SetStateAction<IKitAccesory>>;
  onAdd: () => void;
}

export function AddAccessoryModal({
  isOpen,
  onClose,
  newAccesory,
  setNewAccesory,
  onAdd,
}: Props) {
  const { accesories, showList, searchAccesories, setShowList } =
    useSearchAccesory();

  if (!isOpen) return null;

  const handleSelectAccessory = (acc: IResponseKitAccesory) => {
    setNewAccesory((prev) => ({
      ...prev,
      id: acc.id,
      productoId: acc.productoId,
      nombre: acc.nombre,
      precio: acc.precio,
    }));

    setShowList(false);
  };

  const handleAdd = () => {
    if (!newAccesory.productoId) {
      alert("Debes seleccionar un accesorio válido");
      return;
    }

    onAdd();
  };

  return (
    <ModalFrameWrapper variant="blue" size="sm">
      <div className="flex flex-col gap-4">
        <BaseSearchInput
          label="Buscar accesorio"
          value={newAccesory.nombre}
          required
          onChange={(val) => {
            setNewAccesory((prev) => ({
              ...prev,
              nombre: val,
              productoId: 0,
            }));

            searchAccesories(val);
          }}
          results={accesories}
          showList={showList}
          renderItem={(acc: IResponseKitAccesory) => (
            <div
              onMouseDown={() => handleSelectAccessory(acc)}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <span className="truncate">{acc.nombre}</span>

              <span className="text-[11px] font-mono text-blue-dark bg-blue-light/10 px-2 py-0.5 rounded border border-blue-dark/20 shrink-0">
                ID: {acc.productoId}
              </span>
            </div>
          )}
        />

        <BaseInput
          label="Cantidad"
          type="number"
          name="cantidad"
          value={newAccesory.cantidad}
          onChange={(e) =>
            setNewAccesory((prev) => ({
              ...prev,
              cantidad: Number(e.target.value),
            }))
          }
        />

        <div className="flex justify-end gap-3 mt-6">
          <BaseButton type="button" variant="cancel" onClick={onClose}>
            Cancelar
          </BaseButton>

          <BaseButton type="button" onClick={handleAdd}>
            Agregar
          </BaseButton>
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
