"use client";

import React, { useState } from "react";
import { BaseSearchInput } from "@/components/Common/Inputs";
import { useSearchClient } from "@/hooks/clients";
import { ISearchClient } from "@/types/clients";
import { useAppSelector } from "@/redux/store";
import { useSearchDiscountByProducts } from "@/hooks/discounts";
import { BaseButton } from "../Common/Buttons";

const Discount = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const { clients, searchClients, setShowList, showList } = useSearchClient();
  const { discounts, searchDiscounts } = useSearchDiscountByProducts();

  const handleSelectClient = (client: ISearchClient) => {
    setSearchTerm(`${client.nombres} ${client.apellidos}`);
    setSelectedClientId(client.id);
    setShowList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      alert("Por favor selecciona un cliente de la lista");
      return;
    }

    const productosPayload = cartItems.map((item) => ({
      productoId: item.id,
      esLente: item.isLens,
      cyl: item.isLens ? item.cyl : null,
    }));

    await searchDiscounts({
      clienteId: selectedClientId,
      productos: productosPayload,
    });
  };

  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit}
        className="h-full bg-white shadow-1 rounded-[10px] flex flex-col"
      >
        {/* Contenedor único de contenido con padding equilibrado */}
        <div className="p-8 sm:p-10 flex flex-col h-full">
          {/* 1. Buscador arriba con aire */}
          <div className="mb-6">
            <BaseSearchInput
              label="Buscar Cliente"
              value={searchTerm}
              required
              onChange={(val) => {
                setSearchTerm(val);
                searchClients(val);
                if (selectedClientId) setSelectedClientId(null);
              }}
              results={clients}
              showList={showList}
              renderItem={(c: ISearchClient) => (
                <div
                  onMouseDown={() => handleSelectClient(c)}
                  className="w-full flex items-center justify-between gap-4 cursor-pointer p-1"
                >
                  <span className="truncate text-sm font-medium">
                    {c.nombres} {c.apellidos}
                  </span>
                  <span className="text-[10px] font-mono text-blue bg-blue-light/10 px-2 py-0.5 rounded border border-blue/20 shrink-0">
                    DNI: {c.numeroDoc}
                  </span>
                </div>
              )}
            />
          </div>

          {/* 2. Lista de descuentos detectados (espacio dinámico) */}
          {discounts.length > 0 && (
            <div className="mb-8 animate-fade-in">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Descuentos Aplicables
              </h4>
              <ul className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {discounts.map((d) => (
                  <li
                    key={`${d.productoId}-${d.serie ?? "no-serie"}`}
                    className="flex justify-between items-center bg-blue-light-6 border border-blue/10 px-4 py-2.5 rounded-xl"
                  >
                    <span className="text-xs font-semibold text-slate-700">
                      {d.nombreProducto}
                    </span>
                    <span className="text-sm font-bold text-blue">
                      - S/ {d.montoDescuento}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Botón normal (no ancho completo) alineado a la izquierda o centro según prefieras */}
          <div className="mt-auto pt-4">
            <BaseButton type="submit">Buscar</BaseButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Discount;
