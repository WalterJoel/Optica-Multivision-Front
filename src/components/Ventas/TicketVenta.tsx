"use client";

import React from "react";
import { IResponseSale } from "@/types/sales";
import { IStore } from "@/types/stores";
import { formatearMedidasLente } from "@/utils/lenses";

interface TicketVentaProps {
  venta: IResponseSale;
  sede?: IStore;
}

const pageStyle: React.CSSProperties = {
  width: "55mm",
  minHeight: "97mm",
  boxSizing: "border-box",
  margin: "0 auto",
  background: "#fff",
  color: "#000",
  padding: "3mm 2.5mm",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "7.5pt",
  lineHeight: 1.15,
};

export const TicketVenta = ({ venta, sede }: TicketVentaProps) => {
  const date = new Date(venta.createdAt);
  const formattedDate =
    date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const clientName = venta.cliente
    ? venta.cliente.tipoCliente === "EMPRESA"
      ? venta.cliente.razonSocial || "—"
      : `${venta.cliente.nombres || ""} ${venta.cliente.apellidos || ""}`.trim()
    : "Público General";

  const clientDocLabel = venta.cliente
    ? venta.cliente.tipoCliente === "EMPRESA"
      ? "RUC"
      : "DNI/RUC"
    : "DOC";

  const sellerName = venta.user
    ? `${venta.user.nombre || ""} ${venta.user.apellido || ""}`.trim()
    : `Usuario #${venta.userId}`;

  const totalMonto = Number(venta.total || 0);
  const montoPagado = Number(venta.montoPagado || 0);
  const deudaMonto = Number(venta.deuda || 0);

  return (
    <div style={pageStyle} className="ticket-print-container">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: 55mm 97mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
            }
            .ticket-print-container {
              width: 55mm !important;
              min-height: 97mm !important;
              padding: 3mm 2.5mm !important;
            }
          }
        `
      }} />

      {/* HEADER / TIENDA */}
      <div style={{ textAlign: "center", marginBottom: "2mm" }}>
        <div style={{ fontSize: "9pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {sede?.nombre || "MULTIVISIÓN ÓPTICA"}
        </div>
        {sede?.ruc && (
          <div style={{ fontSize: "7.5pt", fontWeight: "bold", marginTop: "0.5mm" }}>
            RUC: {sede.ruc}
          </div>
        )}
        <div style={{ fontSize: "6.5pt", color: "#222", marginTop: "0.5mm", lineHeight: 1.1 }}>
          {sede?.direccion || "Calle Santa Martha 218 Int. 2"}
        </div>
        {sede?.telefono && (
          <div style={{ fontSize: "6.5pt", color: "#222" }}>
            Telf: {sede.telefono}
          </div>
        )}
      </div>

      <div style={{ borderBottom: "1px dashed #000", marginBottom: "2mm" }} />

      {/* DETALLES DE VENTA */}
      <div style={{ fontSize: "7pt", marginBottom: "2mm" }}>
        <div style={{ fontWeight: "bold", fontSize: "8pt", textTransform: "uppercase" }}>
          NOTA DE PEDIDO: #{venta.id}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Fecha:</span> {formattedDate}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Cliente:</span> {clientName}
        </div>
        {venta.cliente?.numeroDoc && (
          <div>
            <span style={{ fontWeight: "bold" }}>{clientDocLabel}:</span> {venta.cliente.numeroDoc}
          </div>
        )}
        <div>
          <span style={{ fontWeight: "bold" }}>Vendedor:</span> {sellerName}
        </div>
      </div>

      <div style={{ borderBottom: "1px dashed #000", marginBottom: "2mm" }} />

      {/* TABLA DE PRODUCTOS (CANT | DESC | P.UNIT | TOTAL) */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "6.8pt",
          marginBottom: "2mm",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #000" }}>
            <th style={{ textAlign: "left", width: "8mm", paddingBottom: "1mm", paddingRight: "1mm" }}>CANT</th>
            <th style={{ textAlign: "left", paddingBottom: "1mm" }}>DESC</th>
            <th style={{ textAlign: "right", width: "11mm", paddingBottom: "1mm" }}>P.UNIT</th>
            <th style={{ textAlign: "right", width: "11mm", paddingBottom: "1mm" }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {venta.productos.map((prod) => {
            const price = Number(prod.precioUnitario || 0);
            const qty = Number(prod.cantidad || 0);
            const disc = Number(prod.descuento || 0);
            const sub = Number(prod.subtotal || price * qty - disc);

            const prodName = prod.stock?.lente ? (
              prod.stock.lente.marca || "Lente"
            ) : prod.producto?.montura ? (
              `${prod.producto.nombre || ""} ${prod.producto.montura.marca || ""}`
            ) : (
              prod.producto?.nombre || prod.tipoProducto || "Producto"
            );

            return (
              <React.Fragment key={prod.id}>
                <tr>
                  <td style={{ verticalAlign: "top", fontWeight: "bold", paddingTop: "1mm" }}>
                    {qty}
                  </td>
                  <td style={{ verticalAlign: "top", paddingTop: "1mm", wordBreak: "break-word" }}>
                    <span style={{ fontWeight: "bold" }}>{prodName}</span>
                  </td>
                  <td style={{ verticalAlign: "top", textAlign: "right", paddingTop: "1mm" }}>
                    {price.toFixed(2)}
                  </td>
                  <td style={{ verticalAlign: "top", textAlign: "right", fontWeight: "bold", paddingTop: "1mm" }}>
                    {sub.toFixed(2)}
                  </td>
                </tr>
                {/* Detalles secundarios en miniatura */}
                {((prod.producto?.montura?.codigo || prod.producto?.montura?.codigoMontura) ||
                  prod.tipoProducto === "LENTE") && (
                    <tr>
                      <td />
                      <td colSpan={3} style={{ fontSize: "7pt", fontWeight: "bold", paddingBottom: "1mm" }}>
                        {prod.producto?.montura && (
                          <div>
                            Cód: {prod.producto.montura.codigo || prod.producto.montura.codigoMontura}
                          </div>
                        )}
                        {prod.tipoProducto === "LENTE" && (
                          <div>
                            {formatearMedidasLente(prod.esf, prod.cyl)}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div style={{ borderBottom: "1px dashed #000", marginBottom: "2mm" }} />

      {/* RESUMEN DE PAGO */}
      <div style={{ fontSize: "7.5pt", display: "flex", flexDirection: "column", gap: "1mm", marginBottom: "2mm" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>TOTAL </span>
          <span>S/. {totalMonto.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{deudaMonto > 0 ? "A CUENTA" : "PAGADO"} </span>
          <span>S/. {Math.min(montoPagado, totalMonto).toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "8pt" }}>
          <span>SALDO </span>
          <span>S/. {deudaMonto.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ borderBottom: "1px dashed #000", marginBottom: "2mm" }} />

      {/* OBSERVACIONES Y FOOTER */}
      {venta.observaciones && (
        <div style={{ fontSize: "6.5pt", marginBottom: "2mm" }}>
          <span style={{ fontWeight: "bold" }}>Obs:</span> {venta.observaciones}
        </div>
      )}

    </div>
  );
};

export default TicketVenta;
