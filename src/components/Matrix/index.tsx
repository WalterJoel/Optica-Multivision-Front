"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { BaseButton } from "@/components/Common/Buttons";
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
          <ModalFrameWrapper>
            <div className="space-y-4">
              {/* Header con Graduación y Precio */}
              <div className="bg-blue/5 p-4 rounded-xl border border-blue/10 text-center relative overflow-hidden">
                <p className="text-[10px] text-blue font-bold uppercase tracking-widest">
                  Graduación Seleccionada
                </p>
                <p className="text-2xl font-black text-blue">
                  ESF {selected.sph} / CYL {selected.cyl.toFixed(2)}
                </p>
                {/* Campo de Precio Destacado */}
                <div className="mt-2 inline-block px-3 py-1 bg-white rounded-lg border border-blue/20 shadow-sm">
                  <span className="text-xs font-bold text-blue/60 mr-1 text-[10px]">
                    PRECIO:
                  </span>
                  <span className="text-lg font-black text-blue">
                    S/ {selected.price?.toFixed(2) || "10.50"}
                  </span>
                </div>
              </div>

              {/* Stock Sede Actual */}
              <div className="flex justify-between items-center px-2">
                <span className="text-gray-500 font-medium">
                  Stock en Sede Actual:
                </span>
                <span
                  className={`text-xl font-black ${selected.stock > 0 ? "text-green" : "text-red"}`}
                >
                  {selected.stock}{" "}
                  <small className="text-[10px] uppercase font-bold">Und</small>
                </span>
              </div>

              {/* Otras Sedes */}
              <div className="rounded-xl bg-gray-1 p-3 text-[11px] space-y-2 border border-gray-2">
                <p className="font-bold text-gray-6 uppercase text-[9px] opacity-70">
                  Disponibilidad otras sedes
                </p>
                <div className="flex justify-between items-center text-gray-7">
                  <span className="italic">📍 Lima Centro</span>
                  <span className="font-bold bg-gray-2 px-2 py-0.5 rounded text-[10px]">
                    12
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-7">
                  <span className="italic">📍 San Isidro</span>
                  <span className="font-bold bg-gray-2 px-2 py-0.5 rounded text-[10px]">
                    08
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 flex flex-col gap-2">
              <BaseButton disabled={selected.stock <= 0}>
                Agregar al carrito
              </BaseButton>
              <BaseButton variant="cancel" onClick={() => setSelected(null)}>
                Cancelar
              </BaseButton>
            </div>
          </ModalFrameWrapper>
        )}
      </section>
    </>
  );
}
