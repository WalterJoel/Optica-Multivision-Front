"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export const MiniTable = ({
  titulo,
  data,
}: {
  titulo: string;
  data: any[];
}) => (
  <div className="bg-white rounded-[24px] border border-blue-light-5 shadow-testimonial overflow-hidden flex flex-col transition-all hover:shadow-2">
    {/* HEADER */}
    <div className="px-6 py-5 flex justify-between items-center border-b border-gray-2 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
        <h3 className="text-[12px] font-black text-dark-2 uppercase tracking-[2px]">
          {titulo}
        </h3>
      </div>

      <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all">
        <Search size={14} className="text-blue-light-2" />
        <input
          type="text"
          placeholder="Filtrar ventas..."
          className="bg-transparent text-[11px] ml-2 outline-none w-28 text-dark-3 font-medium placeholder:text-gray-5"
        />
      </div>
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        {/* HEAD */}
        <thead>
          <tr className="bg-beige text-[10px] font-black text-blue uppercase tracking-widest">
            <th className="px-7 py-4">Venta</th>
            <th className="px-6 py-4">Fecha</th>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4 text-right">Precio</th>
            <th className="px-6 py-4 text-center">Cant</th>
            <th className="px-6 py-4 text-right">Desc</th>
            <th className="px-7 py-4 text-right">Total</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y-4 divide-beige">
          {data.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="p-10 text-center text-gray-5 font-bold uppercase tracking-widest"
              >
                No hay ventas
              </td>
            </tr>
          )}

          {data.map((venta) =>
            venta.productos.map((prod: any) => {
              const price = Number(prod.precioUnitario);
              const discount = Number(prod.descuento || 0);
              const quantity = Number(prod.cantidad);
              const total = price * quantity - discount;
              const date = new Date(venta.createdAt);

              return (
                <tr
                  key={prod.id}
                  className="hover:bg-blue-light-6/40 transition-all"
                >
                  {/* Venta */}
                  <td className="px-7 py-4 font-black text-dark">
                    #{venta.id}
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-dark-3">
                    {date.toLocaleDateString()}
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4 text-dark-3 font-medium">
                    {venta.cliente || "—"}
                  </td>

                  {/* Producto */}
                  <td className="px-6 py-4">
                    <span className="font-black text-dark">
                      #{prod.productoId}
                    </span>{" "}
                    ({prod.tipoProducto})
                  </td>

                  {/* Precio */}
                  <td className="px-6 py-4 text-right font-bold text-dark">
                    S/. {price.toFixed(2)}
                  </td>

                  {/* Cant */}
                  <td className="px-6 py-4 text-center font-black text-dark">
                    {quantity}
                  </td>

                  {/* Desc */}
                  <td className="px-6 py-4 text-right font-bold text-red">
                    - S/. {discount.toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="px-7 py-4 text-right">
                    <span className="font-black text-[14px] tracking-tight text-blue">
                      S/. {total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>

    {/* FOOTER */}
    <div className="px-7 py-4 bg-beige border-t border-gray-2 flex justify-between items-center">
      <span className="text-[10px] font-bold text-gray-4 uppercase tracking-[2px]">
        Página <span className="text-dark">01</span> de 12
      </span>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 transition-all">
          <ChevronLeft size={16} />
        </button>
        <button className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);
