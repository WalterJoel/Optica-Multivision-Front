"use client";

import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { BaseInput, BaseTarea } from "@/components/Common/Inputs";
import OrderPrint from "./OrderPrint";
import OrderPreviewModal from "./OrderPreviewModal";

const lenteOptions = [
  "Poly AR",
  "Poly Blue Green",
  "Poly Blue",
  "Poly Chromic Blue AR Gris",
  "NK Blue Azul",
  "NK Blue Verde",
  "NK Chromic Ar Gris Verde",
  "NK Chromic Blue AR Gris Azul",
  "Crystal Blue",
  "Fotoblue Crystal Blue",
];

const monturaMaterialOptions = [
  "Carey",
  "Acetato",
  "Metal",
  "TR-90",
  "Aluminio",
];

const Montaje = () => {
  const [openPreview, setOpenPreview] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    orderId: "",
    optica: "",
    orderDate: new Date().toISOString().slice(0, 10),
    customerName: "",
    marca: "",
    precio: "",
    celular: "",
    direccion: "",
    add: "",
    biselBrillante: "" as "SI" | "NO" | "",
    observaciones: "",

    odEsf: "",
    odCil: "",
    odEje: "",
    odDip: "",

    oiEsf: "",
    oiCil: "",
    oiEje: "",
    oiDip: "",

    lenteMateriales: [] as string[],
    monturaMateriales: [] as string[],
    tipoMontura: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleArrayValue = (
    field: "lenteMateriales" | "monturaMateriales",
    value: string,
  ) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  const orderFormData = {
    orderId: form.orderId,
    optica: form.optica,
    orderDate: form.orderDate,
    customerName: form.customerName,
    celular: form.celular,
    direccion: form.direccion,
    add: form.add,
    marca: form.marca,
    precio: form.precio,
    observaciones: form.observaciones,
    biselBrillante: form.biselBrillante,
    od: {
      esf: form.odEsf,
      cil: form.odCil,
      eje: form.odEje,
      dip: form.odDip,
    },
    oi: {
      esf: form.oiEsf,
      cil: form.oiCil,
      eje: form.oiEje,
      dip: form.oiDip,
    },
    lenteMateriales: form.lenteMateriales,
    monturaMateriales: form.monturaMateriales,
    tipoMontura: form.tipoMontura,
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `orden-pedido-${form.orderId || "sin-codigo"}`,
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 h-full">
      <div className="flex h-full flex-col rounded-xl bg-beige p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-semibold flex items-center gap-2">
          <div className="w-2 h-6 bg-blue rounded-full" />
          Datos de Orden de Montaje
        </h3>

        <div className="flex flex-1 flex-col space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <BaseInput
              label="Orden ID"
              name="orderId"
              type="text"
              value={form.orderId}
              onChange={onChange}
            />
            <BaseInput
              label="Óptica"
              name="optica"
              type="text"
              value={form.optica}
              onChange={onChange}
            />
            <BaseInput
              label="Fecha"
              name="orderDate"
              type="date"
              value={form.orderDate}
              onChange={onChange}
            />

          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">

            <BaseInput
              label="Nombre"
              name="customerName"
              type="text"
              value={form.customerName}
              onChange={onChange}
            />
            <BaseInput
              label="Celular"
              name="celular"
              type="text"
              value={form.celular}
              onChange={onChange}
            />

            <BaseInput
              label="Dirección"
              name="direccion"
              type="text"
              value={form.direccion}
              onChange={onChange}
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-sm text-gray-700">Medidas</h4>

            <div className="mb-2 grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500">
              <div></div>
              <div>ESF</div>
              <div>CIL</div>
              <div>EJE</div>
              <div>DIP</div>
            </div>

            <div className="mb-2 grid grid-cols-5 items-center gap-2">
              <div className="font-semibold text-sm text-gray-700">OD</div>
              <BaseInput
                name="odEsf"
                type="text"
                value={form.odEsf}
                onChange={onChange}
              />
              <BaseInput
                name="odCil"
                type="text"
                value={form.odCil}
                onChange={onChange}
              />
              <BaseInput
                name="odEje"
                type="text"
                value={form.odEje}
                onChange={onChange}
              />
              <BaseInput
                name="odDip"
                type="text"
                value={form.odDip}
                onChange={onChange}
              />
            </div>

            <div className="grid grid-cols-5 items-center gap-2">
              <div className="font-semibold text-sm text-gray-700">OI</div>
              <BaseInput
                name="oiEsf"
                type="text"
                value={form.oiEsf}
                onChange={onChange}
              />
              <BaseInput
                name="oiCil"
                type="text"
                value={form.oiCil}
                onChange={onChange}
              />
              <BaseInput
                name="oiEje"
                type="text"
                value={form.oiEje}
                onChange={onChange}
              />
              <BaseInput
                name="oiDip"
                type="text"
                value={form.oiDip}
                onChange={onChange}
              />
            </div>
          </div>

          <BaseInput
            label="ADD"
            name="add"
            type="text"
            value={form.add}
            onChange={onChange}
          />

          <div>
            <h4 className="mb-3 font-semibold text-sm text-gray-700">Material del lente</h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {lenteOptions.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue border-gray-300 rounded"
                    checked={form.lenteMateriales.includes(item)}
                    onChange={() => toggleArrayValue("lenteMateriales", item)}
                  />
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-sm text-gray-700">Material de montura</h4>
            <div className="flex flex-wrap gap-3">
              {monturaMaterialOptions.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue border-gray-300 rounded"
                    checked={form.monturaMateriales.includes(item)}
                    onChange={() => toggleArrayValue("monturaMateriales", item)}
                  />
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-sm text-gray-700">Montura</h4>
            <div className="flex gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                <input
                  type="radio"
                  name="tipoMontura"
                  className="w-4 h-4 text-blue border-gray-300"
                  checked={form.tipoMontura === "Nueva"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      tipoMontura: "Nueva",
                    }))
                  }
                />
                <span className="text-sm text-gray-700 font-medium">Nueva</span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                <input
                  type="radio"
                  name="tipoMontura"
                  className="w-4 h-4 text-blue border-gray-300"
                  checked={form.tipoMontura === "Usada"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      tipoMontura: "Usada",
                    }))
                  }
                />
                <span className="text-sm text-gray-700 font-medium">Usada</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
            <BaseInput
              label="Marca"
              name="marca"
              type="text"
              value={form.marca}
              onChange={onChange}
            />

            <BaseInput
              label="Precio"
              name="precio"
              type="number"
              value={form.precio}
              onChange={onChange}
            />
            <BaseTarea
              label="Observaciones"
              name="observaciones"
              value={form.observaciones}
              placeholder="Ingrese observaciones"
              onChange={onChange}
            />
          </div>


          <div>
            <h4 className="mb-3 font-semibold text-sm text-gray-700">Bisel brillante</h4>
            <div className="flex gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                <input
                  type="radio"
                  name="biselBrillante"
                  className="w-4 h-4 text-blue border-gray-300"
                  checked={form.biselBrillante === "SI"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      biselBrillante: "SI",
                    }))
                  }
                />
                <span className="text-sm text-gray-700 font-medium">SI</span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                <input
                  type="radio"
                  name="biselBrillante"
                  className="w-4 h-4 text-blue border-gray-300"
                  checked={form.biselBrillante === "NO"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      biselBrillante: "NO",
                    }))
                  }
                />
                <span className="text-sm text-gray-700 font-medium">NO</span>
              </label>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setOpenPreview(true)}
              className="w-full rounded-lg bg-blue py-3 font-semibold text-white transition hover:bg-blue-dark active:scale-[0.98]"
            >
              Ver PDF
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full rounded-lg bg-blue py-3 font-semibold text-white transition hover:bg-blue-dark active:scale-[0.98]"
            >
              Imprimir / Guardar PDF
            </button>
          </div>
        </div>
      </div>

      <OrderPreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        onDownloadPdf={handlePrint}
        form={orderFormData}
      />

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div ref={printRef}>
          <OrderPrint form={orderFormData} />
        </div>
      </div>
    </div>
  );
};

export default Montaje;
