"use client";

import React, { useEffect } from "react";
import { useSales } from "@/hooks/sales";

const SalesTable = () => {
  const { getAllSales, Sales, loading } = useSales();

  useEffect(() => {
    getAllSales();
  }, []);

  if (loading) return <p className="p-5">Cargando...</p>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* HEADER */}
      <div className="grid grid-cols-8 px-6 py-3 bg-gray-100 text-sm font-bold">
        <div>Venta</div>
        <div>Fecha</div>
        <div>Cliente</div>
        <div>Producto</div>
        <div>Precio</div>
        <div>Cant</div>
        <div>Desc</div>
        <div>Total</div>
      </div>

      {/* BODY */}
      {/* {Sales.map((venta) =>
        venta.productos.map((prod, index) => {
          const price = Number(prod.precioUnitario);
          const discount = Number(prod.descuento || 0);
          const quantity = Number(prod.cantidad);

          return (
            <div
              key={prod.id}
              className="grid grid-cols-8 px-6 py-3 border-t text-sm items-center"
            >
              <div>{index === 0 ? venta.id : ""}</div>

              <div>
                {index === 0
                  ? new Date(venta.createdAt).toLocaleDateString()
                  : ""}
              </div>

              <div>{venta.responsableVenta}</div>

              <div>
                #{prod.productoId} ({prod.tipoProducto})
              </div>

              <div>S/. {price.toFixed(2)}</div>

              <div>{quantity}</div>

              <div>S/. {discount.toFixed(2)}</div>

              <div className="font-bold text-blue">
                S/. {(price * quantity - discount).toFixed(2)}
              </div>
            </div>
          );
        }),
      )} */}
    </div>
  );
};

export default SalesTable;
