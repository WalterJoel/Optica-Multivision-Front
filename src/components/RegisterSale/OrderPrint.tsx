"use client";

import React from "react";

type EyeData = {
  esf: string;
  cil: string;
  eje: string;
  dip: string;
};

type OrderForm = {
  orderId: string;
  optica: string;
  orderDate: string;
  customerName: string;
  celular: string;
  direccion: string;
  add: string;
  marca: string;
  precio: string;
  observaciones: string;
  biselBrillante: "SI" | "NO" | "";

  od: EyeData;
  oi: EyeData;

  lenteMateriales: string[];
  monturaMateriales: string[];
  tipoMontura: string;
};

interface Props {
  form: OrderForm;
}

const pageStyle: React.CSSProperties = {
  width: "210mm",
  height: "297mm",
  boxSizing: "border-box",
  margin: "0 auto",
  background: "#fff",
  color: "#111",
  padding: "10mm 12mm",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "13px",
  lineHeight: 1.15,
  overflow: "hidden",
};

const headerRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "10px",
};

const dataRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 220px",
  borderBottom: "1px solid #222",
  paddingBottom: "4px",
  marginBottom: "6px",
  columnGap: "12px",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #222",
  padding: "8px",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #222",
  padding: "10px 8px",
  height: "38px",
};

const tdLabelStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 700,
  width: "60px",
};

const sectionTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "16px",
  marginBottom: "8px",
};

const OrderPrint = ({ form }: Props) => {
  const hasLens = (value: string) => form.lenteMateriales.includes(value);
  const hasMontura = (value: string) => form.monturaMateriales.includes(value);

  return (
    <div style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: 1 }}>
            MULTIVISIÓN
          </div>

          <div style={{ fontSize: "13px", marginTop: "4px" }}>
            Tu visión, es nuestra misión
          </div>

          <div style={{ fontSize: "12px", marginTop: "10px" }}>
            <strong>Dirección:</strong> Calle Santa Martha 218 Int. 2
          </div>

          <div style={{ fontSize: "12px", marginTop: "2px" }}>
            <strong>Cel.:</strong> 991 053 468 &nbsp;&nbsp;
            <strong>Telf.:</strong> 054 221 994
          </div>
        </div>

        <div
          style={{
            border: "2px solid #222",
            padding: "8px 14px",
            fontWeight: 800,
            fontSize: "24px",
            whiteSpace: "nowrap",
          }}
        >
          ORDEN DE PEDIDO
        </div>
      </div>

      <div style={{ marginTop: "14px" }}>
        <div style={dataRowStyle}>
          <div>
            <strong>ÓPTICA:</strong> {form.optica}
          </div>
          <div>
            <strong>FECHA:</strong> {form.orderDate}
          </div>
        </div>

        <div style={dataRowStyle}>
          <div>
            <strong>Nombre:</strong> {form.customerName}
          </div>
          <div>
            <strong>Celular:</strong> {form.celular}
          </div>
        </div>

        <div
          style={{
            borderBottom: "1px solid #222",
            paddingBottom: "4px",
            marginBottom: "10px",
          }}
        >
          <strong>Dirección:</strong> {form.direccion}
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "12px",
          textAlign: "center",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>ESF.</th>
            <th style={thStyle}>CIL.</th>
            <th style={thStyle}>EJE</th>
            <th style={thStyle}>DIP</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdLabelStyle}>OD</td>
            <td style={tdStyle}>{form.od.esf}</td>
            <td style={tdStyle}>{form.od.cil}</td>
            <td style={tdStyle}>{form.od.eje}</td>
            <td style={tdStyle}>{form.od.dip}</td>
          </tr>

          <tr>
            <td style={tdLabelStyle}>OI</td>
            <td style={tdStyle}>{form.oi.esf}</td>
            <td style={tdStyle}>{form.oi.cil}</td>
            <td style={tdStyle}>{form.oi.eje}</td>
            <td style={tdStyle}>{form.oi.dip}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: "12px",
            marginBottom: "6px",
          }}
        >
          <div style={{ borderBottom: "1px solid #222", fontWeight: 700 }}>
            Material del Lente
          </div>

          <div style={{ borderBottom: "1px solid #222", fontWeight: 700 }}>
            ADD {form.add}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #222",
            padding: "10px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            marginBottom: "10px",
          }}
        >
          <div>
            <div style={sectionTitle}>POLICARBONATOS</div>
            <CheckLine checked={hasLens("Poly AR")} label="Poly AR" note="(Verde)" />
            <CheckLine checked={hasLens("Poly Blue Green")} label="Poly Blue Green" note="(Verde)" />
            <CheckLine checked={hasLens("Poly Blue")} label="Poly Blue" note="(Azul)" />
            <CheckLine checked={hasLens("Poly Chromic Blue AR Gris")} label="Poly Chromic Blue AR Gris" note="(Azul)" />
            <div style={{ marginTop: "10px", fontWeight: 700 }}>OTROS:</div>
          </div>

          <div>
            <div style={sectionTitle}>NK</div>
            <CheckLine checked={hasLens("NK Blue Azul")} label="NK Blue" note="(Azul)" />
            <CheckLine checked={hasLens("NK Blue Verde")} label="NK Blue" note="(Verde)" />
            <CheckLine checked={hasLens("NK Chromic Ar Gris Verde")} label="NK Chromic Ar Gris" note="(Verde)" />
            <CheckLine checked={hasLens("NK Chromic Blue AR Gris Azul")} label="NK Chromic Blue AR Gris" note="(Azul)" />

            <div style={{ ...sectionTitle, marginTop: "10px" }}>CRYSTAL BLUE</div>
            <CheckLine checked={hasLens("Crystal Blue")} label="Crystal Blue" note="(Azul)" />
            <CheckLine checked={hasLens("Fotoblue Crystal Blue")} label="Fotoblue Crystal Blue" note="(Azul)" />
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #222",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "8px" }}>Material de Montura</div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "18px",
            marginBottom: "10px",
          }}
        >
          <MiniCheck checked={hasMontura("Carey")} label="Carey" />
          <MiniCheck checked={hasMontura("Acetato")} label="Acetato" />
          <MiniCheck checked={hasMontura("Metal")} label="Metal" />
          <MiniCheck checked={hasMontura("TR-90")} label="TR-90" />
          <MiniCheck checked={hasMontura("Aluminio")} label="Aluminio" />
        </div>

        <div style={{ fontWeight: 700, marginBottom: "8px" }}>Montura</div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "10px" }}>
          <MiniCheck checked={form.tipoMontura === "Nueva"} label="Nueva" />
          <MiniCheck checked={form.tipoMontura === "Usada"} label="Usada" />
        </div>

        <div>
          <strong>Marca:</strong> {form.marca}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            border: "1px solid #222",
            height: "110px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #222",
              padding: "6px 10px",
              fontWeight: 700,
            }}
          >
            OBSERVACIONES
          </div>

          <div style={{ padding: "10px" }}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Bisel brillante:</strong>{" "}
              {form.biselBrillante === "SI"
                ? "SI"
                : form.biselBrillante === "NO"
                  ? "NO"
                  : ""}
            </div>

            <div>{form.observaciones}</div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #222",
            height: "110px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #222",
              padding: "6px 10px",
              fontWeight: 700,
            }}
          >
            PRECIO
          </div>

          <div style={{ padding: "10px", fontSize: "20px", fontWeight: 700 }}>
            S/ {form.precio}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "12px", marginTop: "10px", lineHeight: 1.3 }}>
        <div>1. Multivisión no se responsabiliza por el daño o deterioro de monturas usadas.</div>
        <div>2. La garantía por medida o eje solo es válida dentro de los 30 días.</div>
        <div>3. Al llenar esta orden de pedido, usted está aceptando los términos y condiciones.</div>
      </div>
    </div>
  );
};

function CheckLine({
  checked,
  label,
  note,
}: {
  checked: boolean;
  label: string;
  note?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "7px" }}>
      <span
        style={{
          width: "18px",
          height: "18px",
          minWidth: "18px",
          border: "1px solid #222",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "6px",
          fontSize: "12px",
          fontWeight: 700,
          boxSizing: "border-box",
        }}
      >
        {checked ? "X" : ""}
      </span>

      <span>{label}</span>

      <span
        style={{
          flex: 1,
          borderBottom: "1px dotted #444",
          margin: "0 6px",
          minWidth: "20px",
        }}
      />

      {note && <span>{note}</span>}
    </div>
  );
}

function MiniCheck({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          width: "18px",
          height: "18px",
          minWidth: "18px",
          border: "1px solid #222",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 700,
          boxSizing: "border-box",
        }}
      >
        {checked ? "X" : ""}
      </span>

      <span>{label}</span>
    </div>
  );
}

export default OrderPrint;