"use client";

import React, { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons";
import { BaseSearchInput } from "@/components/Common/Inputs/BaseSearchInput";
import BaseSelectCard from "@/components/Common/Cards/BaseSelectCard";
import { useSearchLens } from "@/hooks/products/lens";
import { ILens } from "@/types/products/lens";
import { useSearchClient } from "@/hooks/clients";
import { useCreateDiscount } from "@/hooks/discounts";
import { ISearchClient } from "@/types/clients";
import { ICreateDiscount, ISeries } from "@/types/discounts";
import { PRODUCTOS, STATUS_MODAL } from "@/commons/constants";
import { LoadingModal, StatusModal } from "@/components/Common/modal";

const emptyForm: ICreateDiscount = {
  clienteId: 0,
  productoId: 0,
  montoDescuento: 0,
  serie: 1, //Default
  tipoProducto: PRODUCTOS.LENTE,
};

const SeriesDescuentos = () => {
  const [form, setForm] = useState<ICreateDiscount>(emptyForm);
  const [searchLensTerm, setSearchLensTerm] = useState("");
  const [searchClientTerm, setSearchClientTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number>(1);
  const [series, setSeries] = useState<ISeries[]>([
    {
      id: 1,
      nombre: "Serie 1",
      precio: 0,
      value: 1,
      descuento: 0,
      icono: "/images/icons/serie1.png",
    },
    {
      id: 2,
      nombre: "Serie 2",
      precio: 0,
      value: 2,
      descuento: 0,
      icono: "/images/icons/serie2.png",
    },
    {
      id: 3,
      nombre: "Serie 3",
      precio: 0,
      value: 3,
      descuento: 0,
      icono: "/images/icons/serie3.png",
    },
  ]);

  const { searchlens, lens, showList, setShowList } = useSearchLens();
  const { addDiscount, loading, statusMessage, success } = useCreateDiscount();
  const {
    searchClients,
    clients,
    showList: showListClient,
    setShowList: setShowListClient,
  } = useSearchClient();

  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleSelectLens = (l: ILens) => {
    setSearchLensTerm(l.marca);
    setShowList(false);
    setForm((prev) => ({ ...prev, productoId: l.productoId }));
    setSeries((prev) =>
      prev.map((s) => ({
        ...s,
        precio: Number(l[`precio_serie${s.id}` as keyof ILens]) || 0,
      })),
    );
  };

  const handleSelectClient = (c: ISearchClient) => {
    setSearchClientTerm(`${c.nombres} ${c.apellidos}`);
    setShowListClient(false);
    setForm((prev) => ({ ...prev, clienteId: c.id }));
  };

  const handleSerieChange = (id: number) => {
    setSelectedId(id);
    const selected = series.find((s) => s.id === id);
    setForm((prev) => ({
      ...prev,
      serie: selected?.value || 1,
      montoDescuento: selected?.descuento || 0,
    }));
  };

  const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const numericValue = val === "" ? 0 : Number(val);

    setSeries((prev) =>
      prev.map((s) =>
        s.id === selectedId ? { ...s, descuento: numericValue } : s,
      ),
    );
    setForm((prev) => ({ ...prev, montoDescuento: numericValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDiscount(form);
  };

  const resetAll = () => {
    setForm(emptyForm);
    setSearchLensTerm("");
    setSearchClientTerm("");
    setSelectedId(1);
    setSeries((prev) => prev.map((s) => ({ ...s, precio: 0, descuento: 0 })));
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
            label="Buscar Lente"
            value={searchLensTerm}
            required
            onChange={(val) => {
              setSearchLensTerm(val);
              searchlens(val);
            }}
            results={lens}
            showList={showList}
            renderItem={(l: ILens) => (
              <div onMouseDown={() => handleSelectLens(l)} className="w-full">
                {l.marca}
              </div>
            )}
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-500">
            Seleccione la Serie
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {series.map((s) => (
              <BaseSelectCard
                key={s.id}
                id={s.id}
                title={s.nombre}
                price={s.precio}
                icon={s.icono}
                selected={selectedId === s.id}
                onSelect={handleSerieChange}
              />
            ))}
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
          <BaseButton type="submit" disabled={loading}>
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

export default SeriesDescuentos;
