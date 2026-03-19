"use client";

import React, { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons";
import { BaseSearchInput } from "@/components/Common/Inputs/BaseSearchInput";
import { useSearchClient } from "@/hooks/clients";
import { useCreateDiscount } from "@/hooks/discounts";
import { ISearchClient } from "@/types/clients";
import { ICreateDiscount } from "@/types/discounts";
import { PRODUCTOS, STATUS_MODAL } from "@/commons/constants";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { useSearchAccesory } from "@/hooks/products/accesories";
import { ISearchAccesory } from "@/types/products/accessory";

const emptyForm: ICreateDiscount = {
  clienteId: 0,
  productoId: 0,
  montoDescuento: 0,
  tipoProducto: PRODUCTOS.ACCESORIO,
};

const CreateAccessoryDiscount = () => {
  const [form, setForm] = useState<ICreateDiscount>(emptyForm);
  const [searchAccessoryTerm, setSearchAccessoryTerm] = useState("");
  const [searchClientTerm, setSearchClientTerm] = useState("");
  const [selectedAccessoryPrice, setSelectedAccessoryPrice] = useState(0);

  const { accesories, searchAccesories, showList, setShowList } =
    useSearchAccesory();

  const { addDiscount, loading, statusMessage, success } = useCreateDiscount();

  const {
    searchClients,
    clients,
    showList: showListClient,
    setShowList: setShowListClient,
  } = useSearchClient();

  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleSelectAccessory = (a: ISearchAccesory) => {
    setSearchAccessoryTerm(a.nombre);
    setShowList(false);
    setSelectedAccessoryPrice(Number(a.precio || 0));
    setForm((prev) => ({
      ...prev,
      productoId: a.productoId,
      tipoProducto: PRODUCTOS.ACCESORIO,
    }));
  };

  const handleSelectClient = (c: ISearchClient) => {
    setSearchClientTerm(`${c.nombres} ${c.apellidos}`);
    setShowListClient(false);
    setForm((prev) => ({ ...prev, clienteId: c.id }));
  };

  const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const numericValue = val === "" ? 0 : Number(val);

    setForm((prev) => ({
      ...prev,
      montoDescuento: numericValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDiscount({
      ...form,
      tipoProducto: PRODUCTOS.ACCESORIO,
    });
  };

  const resetAll = () => {
    setForm(emptyForm);
    setSearchAccessoryTerm("");
    setSearchClientTerm("");
    setSelectedAccessoryPrice(0);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        resetAll();
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 p-6 w-full max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <BaseSearchInput
            label="Buscar Cliente"
            value={searchClientTerm}
            required
            onChange={(val) => {
              setSearchClientTerm(val);
              searchClients(val);
            }}
            results={clients}
            showList={showListClient}
            renderItem={(c: ISearchClient) => (
              <div
                onMouseDown={() => handleSelectClient(c)}
                className="w-full flex items-center justify-between gap-4"
              >
                <span className="truncate">
                  {c.nombres} {c.apellidos}
                </span>
                <span className="text-[11px] font-mono text-blue-dark bg-blue-light/10 px-2 py-0.5 rounded border border-blue-dark/20 shrink-0">
                  DNI: {c.numeroDoc}
                </span>
              </div>
            )}
          />

          <BaseSearchInput
            label="Buscar Accesorio"
            value={searchAccessoryTerm}
            required
            onChange={(val) => {
              setSearchAccessoryTerm(val);
              searchAccesories(val);
            }}
            results={accesories}
            showList={showList}
            renderItem={(a: ISearchAccesory) => (
              <div
                onMouseDown={() => handleSelectAccessory(a)}
                className="w-full flex items-center justify-between gap-4"
              >
                <span className="truncate">{a.nombre}</span>
                <span className="text-[11px] font-mono text-blue-dark bg-blue-light/10 px-2 py-0.5 rounded border border-blue-dark/20 shrink-0">
                  S/ {Number(a.precio).toFixed(2)}
                </span>
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 max-w-xs">
          <label className="text-sm font-medium text-gray-500">
            Precio del accesorio
          </label>
          <div className="rounded-xl border border-gray-3 px-4 py-3 bg-gray-1 text-sm">
            S/ {selectedAccessoryPrice.toFixed(2)}
          </div>
        </div>

        <div className="flex-1 max-w-xs">
          <BaseInput
            label="Monto de Descuento"
            type="number"
            name="montoDescuento"
            required
            value={form.montoDescuento === 0 ? "" : form.montoDescuento}
            placeholder="0"
            onChange={handleDescuentoChange}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <BaseButton
            type="submit"
            disabled={loading || !form.clienteId || !form.productoId}
          >
            Crear descuento
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
};

export default CreateAccessoryDiscount;