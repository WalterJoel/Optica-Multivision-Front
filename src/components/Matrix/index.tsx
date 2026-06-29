"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useLenteStock, useLenses } from "@/hooks/products";
import { useSearchParams } from "next/navigation";
import { DetailModal } from "./DetailModal";
import { ILensStockMatrixItem } from "@/types/products";
import { useSessionUser } from "@/hooks/session";
import { Database } from "lucide-react";

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
  const { sedeId } = useSessionUser(); //Sede automatica
  const lenteId = Number(searchParams.get("lenteId"));
  const mode = searchParams.get("mode");

  const { lenses, updateStock, stockVersion } = useLenses();
  const { stock, loading, error } = useLenteStock(
    lenteId,
    sedeId,
    stockVersion,
  );

  const activeLens = lenses.find((l) => l.id === lenteId);

  const [matrixType, setMatrixType] = useState<"NEGATIVO" | "POSITIVO">(
    "NEGATIVO",
  );
  const [changes, setChanges] = useState<Record<number, string>>({});
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [selected, setSelected] = useState<ILensStockMatrixItem>(null);

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
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <Database size={26} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[5px] bg-yellow-dark" />
                <p className="text-[10px] sm:text-[11px] font-black text-blue-light uppercase tracking-[3px]">
                  Inventario
                </p>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark tracking-tighter uppercase leading-none">
                Matriz de <span className="text-blue-light italic">Stock</span>
              </h1>
            </div>
          </div>

          {/* RIGHT (Selected Lens details) */}
          {activeLens && (
            <div className="bg-white border-2 border-blue-light-4 rounded-2xl px-6 py-4 shadow-md hover:shadow-lg transition-all w-full sm:w-auto min-w-[280px]">
              <span className="block text-[9px] font-black text-blue-light uppercase tracking-[2px] leading-none mb-1.5">Lente Seleccionado</span>
              <h2 className="text-sm font-black text-dark uppercase tracking-tight leading-none">
                {activeLens.marca} <span className="text-blue-light italic">({activeLens.material})</span>
              </h2>
            </div>
          )}
        </header>

        <div className="space-y-4">
          {/* Selectores */}
          <div className="flex gap-2 justify-center">
            {["NEGATIVO", "POSITIVO"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setMatrixType(type as any);
                  setSelected(null);
                }}
                className={`rounded-full border px-6 py-2 text-xs font-bold transition-all ${matrixType === type
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
                                if (mode === "stock") {
                                  setSelected({
                                    id: cell.id,
                                    // esf:
                                    //   typeof esf === "number"
                                    //     ? esf.toFixed(2)
                                    //     : esf,
                                    esf:
                                      typeof esf === "number"
                                        ? Number(esf.toFixed(2))
                                        : Number(esf),
                                    cyl: cylValues[colIndex],
                                    cantidad: Number(val),
                                    productoId: cell.productoId,
                                    nombreProducto: cell.nombreProducto,
                                  });
                                }
                              }}
                              className={`transition-colors ${hoveredCol === colIndex
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
                                {mode === "stock" ? (
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
              </table>
            </div>
          </div>
        </div>
        {mode !== "stock" && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue px-8 py-2 text-sm text-white font-bold hover:bg-opacity-90 transition-all shadow-lg"
            >
              Guardar Matriz
            </button>
          </div>
        )}
        {/* Modal de Detalle con campo Precio */}
        {mode === "stock" && selected && (
          <DetailModal
            selected={selected}
            lenteId={lenteId}
            onClose={() => setSelected(null)}
          />
        )}{" "}
      </div>
    </div>
  );
}
