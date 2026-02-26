"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useLenteStock, useLenses } from "@/hooks/products";
import { useSearchParams } from "next/navigation";
import { DetailModal } from "./DetailModal";

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
  const sedeId = 1;

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
    id: number;
    sph: number | string;
    cyl: number;
    stock: number;
  }>(null);

  if (!lenteId || !sedeId)
    return (
      <div className="p-10 text-center font-bold">Falta Lente ID o Sede ID</div>
    );
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        Cargando stock de matriz...
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-red">Error: {error}</div>;
  if (!stock)
    return (
      <div className="p-10 text-center text-gray-5">
        No hay stock disponible
      </div>
    );

  const activeMatrix = stock[matrixType];
  const esfValues =
    matrixType === "NEGATIVO" ? esfValuesNegativo : esfValuesPositivo;

  const handleSave = async () => {
    if (Object.keys(changes).length === 0)
      return alert("No hay cambios que guardar");
    const payload = Object.entries(changes).map(([id, val]) => ({
      id: Number(id),
      cantidad: Number(val || 0),
    }));
    try {
      await updateStock(payload);
      alert("¡Stock actualizado correctamente!");
      setChanges({});
    } catch (err) {
      alert("Hubo un error al guardar los cambios");
    }
  };

  return (
    <>
      <Breadcrumb title="Matriz de Stock" pages={["Matriz"]} />
      <section className="overflow-hidden relative pb-20 pt-2 lg:pt-6 xl:pt-8 bg-[#f3f4f6]">
        <div className="mx-auto max-w-[1400px] px-4 pt-5 space-y-4 ">
          {/* Selectores */}
          <div className="flex gap-2 justify-center">
            {["NEGATIVO", "POSITIVO"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setMatrixType(type as any);
                  setSelected(null);
                }}
                className={`rounded-full border px-6 py-2 text-xs font-bold transition-all ${
                  matrixType === type
                    ? "bg-blue text-white border-blue shadow-md"
                    : "bg-white text-dark hover:bg-gray-1"
                }`}
              >
                {type === "NEGATIVO" ? "NEGATIVOS" : "POSITIVOS"}
              </button>
            ))}
          </div>

          {/* Tabla Contenedor */}
          <div className="rounded-xl bg-white overflow-hidden ring-8 ring-blue-light ring-opacity-30">
            <div className="w-full overflow-x-auto rounded-lg">
              <table className="matrix-table">
                <thead>
                  <tr className="bg-gray-2 text-dark font-black">
                    <th className="sticky left-0 top-0 z-[50] bg-gray-3 border-r-2 text-[9px] w-[65px]">
                      ESF \\ CYL
                    </th>
                    {cylValues.map((cyl, i) => (
                      <th
                        key={i}
                        className={`min-w-[45px] transition-colors ${hoveredCol === i ? "bg-blue text-white" : ""}`}
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
                      <tr key={rowIndex} className="group">
                        {/* Índice SPH (Lateral) - Se ilumina vía CSS (first-child) */}
                        <td className="sticky left-0 z-30 bg-white font-bold text-dark border-r-2 transition-colors">
                          {typeof esf === "number" ? esf.toFixed(2) : esf}
                        </td>

                        {row.map((cell, colIndex) => {
                          const val =
                            changes[cell.id] ?? cell.cantidad.toString();
                          const isSelected = selected?.id === cell.id;

                          return (
                            <td
                              key={colIndex}
                              onMouseEnter={() => setHoveredCol(colIndex)}
                              onMouseLeave={() => setHoveredCol(null)}
                              onClick={() => {
                                if (renderizarModal === "stock") {
                                  setSelected({
                                    id: cell.id,
                                    sph:
                                      typeof esf === "number"
                                        ? esf.toFixed(2)
                                        : esf,
                                    cyl: cylValues[colIndex],
                                    stock: Number(val),
                                  });
                                }
                              }}
                              className={`transition-colors ${
                                hoveredCol === colIndex
                                  ? "matrix-col-active"
                                  : ""
                              } ${isSelected ? "matrix-cell-selected" : ""} ${
                                /* Cambiamos el color aquí: Rojo más vivo para el 0 */
                                !isSelected && Number(val) === 0
                                  ? "text-red-vino"
                                  : "text-dark"
                              }`}
                            >
                              <div className="w-full h-full flex items-center justify-center">
                                {renderizarModal === "stock" ? (
                                  val
                                ) : (
                                  <input
                                    type="number"
                                    value={val}
                                    className="matrix-input"
                                    onChange={(e) =>
                                      setChanges((p) => ({
                                        ...p,
                                        [cell.id]: e.target.value,
                                      }))
                                    }
                                  />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {renderizarModal !== "stock" && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue px-8 py-2 text-sm text-white font-bold hover:bg-opacity-90 transition-all shadow-lg"
            >
              Guardar Matriz
            </button>
          </div>
        )}
        {/* Modal de Detalle con campo Precio */}
        {renderizarModal === "stock" && selected && (
          <DetailModal selected={selected} onClose={() => setSelected(null)} />
        )}{" "}
      </section>
    </>
  );
}
