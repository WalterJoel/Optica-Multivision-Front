"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useLenteStock, useLenses } from "@/hooks/products";
import { useSearchParams } from "next/navigation";

// ... (cylValues, esfValuesNegativo, esfValuesPositivo se mantienen igual)
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
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
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
    if (Object.keys(changes).length === 0) return alert("No hay cambios");
    const payload = Object.entries(changes).map(([id, val]) => ({
      id: Number(id),
      cantidad: Number(val || 0),
    }));
    try {
      await updateStock(payload);
      alert("Cambios guardados");
      setChanges({});
    } catch (err) {
      alert("Error al guardar");
    }
  };

  return (
    <>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .matrix-table {
          border-collapse: separate;
          border-spacing: 0;
        }

        /* Resaltado de FILA (SPH) */
        .matrix-table tr:hover td:first-child {
          background-color: #2563eb !important;
          color: white !important;
          z-index: 60;
        }

        /* Resaltado de COLUMNA (CYL) */
        /* Usamos una clase que aplicaremos directamente via JS para evitar fallos de selectores complejos */
        .highlight-header {
          background-color: #2563eb !important;
          color: white !important;
          z-index: 60;
        }

        /* Rastro visual opcional para celdas */
        .matrix-table tr:hover td {
          background-color: rgba(59, 130, 246, 0.05);
        }
        .matrix-table td:hover {
          background-color: rgba(59, 130, 246, 0.2) !important;
        }
      `}</style>

      <Breadcrumb title="Matrix" pages={["Matrix"]} />

      <div className="mx-auto max-w-[1400px] space-y-4 px-4 pb-4">
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setMatrixType("NEGATIVO")}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${matrixType === "NEGATIVO" ? "bg-blue text-white" : "bg-white hover:bg-blue/10"}`}
          >
            Negativos
          </button>
          <button
            onClick={() => setMatrixType("POSITIVO")}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${matrixType === "POSITIVO" ? "bg-blue text-white" : "bg-white hover:bg-blue/10"}`}
          >
            Positivos
          </button>
        </div>

        <div
          className="rounded-xl bg-white p-4 shadow-1 border border-stroke overflow-hidden flex flex-col"
          style={{ maxHeight: "75vh" }}
        >
          <h2 className="mb-3 text-lg font-semibold text-dark italic">
            Disponibilidad por Medida
          </h2>

          <div className="w-full overflow-auto hide-scrollbar border-t">
            <table className="matrix-table w-full table-auto text-[11px]">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-[70] border bg-gray-100 px-3 py-2 text-left font-bold min-w-[70px]">
                    SPH \ CYL
                  </th>
                  {cylValues.map((cyl, i) => (
                    <th
                      key={cyl}
                      className={`sticky top-0 border bg-gray-100 px-2 py-2 text-center font-bold min-w-[40px] transition-colors z-50 
                        ${hoveredCol === i ? "highlight-header" : ""}`}
                    >
                      {cyl.toFixed(2)}
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
                      <td className="sticky left-0 z-30 border bg-white px-3 py-1.5 font-bold border-r-2 text-center transition-colors">
                        {typeof esf === "number" ? esf.toFixed(2) : esf}
                      </td>

                      {row.map((cell, colIndex) => {
                        const val =
                          changes[cell.id] ?? cell.cantidad.toString();
                        const nVal = Number(val);
                        return (
                          <td
                            key={colIndex}
                            onMouseEnter={() => setHoveredCol(colIndex)}
                            onMouseLeave={() => setHoveredCol(null)}
                            className={`border px-1 py-1.5 text-center font-bold transition-colors cursor-pointer ${nVal === 0 ? "bg-red/10 text-red" : "bg-green/10 text-green"}`}
                            onClick={() => {
                              if (renderizarModal === "stock") {
                                setSelected({
                                  sph:
                                    typeof esf === "number"
                                      ? esf.toFixed(2)
                                      : esf,
                                  cyl: cylValues[colIndex],
                                  stock: nVal,
                                });
                              }
                            }}
                          >
                            {renderizarModal === "stock" ? (
                              nVal
                            ) : (
                              <input
                                type="number"
                                min={0}
                                value={val}
                                className="w-full text-center bg-transparent focus:outline-none appearance-none cursor-pointer"
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

          {renderizarModal !== "stock" && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-lg bg-blue px-6 py-2 text-white font-bold hover:bg-blue-600 shadow-md"
              >
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALES INTACTOS (Igual a tu código original) */}
      {renderizarModal === "stock" && selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2 p-6 relative">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold text-dark italic">
                Detalle del Producto
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-2xl hover:text-dark"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Marca</span>
                <span className="font-medium text-dark italic">Poly AR</span>
              </div>
              <div className="flex justify-between">
                <span>Medida</span>
                <span className="font-bold text-dark">
                  SPH {selected.sph} / CYL {selected.cyl.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Stock</span>
                <span
                  className={`font-bold ${selected.stock > 0 ? "text-green" : "text-red"}`}
                >
                  {selected.stock} unidades
                </span>
              </div>
              <div className="rounded-lg bg-gray-1 p-3">
                <p className="mb-2 font-medium text-dark uppercase text-[10px]">
                  Stock otras sedes
                </p>
                <ul className="space-y-1 text-gray-4 text-[11px]">
                  <li>📍 Lima Centro: 4</li>
                  <li>📍 San Isidro: 2</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-gray-3 px-4 py-2 text-sm"
              >
                Cerrar
              </button>
              <button className="rounded-lg bg-blue px-4 py-2 text-sm text-white font-bold">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
