"use client";

import React from "react";
import { IStore } from "@/types/stores";
import { MetodoPago, TipoCliente } from "@/commons/constants";

interface TicketConsolidadoCajaProps {
  titulo?: string;
  sede?: IStore | null;
  fechaInicio: string;
  fechaFin: string;
  movimientos: any[];
  idContenedor?: string;
}

const pageStyle: React.CSSProperties = {
  width: "55mm",
  minHeight: "auto",
  boxSizing: "border-box",
  margin: "0 auto",
  background: "#fff",
  color: "#000",
  padding: "3mm 2.5mm",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "7.5pt",
  lineHeight: 1.2,
};

const formatFechaDisplay = (f: string) => {
  if (!f) return "";
  const parts = f.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return f;
};

export const TicketConsolidadoCaja = ({
  titulo = "REPORTE CONSOLIDADO DE CAJA",
  sede,
  fechaInicio,
  fechaFin,
  movimientos = [],
  idContenedor = "ticket-caja-print",
}: TicketConsolidadoCajaProps) => {
  const now = new Date();
  const fechaEmision =
    now.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) +
    " " +
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Agrupar por Método de Pago dinámicamente desde MetodoPago enum
  const desgloseMetodos = React.useMemo(() => {
    const map: Record<string, number> = {};
    const enumValues = Object.values(MetodoPago);

    movimientos.forEach((m) => {
      const rawMetodo = (m.metodoPago || "").toUpperCase().trim();
      const monto = Number(m.monto || 0);

      // Buscar si coincide con alguna de las constantes de MetodoPago
      const metodoValido =
        enumValues.find((val) => rawMetodo.includes(val) || val.includes(rawMetodo)) ||
        rawMetodo;

      if (!map[metodoValido]) {
        map[metodoValido] = 0;
      }
      map[metodoValido] += monto;
    });

    return map;
  }, [movimientos]);

  const totalCalculado = React.useMemo(() => {
    return movimientos.reduce((acc, m) => acc + Number(m.monto || 0), 0);
  }, [movimientos]);

  const rangoTexto =
    fechaInicio === fechaFin
      ? formatFechaDisplay(fechaInicio)
      : `${formatFechaDisplay(fechaInicio)} AL ${formatFechaDisplay(fechaFin)}`;

  return (
    <div id={idContenedor} className="hidden print:block" style={pageStyle}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: 55mm auto;
              margin: 0;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
            }
            body * {
              visibility: hidden !important;
            }
            #${idContenedor}, #${idContenedor} * {
              visibility: visible !important;
            }
            #${idContenedor} {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              margin: 0 !important;
              width: 55mm !important;
              padding: 3mm 2.5mm !important;
              background: #fff !important;
            }
          }
        `
      }} />

      {/* HEADER SEDE */}
      <div style={{ textAlign: "center", marginBottom: "2mm" }}>
        <div style={{ fontSize: "9pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {sede?.nombre || "MULTIVISIÓN ÓPTICA"}
        </div>
        {sede?.ruc && (
          <div style={{ fontSize: "7.5pt", fontWeight: "bold", marginTop: "0.5mm" }}>
            RUC: {sede.ruc}
          </div>
        )}
        {sede?.direccion && (
          <div style={{ fontSize: "6.5pt", color: "#222", marginTop: "0.5mm", lineHeight: 1.1 }}>
            {sede.direccion}
          </div>
        )}
        {sede?.telefono && (
          <div style={{ fontSize: "6.5pt", color: "#222" }}>
            Telf: {sede.telefono}
          </div>
        )}
      </div>



      {/* FECHA Y SEDE INFO */}
      <div style={{ marginBottom: "2mm", fontSize: "7pt" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>EMISIÓN:</span>
          <span style={{ fontWeight: "bold" }}>{fechaEmision}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>PERIODO:</span>
          <span style={{ fontWeight: "bold" }}>{rangoTexto}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>REGISTROS:</span>
          <span style={{ fontWeight: "bold" }}>{movimientos.length}</span>
        </div>
      </div>

      {/* DETALLE DE REGISTROS (CLIENTE, MÉTODO DE PAGO, MONTO) */}
      <div style={{
        borderTop: "1px solid #000",
        paddingTop: "1.5mm",
        marginTop: "1.5mm"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "6.5pt", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #888", fontSize: "6pt", fontWeight: "bold" }}>
              <th style={{ paddingBottom: "1mm" }}>CLIENTE</th>
              <th style={{ paddingBottom: "1mm", textAlign: "center" }}>MÉTODO</th>
              <th style={{ paddingBottom: "1mm", textAlign: "right" }}>MONTO</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m, idx) => {
              const clienteObj = m.venta?.cliente;
              let clienteNombre = "";

              if (clienteObj) {
                clienteNombre =
                  clienteObj.tipoCliente === TipoCliente.EMPRESA
                    ? clienteObj.razonSocial || ""
                    : `${clienteObj.nombres || ""} ${clienteObj.apellidos || ""}`.trim();
              }

              if (!clienteNombre) {
                clienteNombre = (m.descripcion || "PÚBLICO GENERAL").trim();
              }

              return (
                <tr key={m.id || idx} style={{ borderBottom: "1px dashed #ccc" }}>
                  <td style={{ padding: "1mm 0", fontWeight: "bold", textTransform: "uppercase", wordBreak: "break-word" }}>
                    {clienteNombre}
                  </td>
                  <td style={{ padding: "1mm 0", textAlign: "center", textTransform: "uppercase" }}>
                    {m.metodoPago}
                  </td>
                  <td style={{ padding: "1mm 0", textAlign: "right", fontWeight: "bold" }}>
                    S/ {Number(m.monto || 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DESGLOSE POR MÉTODO DE PAGO */}
      <div style={{
        borderTop: "1px solid #000",
        paddingTop: "1.5mm",
        marginTop: "2mm"
      }}>
        <div style={{ fontSize: "7.5pt", fontWeight: "bold", marginBottom: "1.5mm", textTransform: "uppercase" }}>
          RESUMEN POR MÉTODO DE PAGO
        </div>

        {Object.entries(desgloseMetodos).map(([metodo, monto]) => (
          <div
            key={metodo}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "7.5pt",
              marginBottom: "1mm"
            }}
          >
            <span>{metodo}:</span>
            <span style={{ fontWeight: "bold" }}>S/ {monto.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* TOTAL CONSOLIDADO */}
      <div style={{
        borderTop: "1px dashed #000",
        borderBottom: "1px dashed #000",
        marginTop: "2mm",
        padding: "1.5mm 0"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9pt",
          fontWeight: "bold"
        }}>
          <span>TOTAL:</span>
          <span>S/ {totalCalculado.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
