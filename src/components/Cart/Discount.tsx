"use client";

import React, { useState } from "react";
import { BaseSearchInput } from "@/components/Common/Inputs";
import { useSearchClient } from "@/hooks/clients";
import { ISearchClient } from "@/types/clients";
import { useAppSelector } from "@/redux/store";
import { useSearchDiscountByProducts } from "@/hooks/discounts";

const Discount = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const { clients, searchClients, setShowList, showList } = useSearchClient();
  const { discounts, searchDiscounts } = useSearchDiscountByProducts();

  // Seleccionar cliente
  const handleSelectClient = (client: ISearchClient) => {
    setSearchTerm(`${client.nombres} ${client.apellidos}`);
    setSelectedClientId(client.id);
    setShowList(false);
  };

  // Obtener la serie para lentes
  const obtenerSeriePorCilindro = (cyl: number | null): number => {
    if (cyl === null) return 1;
    return Math.min(3, Math.ceil(Math.abs(cyl) / 2));
  };

  // Enviar al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      alert("Por favor selecciona un cliente de la lista");
      return;
    }

    // Transformar items del carrito
    const productosPayload = cartItems.map((item) => ({
      // productoId: item.id,
      productoId: 3,
      esLente: item.isLens,
      cyl: item.isLens ? item.cyl : null,
    }));
    console.log(productosPayload, " --- PAYLOAD");
    // Ejecutar hook para buscar descuentos
    await searchDiscounts({
      clienteId: selectedClientId,
      productos: productosPayload,
    });
  };

  return (
    <div className="lg:max-w-[670px] w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-1 rounded-[10px]">
          <div className="border-b border-gray-3 py-5 px-4 sm:px-5.5">
            <h3 className="font-semibold text-black">
              ¿Tienes algún descuento?
            </h3>
          </div>

          <div className="py-8 px-4 sm:px-8.5">
            <div className="flex flex-wrap items-end gap-4 xl:gap-5.5">
              <div className="max-w-[426px] w-full">
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
                      className="w-full flex items-center justify-between gap-4 cursor-pointer"
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
              </div>

              <button
                type="submit"
                className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-full ease-out duration-200 hover:bg-blue-dark h-[46px] items-center"
              >
                Buscar
              </button>
            </div>

            {/* Mostrar descuentos */}
            {discounts.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-dark mb-3">
                  Descuentos aplicables:
                </h4>
                <ul className="space-y-2">
                  {discounts.map((d) => (
                    <li
                      key={`${d.productoId}-${d.serie ?? "no-serie"}`}
                      className="flex justify-between bg-gray-100 px-4 py-2 rounded"
                    >
                      <span>
                        {d.nombreProducto}{" "}
                        {d.esLente ? `(Serie ${d.serie})` : ""}
                      </span>
                      <span className="font-medium">
                        S/. {d.montoDescuento}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Discount;
