"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

// CYL VALUES
const cylValues = [
  0,
  -0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0,
  -2.25, -2.5, -2.75, -3.0, -3.25, -3.5, -3.75, -4.0,
  -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75, -6.0,
];

// MATRICES COMPLETAS
const negativeMatrix: Record<string, number[]> = {
  NEUTRO: [10	,8	,6	,10	,9	,5	,1	,4	,1	,1,2	,1	,1	,2	,2	,3,	,3,	,2	,2	,2	,2	,2	,2	,2	,2],
  "-0.25": [9,5,0,5,4,5,5,4,3,1,0,2,2,2,1,2,2,2,2,2,2,2,2,2,2],
  "-0.50": [8,5,10,5,4,4,5,5,4,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-0.75": [10,5,5,5,5,5,4,3,4,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.00": [7,5,5,5,5,5,5,5,5,2,1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,],
  "-1.25": [5,5,4,5,4,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.50": [5,5,4,5,5,5,5,5,5,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.75": [5,5,4,5,5,5,5,5,5,2,1,1,2,2,1,2,2,2,2,2,2,2,2,2,2],
  "-2.00": [5,5,5,5,5,5,5,5,5,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2],
  "-2.25": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-2.50": [3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-2.75": [3,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-3.00": [3,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-3.25": [3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2],
  "-3.50": [3,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-3.75": [3,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-4.00": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-4.25": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-4.50": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-4.75": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-5.00": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-5.25": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-5.50": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-5.75": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-6.00": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
};

const positiveMatrix: Record<string, number[]> = {
  NEUTRO: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "+0.25": [10,5,5,5,3,5,5,5,5,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2],
  "+0.50": [9,5,2,5,5,5,5,4,5,1,1,2,2,2,2,1,2,2,2,2,2,2,2,2,2],
  "+0.75": [10,5,5,5,5,5,5,5,5,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2],
  "+1.00": [10,5,5,4,5,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+1.25": [5,5,5,5,5,5,5,5,5,2,0,2,2,2,2,2,2,2,0,2,2,2,2,2,2],
  "+1.50": [5,5,5,5,5,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+1.75": [5,5,5,5,5,5,5,5,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+2.00": [5,5,5,5,5,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+2.25": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+2.50": [2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+2.75": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+3.00": [3,2,2,1,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+3.25": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+3.50": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+3.75": [3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+4.00": [3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+4.25": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+4.50": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+4.75": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+5.00": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+5.25": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+5.50": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+5.75": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "+6.00": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
};

// MATRICES POR MATERIAL
const matricesByMaterial = {
  Policarbonato: { negative: negativeMatrix, positive: positiveMatrix },
  "CR-39": { negative: negativeMatrix, positive: positiveMatrix },
  Poliestato: { negative: negativeMatrix, positive: positiveMatrix },
  Trivex: { negative: negativeMatrix, positive: positiveMatrix },
  "Alto Índice": { negative: negativeMatrix, positive: positiveMatrix },
  Fotocromático: { negative: negativeMatrix, positive: positiveMatrix },
  BlueCut: { negative: negativeMatrix, positive: positiveMatrix },
};

// COMPONENT
export default function Matrix() {
  const [material, setMaterial] =
    useState<keyof typeof matricesByMaterial>("Policarbonato");

  const [matrixType, setMatrixType] =
    useState<"negative" | "positive">("negative");

  const [selected, setSelected] = useState<null | {
    sph: string;
    cyl: number;
    stock: number;
  }>(null);

  const activeMatrix = matricesByMaterial[material][matrixType];

  return (
    <>
      <Breadcrumb title="Matrix" pages={["Matrix"]} />

      <div className="mx- max-w-[1200px] space-y-6">
{/* ===== MATERIAL BUTTONS ===== */}
<div className="flex justify-center">
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
    {Object.keys(matricesByMaterial).map((item) => (
      <button
        key={item}
        onClick={() => setMaterial(item as any)}
        className={`rounded-xl border px-3 py-2 text-sm font-medium transition
          ${material === item ? "bg-blue text-white" : "bg-white hover:bg-blue/10"}`}
      >
        {item}
      </button>
    ))}
  </div>
</div>


        {/* ===== MATRIX TYPE ===== */}
        <div className="flex gap-3 justify-center ">
          <button
            onClick={() => setMatrixType("negative")}
            className={`rounded-lg border px-4 py-2 text-sm ${
              matrixType === "negative" ? "bg-blue text-white" : "hover:bg-blue/10"
            }`}
          >
            Negativos / Mixta
          </button>
          <button
            onClick={() => setMatrixType("positive")}
            className={`rounded-lg border px-4 py-2 text-sm ${
              matrixType === "positive" ? "bg-blue text-white" : "hover:bg-blue/10"
            }`}
          >
            Solo Positivos
          </button>
        </div>

       {/* ===== MATRIX TABLE ===== */}
<div className="rounded-xl bg-white p-6 shadow-1 ml-15 ">
  <h2 className="mb-4 text-lg font-semibold text-dark">
    Disponibilidad por Medida – {material}
  </h2>

  <div className="w-full">
    <table className="w-full table-auto border-collapse text-sm  ml-0">
      <thead>
        <tr>
          <th className="sticky left-0 z-40 border bg-gray-1 px-3 py-2 text-left">
            SPH \ CYL
          </th>
          {cylValues.map((cyl) => (
            <th key={cyl} className="border bg-gray-1 px-3 py-2 text-center">
              {cyl}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {Object.entries(activeMatrix).map(([sph, values]) => (
          <tr key={sph}>
            <td className="sticky left-0 z-20 border bg-white px-3 py-2 font-medium">
              {sph}
            </td>
            {values.map((stock, i) => (
              <td
                key={i}
                onClick={() => setSelected({ sph, cyl: cylValues[i], stock })}
                className={`border px-3 py-2 text-center cursor-pointer transition font-medium ${
                  stock === 0
                    ? "bg-red/20 text-red"
                    : stock <= 5
                    ? "bg-yellow/20 text-yellow-700"
                    : "bg-green/20 text-green"
                } hover:brightness-95`}
              >
                {stock}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      </div>

      {/* ===== MODAL ===== */}
      {selected && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2">
            <div className="mb-4 flex justify-between border-b pb-3">
              <h3 className="font-semibold text-dark">Detalle del Producto</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Material</span>
                <span className="font-medium">{material}</span>
              </div>
              <div className="flex justify-between">
                <span>SPH</span>
                <span className="font-medium">{selected.sph}</span>
              </div>
              <div className="flex justify-between">
                <span>CYL</span>
                <span className="font-medium">{selected.cyl}</span>
              </div>
              <div className="flex justify-between">
                <span>Stock</span>
                <span className="font-medium">{selected.stock}</span>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg bg-blue px-4 py-2 text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
