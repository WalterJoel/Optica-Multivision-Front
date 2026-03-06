"use client";

import { useEffect } from "react";
import { useEyeglasses } from "@/hooks/products/eyeglasses";

export default function ListEyeglasses() {
  const { eyeglasses, loading, getAllEyeglassesData } = useEyeglasses();

  useEffect(() => {
    getAllEyeglassesData();
  }, []);

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-medium text-dark">Lista de monturas</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">Marca</th>
              <th className="px-6 py-3">Material</th>
              <th className="px-6 py-3">Medida</th>
              <th className="px-6 py-3">Color</th>
              <th className="px-6 py-3">Forma Facial</th>
              <th className="px-6 py-3">Sexo</th>
              <th className="px-6 py-3">Precio</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-6">
                  Cargando...
                </td>
              </tr>
            ) : eyeglasses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6">
                  No hay monturas registradas
                </td>
              </tr>
            ) : (
              eyeglasses.map((item) => (
                <tr key={item.id} className="border-t border-gray-3">
                  <td className="px-6 py-4">{item.marca}</td>
                  <td className="px-6 py-4">{item.material}</td>
                  <td className="px-6 py-4">{item.medida}</td>
                  <td className="px-6 py-4">{item.color}</td>
                  <td className="px-6 py-4">{item.formaFacial}</td>
                  <td className="px-6 py-4">{item.sexo}</td>
                  <td className="px-6 py-4">S/ {Number(item.precio).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}