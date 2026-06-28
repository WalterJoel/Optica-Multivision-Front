"use client";

import React from "react";
import { LogoMultivision } from "../Common/LogoMultivision";
import { IResponseSale } from "@/types/sales";
import { IStore } from "@/types/stores";

interface SaleNotePrintProps {
  venta: IResponseSale;
  sede?: IStore;
}

const pageStyle: React.CSSProperties = {
  width: "190mm",
  minHeight: "270mm",
  boxSizing: "border-box",
  margin: "0 auto",
  background: "#fff",
  color: "#111",
  padding: "10mm",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "10pt",
  lineHeight: 1.2,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8mm",
  borderBottom: "2px solid #3b82f6",
  paddingBottom: "4mm",
};

const companyBoxStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const invoiceBoxStyle: React.CSSProperties = {
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  padding: "4mm 6mm",
  textAlign: "center",
  minWidth: "60mm",
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "4mm",
  marginBottom: "6mm",
  backgroundColor: "#f8fafc",
  padding: "4mm",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "6mm",
};

const thStyle: React.CSSProperties = {
  backgroundColor: "#3b82f6",
  color: "#fff",
  fontWeight: "bold",
  textAlign: "left",
  padding: "2.5mm 3mm",
  fontSize: "9pt",
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #e2e8f0",
  padding: "2.5mm 3mm",
  fontSize: "9pt",
};

const summaryContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginTop: "4mm",
};

const summaryBoxStyle: React.CSSProperties = {
  width: "70mm",
  backgroundColor: "#f8fafc",
  padding: "4mm",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  gap: "2mm",
};

export const SaleNotePrint = ({ venta, sede }: SaleNotePrintProps) => {
  const date = new Date(venta.createdAt);
  const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const clientName = venta.cliente
    ? venta.cliente.tipoCliente === "EMPRESA"
      ? venta.cliente.razonSocial
      : `${venta.cliente.nombres || ""} ${venta.cliente.apellidos || ""}`.trim()
    : "Público General";

  const clientDocType = venta.cliente
    ? venta.cliente.tipoCliente === "EMPRESA"
      ? "RUC"
      : "DNI"
    : "DOC";

  const sellerName = venta.user
    ? `${venta.user.nombre || ""} ${venta.user.apellido || ""}`.trim()
    : `Usuario #${venta.userId}`;

  return (
    <div style={pageStyle} className="print-container">
      {/* HEADER */}
      <div style={headerStyle}>
        <div style={companyBoxStyle}>
          <div className="scale-75 origin-top-left -mb-4">
            <LogoMultivision size="sm" subtitle={false} />
          </div>
          <div style={{ fontSize: "8.5pt", color: "#475569", marginTop: "2mm" }}>
            <span style={{ fontWeight: "bold" }}>Sede:</span> {sede?.nombre || "Multivisión Premium"}
            <br />
            <span style={{ fontWeight: "bold" }}>Dirección:</span> {sede?.direccion || "Calle Santa Martha 218 Int. 2"}
            <br />
            <span style={{ fontWeight: "bold" }}>Teléfono:</span> {sede?.telefono || "991 053 468 / 054 221 994"}
          </div>
        </div>

        <div style={invoiceBoxStyle}>
          <h2 style={{ fontSize: "12pt", fontWeight: "900", color: "#3b82f6", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
            Nota de Pedido
          </h2>
          <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "2mm 0" }} />
          <div style={{ fontSize: "11pt", fontWeight: "bold", color: "#1e293b" }}>
            RUC: {sede?.ruc || "—"}
          </div>
          <div style={{ fontSize: "12pt", fontWeight: "900", color: "#ef4444", marginTop: "1mm" }}>
            Nº Venta: #{venta.id}
          </div>
        </div>
      </div>

      {/* INFO GRID */}
      <div style={infoGridStyle}>
        <div>
          <h3 style={{ fontSize: "9pt", fontWeight: "bold", color: "#3b82f6", margin: "0 0 2mm 0", textTransform: "uppercase" }}>
            Datos del Cliente
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1mm", fontSize: "9pt" }}>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>Cliente:</span> {clientName}</div>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>{clientDocType}:</span> {venta.cliente?.numeroDoc || "—"}</div>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>Dirección:</span> {venta.cliente?.direccion || "—"}</div>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>Teléfono:</span> {venta.cliente?.telefono || "—"}</div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "9pt", fontWeight: "bold", color: "#3b82f6", margin: "0 0 2mm 0", textTransform: "uppercase" }}>
            Detalle del Pedido
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1mm", fontSize: "9pt" }}>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>Fecha y Hora:</span> {formattedDate}</div>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>Vendedor:</span> {sellerName}</div>
            <div><span style={{ fontWeight: "bold", color: "#475569" }}>Método Pago:</span> {venta.metodoPago || "—"}</div>
            <div>
              <span style={{ fontWeight: "bold", color: "#475569" }}>Tipo Venta:</span>{" "}
              <span style={{ fontWeight: "bold", color: venta.tipoVenta === "CREDITO" ? "#3b82f6" : "#10b981" }}>
                {venta.tipoVenta === "CREDITO" ? "A Crédito" : "Al Contado"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "15mm", textAlign: "center" }}>Cant</th>
            <th style={{ ...thStyle, width: "25mm" }}>Tipo</th>
            <th style={thStyle}>Descripción</th>
            <th style={{ ...thStyle, width: "30mm", textAlign: "right" }}>P. Unit</th>
            <th style={{ ...thStyle, width: "25mm", textAlign: "right" }}>Desc.</th>
            <th style={{ ...thStyle, width: "30mm", textAlign: "right" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {venta.productos.map((prod) => {
            const price = Number(prod.precioUnitario);
            const qty = Number(prod.cantidad);
            const disc = Number(prod.descuento || 0);
            const sub = price * qty - disc;

            return (
              <tr key={prod.id}>
                <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>{qty}</td>
                <td style={{ ...tdStyle, fontWeight: "bold", color: "#475569", textTransform: "uppercase" }}>
                  {prod.tipoProducto}
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: "bold", color: "#1e293b" }}>
                    {prod.stock?.lente ? (
                      `${prod.stock.lente.marca} (${prod.stock.lente.material})`
                    ) : prod.producto?.montura ? (
                      `${prod.producto.nombre} - ${prod.producto.montura.marca} (${prod.producto.montura.material})`
                    ) : (
                      prod.producto?.nombre || ""
                    )}
                  </div>
                  {prod.producto?.montura && (
                    <div style={{ fontSize: "8pt", color: "#64748b", marginTop: "0.5mm" }}>
                      <span>Código: {prod.producto.montura.codigo || "—"}</span>
                      <span style={{ margin: "0 2mm" }}>|</span>
                      <span>Cód. Montura: {prod.producto.montura.codigoMontura || "—"}</span>
                    </div>
                  )}
                  {prod.tipoProducto === "LENTE" && (prod.esf || prod.cyl) && (
                    <div style={{ fontSize: "8pt", color: "#64748b", marginTop: "0.5mm", fontFamily: "monospace" }}>
                      {prod.esf ? `ESF: ${Number(prod.esf) > 0 ? `+${prod.esf}` : prod.esf}` : ""}
                      {prod.esf && prod.cyl ? " | " : ""}
                      {prod.cyl ? `CYL: ${Number(prod.cyl) > 0 ? `+${prod.cyl}` : prod.cyl}` : ""}
                    </div>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>S/. {price.toFixed(2)}</td>
                <td style={{ ...tdStyle, textAlign: "right", color: disc > 0 ? "#ef4444" : "#111" }}>
                  {disc > 0 ? `-S/. ${disc.toFixed(2)}` : "—"}
                </td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold", color: "#3b82f6" }}>
                  S/. {sub.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SUMMARY */}
      <div style={summaryContainerStyle}>
        <div style={{ maxWidth: "100mm" }}>
          {venta.observaciones && (
            <div style={{ backgroundColor: "#f8fafc", padding: "3mm", borderRadius: "6px", border: "1px dashed #cbd5e1" }}>
              <span style={{ fontWeight: "bold", fontSize: "8.5pt", color: "#475569", textTransform: "uppercase" }}>
                Observaciones de la venta:
              </span>
              <p style={{ margin: "1mm 0 0 0", fontSize: "8.5pt", color: "#334155" }}>
                {venta.observaciones}
              </p>
            </div>
          )}
        </div>

        <div style={summaryBoxStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5pt" }}>
            <span style={{ color: "#475569", fontWeight: "bold" }}>Deuda Pendiente:</span>
            <span style={{ fontWeight: "900", color: Number(venta.deuda) > 0 ? "#ef4444" : "#334155" }}>
              S/. {Number(venta.deuda).toFixed(2)}
            </span>
          </div>
          <div style={{ height: "1px", backgroundColor: "#cbd5e1", margin: "1mm 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11pt" }}>
            <span style={{ color: "#3b82f6", fontWeight: "900", textTransform: "uppercase" }}>Total:</span>
            <span style={{ fontWeight: "900", color: "#3b82f6" }}>S/. {Number(venta.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
