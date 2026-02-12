"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useLenteStock, useLenses } from "@/hooks/products";
import { useSearchParams } from "next/navigation";

const cylValues = [
  0, -0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0, -2.25, -2.5, -2.75,
  -3.0, -3.25, -3.5, -3.75, -4.0, -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75,
  -6.0,
];

const esfValuesNegativo = [
  null,
  -0.25,
  -0.5,
  -0.75,
  -1.0,
  -1.25,
  -1.5,
  -1.75,
  -2.0,
  -2.25,
  -2.5,
  -2.75,
  -3.0,
  -3.25,
  -3.5,
  -3.75,
  -4.0,
  -4.25,
  -4.5,
  -4.75,
  -5.0,
  -5.25,
  -5.5,
  -5.75,
  -6.0,
];

const esfValuesPositivo = [
  0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5,
  3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0,
];

export default function Matrix() {
  const searchParams = useSearchParams();

  const lenteId = Number(searchParams.get("lenteId"));
  const renderizarModal = searchParams.get("type");
  const sedeId = 2;

  const { updateStock, stockVersion } = useLenses();
  const { stock, loading, error } = useLenteStock(
    lenteId,
    sedeId,
    stockVersion,
  );

  const [matrixType, setMatrixType] = useState<"NEGATIVO" | "POSITIVO">(
    "NEGATIVO",
  );
  const [changes, setChanges] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<null | {
    sph: number | string;
    cyl: number;
    stock: number;
  }>(null);

  if (!lenteId || !sedeId) return <div>Pasa Lente y Sede ID</div>;
  if (loading) return <div>Cargando stock...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stock) return <div>No hay stock disponible</div>;

  const activeMatrix = stock[matrixType];
  const esfValues =
    matrixType === "NEGATIVO" ? esfValuesNegativo : esfValuesPositivo;

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      alert("No hay cambios para guardar");
      return;
    }

    const payload = Object.entries(changes).map(([id, cantidadStr]) => ({
      id: Number(id),
      cantidad: Number(cantidadStr || 0),
    }));

    try {
      await updateStock(payload);
      alert("Cambios guardados correctamente");
      setChanges({});
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    }
  };

  return (
    <>
      <Breadcrumb title="Matrix" pages={["Matrix"]} />
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* MATRIX TYPE */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setMatrixType("NEGATIVO")}
            className={`rounded-lg border px-4 py-2 text-sm ${
              matrixType === "NEGATIVO"
                ? "bg-blue text-white"
                : "hover:bg-blue/10"
            }`}
          >
            Negativos
          </button>
          <button
            onClick={() => setMatrixType("POSITIVO")}
            className={`rounded-lg border px-4 py-2 text-sm ${
              matrixType === "POSITIVO"
                ? "bg-blue text-white"
                : "hover:bg-blue/10"
            }`}
          >
            Positivos
          </button>
        </div>

        {/* MATRIX TABLE */}
        <div className="rounded-xl bg-white p-6 shadow-1">
          <h2 className="mb-4 text-lg font-semibold text-dark">
            Disponibilidad por Medida
          </h2>

          <div className="w-full overflow-auto">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-40 border bg-gray-100 px-3 py-2 text-left">
                    SPH \ CYL
                  </th>
                  {cylValues.map((cyl) => (
                    <th
                      key={cyl}
                      className="border bg-gray-100 px-3 py-2 text-center"
                    >
                      {cyl}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {activeMatrix.map((row, rowIndex) => {
                  const esf =
                    esfValues[rowIndex] === null
                      ? "NEUTRO"
                      : esfValues[rowIndex];

                  return (
                    <tr key={rowIndex}>
                      <td className="sticky left-0 z-20 border bg-white px-3 py-2 font-medium">
                        {esf}
                      </td>

                      {row.map((cell, colIndex) => {
                        const cantidadStr =
                          changes[cell.id] ?? cell.cantidad.toString();
                        const cantidadNum = Number(cantidadStr);

                        return (
                          <td
                            key={colIndex}
                            className={`border px-3 py-2 text-center font-medium ${
                              cantidadNum === 0
                                ? "bg-red/20 text-red"
                                : cantidadNum <= 5
                                  ? "bg-yellow/20 text-yellow-700"
                                  : "bg-green/20 text-green"
                            }`}
                            onClick={() => {
                              if (renderizarModal === "stock") {
                                setSelected({
                                  sph: esf,
                                  cyl: cylValues[colIndex],
                                  stock: cantidadNum,
                                });
                              }
                            }}
                          >
                            {renderizarModal === "stock" ? (
                              cantidadNum
                            ) : (
                              <input
                                type="number"
                                min={0}
                                value={cantidadStr}
                                className="w-16 text-center bg-transparent focus:outline-none"
                                onChange={(e) =>
                                  setChanges((prev) => ({
                                    ...prev,
                                    [cell.id]: e.target.value,
                                  }))
                                }
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Botón Guardar */}
          {renderizarModal !== "stock" && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-lg bg-blue px-4 py-2 text-white hover:bg-blue-600"
              >
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {renderizarModal === "stock" && selected && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2 p-6 relative">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold text-dark">
                Detalle del Producto
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-5 hover:text-dark"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-6">Marca</span>
                <span className="font-medium text-dark">Poly AR</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-6">Medida</span>
                <span className="font-medium text-dark">
                  SPH {selected.sph} / CYL {selected.cyl}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-6">Stock disponible</span>
                <span className="font-semibold text-green">
                  {selected.stock} unidades
                </span>
              </div>

              <div className="rounded-lg bg-gray-1 p-3">
                <p className="mb-2 font-medium text-dark">
                  Stock en otras sedes
                </p>
                <ul className="space-y-1 text-gray-6">
                  <li>📍 Lima Centro: 4</li>
                  <li>📍 San Isidro: 2</li>
                  <li>📍 Arequipa: 1</li>
                </ul>
              </div>

              <div className="flex justify-between items-center rounded-lg bg-blue/10 p-3">
                <span className="text-gray-7">Precio</span>
                <span className="text-xl font-bold text-blue">S/ 180.00</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-gray-3 px-4 py-2 text-sm"
              >
                Cerrar
              </button>
              <button className="rounded-lg bg-blue px-4 py-2 text-sm text-white hover:bg-blue-dark">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
