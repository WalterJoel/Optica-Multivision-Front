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
  width: "190mm",
  minHeight: "270mm",
  boxSizing: "border-box",
  margin: "0 auto",
  background: "#fff",
  color: "#111",
  padding: "8mm",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "10pt",
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
  gridTemplateColumns: "1fr 52mm",
  borderBottom: "1px solid #222",
  paddingBottom: "2mm",
  marginBottom: "2mm",
  columnGap: "3mm",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #222",
  padding: "2mm",
  fontWeight: 700,
  fontSize: "9pt",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #222",
  padding: "2mm",
  height: "10mm",
  fontSize: "9pt",
};

const tdLabelStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 700,
  width: "12mm",
};

const sectionTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "11pt",
  marginBottom: "2mm",
};

const boxTitle: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: "2mm",
};

const OrderPrint = ({ form }: Props) => {
  const hasLens = (value: string) => form.lenteMateriales.includes(value);
  const hasMontura = (value: string) => form.monturaMateriales.includes(value);

  return (
    <div style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <img
  src="/logo-multivision.jpeg"
  alt="Logo Multivisión"
  style={{
    width: "55mm",
    height: "auto",
    objectFit: "contain",
  }}
/>

          <div style={{ fontSize: "9pt", marginTop: "3mm" }}>
            <strong>Dirección:</strong> Calle Santa Martha 218 Int. 2
          </div>

          <div style={{ fontSize: "9pt", marginTop: "1mm" }}>
            <strong>Cel.:</strong> 991 053 468 &nbsp;&nbsp;
            <strong>Telf.:</strong> 054 221 994
          </div>
        </div>

        <div
          style={{
            border: "2px solid #222",
            padding: "3mm 5mm",
            fontWeight: 700,
            fontSize: "14pt",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          ORDEN DE PEDIDO
        </div>
      </div>

      <div style={{ marginTop: "2mm", marginBottom: "3mm" }}>
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
            paddingBottom: "2mm",
            marginBottom: "3mm",
          }}
        >
          <strong>Dirección:</strong> {form.direccion}
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "3mm",
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

      <div style={{ marginBottom: "3mm" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 58mm",
            gap: "3mm",
            marginBottom: "2mm",
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
            padding: "3mm",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3mm",
          }}
        >
          <div>
            <div style={sectionTitle}>POLICARBONATOS</div>
            <CheckLine checked={hasLens("Poly AR")} label="Poly AR" note="(Verde)" />
            <CheckLine checked={hasLens("Poly Blue Green")} label="Poly Blue Green" note="(Verde)" />
            <CheckLine checked={hasLens("Poly Blue")} label="Poly Blue" note="(Azul)" />
            <CheckLine checked={hasLens("Poly Chromic Blue AR Gris")} label="Poly Chromic Blue AR Gris" note="(Azul)" />
            <div style={{ marginTop: "2mm", fontWeight: 700 }}>OTROS:</div>
          </div>

          <div>
            <div style={sectionTitle}>NK</div>
            <CheckLine checked={hasLens("NK Blue Azul")} label="NK Blue" note="(Azul)" />
            <CheckLine checked={hasLens("NK Blue Verde")} label="NK Blue" note="(Verde)" />
            <CheckLine checked={hasLens("NK Chromic Ar Gris Verde")} label="NK Chromic Ar Gris" note="(Verde)" />
            <CheckLine checked={hasLens("NK Chromic Blue AR Gris Azul")} label="NK Chromic Blue AR Gris" note="(Azul)" />

            <div style={{ ...sectionTitle, marginTop: "2mm" }}>CRYSTAL BLUE</div>
            <CheckLine checked={hasLens("Crystal Blue")} label="Crystal Blue" note="(Azul)" />
            <CheckLine checked={hasLens("Fotoblue Crystal Blue")} label="Fotoblue Crystal Blue" note="(Azul)" />
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #222",
          padding: "3mm",
          marginBottom: "3mm",
        }}
      >
        <div style={boxTitle}>Material de Montura</div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4mm",
            marginBottom: "3mm",
          }}
        >
          <MiniCheck checked={hasMontura("Carey")} label="Carey" />
          <MiniCheck checked={hasMontura("Acetato")} label="Acetato" />
          <MiniCheck checked={hasMontura("Metal")} label="Metal" />
          <MiniCheck checked={hasMontura("TR-90")} label="TR-90" />
          <MiniCheck checked={hasMontura("Aluminio")} label="Aluminio" />
        </div>

        <div style={boxTitle}>Montura</div>

        <div style={{ display: "flex", gap: "6mm", marginBottom: "3mm" }}>
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
          gap: "3mm",
          marginBottom: "3mm",
        }}
      >
        <div
          style={{
            border: "1px solid #222",
            height: "26mm",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #222",
              padding: "2mm 3mm",
              fontWeight: 700,
            }}
          >
            OBSERVACIONES
          </div>

          <div style={{ padding: "3mm" }}>
            <div style={{ marginBottom: "2mm" }}>
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
            height: "26mm",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #222",
              padding: "2mm 3mm",
              fontWeight: 700,
            }}
          >
            PRECIO
          </div>

          <div
            style={{
              padding: "3mm",
              fontSize: "13pt",
              fontWeight: 700,
            }}
          >
            S/ {form.precio}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "8.5pt", lineHeight: 1.25, marginTop: "1mm" }}>
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "2mm",
        fontSize: "8.8pt",
      }}
    >
      <span
        style={{
          width: "4mm",
          height: "4mm",
          minWidth: "4mm",
          border: "1px solid #222",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "2mm",
          fontSize: "8pt",
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
          borderBottom: "1px dotted #555",
          margin: "0 2mm",
          minWidth: "4mm",
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5mm",
        fontSize: "8.8pt",
      }}
    >
      <span
        style={{
          width: "4mm",
          height: "4mm",
          minWidth: "4mm",
          border: "1px solid #222",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "8pt",
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