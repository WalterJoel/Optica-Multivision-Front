"use client";

import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

const cylValues = [
  -0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0,
  -2.25, -2.5, -2.75, -3.0, -3.25, -3.5, -3.75, -4.0,
  -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75, -6.0,
];

const matrix: Record<string, number[]> = {
  NEUTRO: [10,8,6,10,9,5,1,4,1,1,-2,1,1,2,2,3,3,2,2,2,2,2,2,2],
  "-0.25": [9,5,0,5,4,5,5,4,3,1,0,2,2,2,1,2,2,2,2,2,2,2,2,2],
  "-0.50": [8,5,10,5,4,4,5,5,4,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-0.75": [10,5,5,5,5,5,4,3,4,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.00": [7,5,5,5,5,5,5,5,5,2,1,2,2,2,1,2,2,2,2,2,2,2,2,2],
  "-1.25": [5,5,4,5,4,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.50": [5,5,4,5,5,5,5,5,5,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-1.75": [5,5,4,5,5,5,5,5,5,2,1,1,2,2,1,2,2,2,2,2,2,2,2,2],
  "-2.00": [5,5,5,5,5,5,5,5,5,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2],
  "-2.25": [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-2.50": [3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-2.75": [3,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-3.00": [3,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  "-3.25": [3,2,2,1,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2],
  "-3.50": [3,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2],
  "-3.75": [3,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
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

export default function Matrix() {
  const [selected, setSelected] = useState<null | {
    sph: string;
    cyl: number;
    stock: number;
  }>(null);

  return (
    <>
      <Breadcrumb title={"Matrix"} pages={["Matrix"]} />

      <div className="mx-auto max-w-[1200px]">
        <div className="bg-white rounded-xl shadow-1 p-6">
          <h2 className="mb-6 text-xl font-semibold text-dark">
            Disponibilidad por Medida
          </h2>

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
                {Object.entries(matrix).map(([sph, values]) => (
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
                <span className="text-xl font-bold text-blue">
                  S/ 180.00
                </span>
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
