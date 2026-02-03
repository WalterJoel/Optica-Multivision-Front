"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

/* =========================
   TIPOS DE MATERIAL
========================= */
const materials = [
  "Policarbonato",
  "CR-39",
  "Poliestato",
  "Blue Cut",
  "Transitions",
  "AR Premium",
  "Kids",
];

/* =========================
   VALORES CYL
========================= */
const cylValues = [
  -0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0,
  -2.25, -2.5, -2.75, -3.0, -3.25, -3.5, -3.75, -4.0,
  -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75, -6.0,
];

/* =========================
   MATRIX BASE
========================= */
const baseMatrix: Record<string, number[]> = {
  NEUTRO: [10,8,6,10,9,5,1,4,1,1,2,1,1,2,2,3,3,2,2,2,2,2,2,2],
  "-0.25": [9,5,0,5,4,5,5,4,3,1,0,2,2,2,1,2,2,2,2,2,2,2,2,2],
  "-0.50": [8,5,10,5,4,4,5,5,4,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-0.75": [10,5,5,5,5,5,4,3,4,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.00": [7,5,5,5,5,5,5,5,5,2,1,2,2,2,1,2,2,2,2,2,2,2,2,2],
  "-1.25": [5,5,4,5,4,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.50": [5,5,4,5,5,5,5,5,5,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.75": [5,5,4,5,5,5,5,5,5,2,1,1,2,2,1,2,2,2,2,2,2,2,2,2],
  "-2.00": [5,5,5,5,5,5,5,5,5,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2],
  "-2.25": Array(24).fill(2),
  "-2.50": Array(24).fill(2),
  "-2.75": Array(24).fill(2),
  "-3.00": Array(24).fill(2),
  "-3.25": Array(24).fill(2),
  "-3.50": Array(24).fill(2),
  "-3.75": Array(24).fill(2),
  "-4.00": Array(24).fill(2),
  "-4.25": Array(24).fill(2),
  "-4.50": Array(24).fill(2),
  "-4.75": Array(24).fill(2),
  "-5.00": Array(24).fill(2),
  "-5.25": Array(24).fill(2),
  "-5.50": Array(24).fill(2),
  "-5.75": Array(24).fill(2),
  "-6.00": Array(24).fill(2),
};

//   MATRICES POR MATERIAL

const matricesByMaterial: Record<string, Record<string, number[]>> = {
  Policarbonato: baseMatrix,
  "CR-39": {
    NEUTRO: Array(24).fill(5),
    "-0.25": Array(24).fill(3),
    "-0.50": Array(24).fill(2),
  },
  Poliestato: {
    NEUTRO: Array(24).fill(8),
    "-0.25": Array(24).fill(6),
    "-0.50": Array(24).fill(4),
  },
  "Blue Cut": baseMatrix,
  Transitions: baseMatrix,
  "AR Premium": baseMatrix,
  Kids: baseMatrix,
};

   //COMPONENTE
export default function Matrix() {
  const [material, setMaterial] = useState("Policarbonato");
  const [selected, setSelected] = useState<null | {
    sph: string;
    cyl: number;
    stock: number;
  }>(null);

  const activeMatrix = matricesByMaterial[material];

  return (
    <>
      <Breadcrumb title="Matrix" pages={["Matrix"]} />

      <div className="mx-auto max-w-[1200px]">
        <div className="bg-white rounded-xl shadow-1 p-6">
          <h2 className="mb-6 text-xl font-semibold text-dark">
            Disponibilidad por Medida
          </h2>

          {/* BOTONES DE MATERIAL */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {materials.map((item) => (
              <button
                key={item}
                onClick={() => setMaterial(item)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition
                  ${
                    material === item
                      ? "bg-blue text-white border-blue"
                      : "bg-white border-gray-3 hover:bg-blue/10"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-3 bg-gray-1 px-3 py-2 text-left">
                    SPH \ CYL
                  </th>
                  {cylValues.map((cyl) => (
                    <th
                      key={cyl}
                      className="border border-gray-3 bg-gray-1 px-3 py-2 text-center"
                    >
                      {cyl}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Object.entries(activeMatrix).map(([sph, values]) => (
                  <tr key={sph}>
                    <td className="border border-gray-3 px-3 py-2 font-medium">
                      {sph}
                    </td>

                    {values.map((stock, i) => (
                      <td
                        key={i}
                        onClick={() =>
                          setSelected({
                            sph,
                            cyl: cylValues[i],
                            stock,
                          })
                        }
                        className={`border border-gray-3 px-3 py-2 text-center cursor-pointer transition
                          ${
                            stock === 0
                              ? "bg-red/10 text-red opacity-50"
                              : stock <= 2
                              ? "bg-yellow/10 text-yellow-700"
                              : "hover:bg-blue/10"
                          }`}
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

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2 p-6">
            <div className="mb-4 flex justify-between border-b pb-3">
              <h3 className="text-lg font-semibold">Detalle del Producto</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <p><b>Material:</b> {material}</p>
              <p><b>Medida:</b> SPH {selected.sph} / CYL {selected.cyl}</p>
              <p><b>Stock:</b> {selected.stock} unidades</p>
              <p className="text-xl font-bold text-blue">S/ 180.00</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
