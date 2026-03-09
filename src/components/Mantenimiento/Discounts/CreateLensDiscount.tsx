"use client";

import React, { useState } from "react";
import { BaseInput } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons";
import BaseSearchInput from "@/components/Common/Inputs/BaseSearchInput";
import BaseSelectCard from "@/components/Common/Cards/BaseSelectCard";
import { useSearchLens } from "@/hooks/products/lens";
import { ILens } from "@/types/products/lens";
import { useSearchClient } from "@/hooks/clients";
import { ISearchClient } from "@/types/clients";

interface Series {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
  icono: string;
}

const SeriesDescuentos = () => {
  const [series, setSeries] = useState<Series[]>([
    {
      id: 1,
      nombre: "Serie 1",
      precio: 0,
      descuento: 0,
      icono: "/images/icons/serie1.png",
    },
    {
      id: 2,
      nombre: "Serie 2",
      precio: 0,
      descuento: 0,
      icono: "/images/icons/serie2.png",
    },
    {
      id: 3,
      nombre: "Serie 3",
      precio: 0,
      descuento: 0,
      icono: "/images/icons/serie3.png",
    },
  ]);

  const [selectedId, setSelectedId] = useState<number>(1);

  const [searchLensTerm, setSearchLensTerm] = useState("");
  const [selectedLens, setSelectedLens] = useState<ILens | null>(null);

  const [searchClientTerm, setSearchClientTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<ISearchClient | null>(
    null,
  );

  const { searchlens, lens, showList, setShowList } = useSearchLens();
  const {
    searchClients,
    clients,
    showList: showListClient,
    setShowList: setShowListClient,
  } = useSearchClient();

  const handleSelectLens = (l: ILens) => {
    setSelectedLens(l);
    setSearchLensTerm(l.marca);
    setShowList(false);

    setSeries((prev) =>
      prev.map((s) => ({
        ...s,
        precio: Number(l[`precio_serie${s.id}` as keyof ILens]) || 0,
      })),
    );
  };

  const handleSelectClient = (c: ISearchClient) => {
    setSelectedClient(c);
    setSearchClientTerm(`${c.nombres} ${c.apellidos}`);
    setShowListClient(false);
  };

  const handleDescuentoChange = (valor: number) => {
    setSeries((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, descuento: valor } : s)),
    );
  };

  const selectedSerie = series.find((s) => s.id === selectedId)!;

  return (
    <form className="flex flex-col gap-8 p-6 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <BaseSearchInput
          label="Buscar Cliente"
          name="clientSearch"
          value={searchClientTerm}
          onChange={(val) => {
            setSearchClientTerm(val);
            searchClients(val);
          }}
          placeholder="Buscar por DNI, nombre o apellido"
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
              <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 shrink-0">
                DNI: {c.numeroDoc}
              </span>
            </div>
          )}
        />

        <BaseSearchInput
          label="Buscar Lente"
          name="lensSearch"
          value={searchLensTerm}
          onChange={(val) => {
            setSearchLensTerm(val);
            searchlens(val);
          }}
          placeholder="Buscar por nombre, marca o material"
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
        <label className="text-sm font-medium text-gray-600">
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
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xs">
          <BaseInput
            label="Monto de Descuento"
            type="number"
            value={selectedSerie.descuento}
            onChange={(e) => handleDescuentoChange(Number(e.target.value))}
          />
        </div>
      </div>

      {/* DETALLE DE SELECCIÓN */}
      {(selectedLens || selectedClient) && (
        <div className="bg-blue-light-5 p-4 rounded-2xl border border-blue-light-4 flex flex-col gap-2 shadow-sm shadow-blue/5">
          {selectedClient && (
            <p className="text-sm text-blue-dark flex justify-between items-center">
              <span>
                👤 Cliente:{" "}
                <span className="font-bold">
                  {selectedClient.nombres} {selectedClient.apellidos}
                </span>
              </span>
              <span className="text-[10px] bg-blue-light/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-tighter">
                DNI: {selectedClient.numeroDoc}
              </span>
            </p>
          )}

          {selectedLens && (
            <p className="text-sm text-blue-dark">
              👓 Lente: <span className="font-bold">{selectedLens.marca}</span>
              {selectedLens.material && (
                <span className="text-blue-dark/60 italic">
                  {" "}
                  — {selectedLens.material}
                </span>
              )}
            </p>
          )}

          <div className="h-px bg-blue-light-4 my-1" />

          <div className="flex items-center gap-4 text-sm text-blue-dark">
            <p>
              📦 Serie:{" "}
              <span className="font-bold">{selectedSerie.nombre}</span>
            </p>
            <p>
              💰 Descuento:{" "}
              <span className="font-bold text-blue">
                S/ {selectedSerie.descuento || 0}
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <BaseButton type="submit" className="min-w-[240px]">
          Crear descuento
        </BaseButton>
      </div>
    </form>
  );
};

export default SeriesDescuentos;
