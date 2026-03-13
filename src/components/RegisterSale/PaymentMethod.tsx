"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BaseInput, BaseTabs, BaseTarea } from "@/components/Common/Inputs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchClient } from "@/hooks/clients";
import OrderPrint from "./OrderPrint";
import OrderPreviewModal from "./OrderPreviewModal";

type PaymentType = "cash" | "credit";

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

const PaymentMethod = () => {
  const [openPreview, setOpenPreview] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("credit");
  const [showOrder, setShowOrder] = useState(false);
  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);
  const [showClientList, setShowClientList] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);

  const { searchClients, clients, loading } = useSearchClient();

  const paymentTabs = [
    { key: "cash", label: "Al Contado" },
    { key: "credit", label: "Al Crédito" },
  ];

  const paymentMethods = [
    { key: "card", label: "Interbancario", icon: "/images/cart/int.png" },
    { key: "cash", label: "Efectivo", icon: "/images/cart/efectivo.png" },
    { key: "yape", label: "Yape", icon: "/images/cart/yape.png" },
    { key: "plin", label: "Plin", icon: "/images/cart/plin.png" },
  ];

  const [form, setForm] = useState({
    amountReceived: "",
    method: "",
    date: new Date().toISOString().slice(0, 10),
    customerSearch: "",
    total: 125,
    payment: "",
    observaciones: "",
    responsible: "",

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

    if (name === "customerSearch") {
      searchClients(value);
      setShowClientList(true);
    }
  };

  const selectClient = (client: any) => {
    const fullName = client.nombres
      ? `${client.nombres} ${client.apellidos ?? ""}`.trim()
      : client.numeroDoc;

    setForm((prev) => ({
      ...prev,
      customerSearch: fullName,
      customerName: fullName,
      celular: client.telefono ?? "",
      direccion: client.direccion ?? "",
    }));

    setShowClientList(false);
  };

  useEffect(() => {
    const payment = parseFloat(String(form.payment)) || 0;
    const total = Number(form.total) || 0;

    if (paymentType === "cash") {
      setChange(payment - total);
      setDebt(0);
    } else {
      setDebt(total - payment);
      setChange(0);
    }
  }, [form.payment, form.total, paymentType]);

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
    customerName: form.customerName || form.customerSearch,
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

  const downloadOrderPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`orden-pedido-${form.orderId || "sin-codigo"}.pdf`);
  };

  return (
    <div>
      <div className="w-full flex flex-col lg:flex-row gap-8 xl:gap-11 items-start">
        <div className="flex-1 w-full">
          <div className="bg-white w-full rounded-xl shadow-lg p-6 space-y-5">
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center cursor-pointer gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-600">
                  ¿Requiere Montaje?
                </span>

                <input
                  type="checkbox"
                  checked={showOrder}
                  onChange={() => setShowOrder(!showOrder)}
                />
              </label>
            </div>

            <div className="border-b border-gray-3 mb-6">
              <BaseTabs
                tabs={paymentTabs}
                activeTab={paymentType}
                onChange={(value) => setPaymentType(value as PaymentType)}
              />
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-3 block">
                  Método de Pago
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => {
                    const active = form.method === method.key;

                    return (
                      <motion.button
                        key={method.key}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            method: method.key,
                          }))
                        }
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${
                          active ? "border-blue bg-blue/5" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={method.icon}
                          alt={method.label}
                          width={40}
                          height={40}
                        />
                        <span className="text-sm">{method.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <BaseInput
                  label="Cliente"
                  name="customerSearch"
                  type="text"
                  placeholder="Buscar por DNI, nombre o apellido"
                  value={form.customerSearch}
                  onChange={onChange}
                />

                {showClientList && (
                  <div className="absolute z-50 bg-white border rounded-lg shadow w-full mt-1 max-h-60 overflow-auto">
                    {loading && (
                      <div className="p-3 text-sm text-gray-500">
                        Buscando...
                      </div>
                    )}

                    {!loading && clients.length === 0 && (
                      <div className="p-3 text-sm text-gray-500">
                        Sin resultados
                      </div>
                    )}

                    {clients.map((client: any) => (
                      <div
                        key={client.id}
                        onClick={() => selectClient(client)}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {client.nombres
                          ? `${client.nombres} ${client.apellidos ?? ""}`
                          : client.numeroDoc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseInput
                  label="Total"
                  name="total"
                  type="text"
                  value={`S/ ${form.total}`}
                  onChange={() => {}}
                  readOnly
                />

                <BaseInput
                  label="Pago"
                  name="payment"
                  type="number"
                  value={form.payment}
                  onChange={onChange}
                />

                <BaseInput
                  label={paymentType === "cash" ? "Cambio" : "Deuda"}
                  name="result"
                  type="text"
                  value={`S/ ${
                    paymentType === "cash"
                      ? change.toFixed(2)
                      : debt.toFixed(2)
                  }`}
                  onChange={() => {}}
                  readOnly
                />
              </div>

              <BaseTarea
                label="Descripción"
                name="observaciones"
                value={form.observaciones}
                placeholder="Descripción breve"
                onChange={onChange}
              />

              <BaseInput
                label="Responsable"
                name="responsible"
                type="text"
                value={form.responsible}
                onChange={onChange}
              />

              <button
                type="submit"
                className="w-full bg-blue text-white py-3 rounded"
              >
                Registrar Venta
              </button>
            </div>
          </div>
        </div>

        {showOrder && (
          <div className="lg:w-[42%] w-full space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
              <h3 className="text-lg font-semibold">
                Datos de Orden de Montaje
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  label="Orden ID"
                  name="orderId"
                  type="text"
                  value={form.orderId}
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

              <BaseInput
                label="Óptica"
                name="optica"
                type="text"
                value={form.optica}
                onChange={onChange}
              />

              <BaseInput
                label="Nombre"
                name="customerName"
                type="text"
                value={form.customerName}
                onChange={onChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h4 className="font-semibold mb-3">Medidas</h4>

                <div className="grid grid-cols-5 gap-2 text-sm font-semibold mb-2">
                  <div></div>
                  <div>ESF</div>
                  <div>CIL</div>
                  <div>EJE</div>
                  <div>DIP</div>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-2 items-center">
                  <div className="font-semibold">OD</div>
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

                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="font-semibold">OI</div>
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
                <h4 className="font-semibold mb-3">Material del lente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {lenteOptions.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={form.lenteMateriales.includes(item)}
                        onChange={() =>
                          toggleArrayValue("lenteMateriales", item)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Material de montura</h4>
                <div className="flex flex-wrap gap-4">
                  {monturaMaterialOptions.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={form.monturaMateriales.includes(item)}
                        onChange={() =>
                          toggleArrayValue("monturaMateriales", item)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Montura</h4>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="tipoMontura"
                      checked={form.tipoMontura === "Nueva"}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          tipoMontura: "Nueva",
                        }))
                      }
                    />
                    Nueva
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="tipoMontura"
                      checked={form.tipoMontura === "Usada"}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          tipoMontura: "Usada",
                        }))
                      }
                    />
                    Usada
                  </label>
                </div>
              </div>

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

              <div>
                <h4 className="font-semibold mb-3">Bisel brillante</h4>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="biselBrillante"
                      checked={form.biselBrillante === "SI"}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          biselBrillante: "SI",
                        }))
                      }
                    />
                    SI
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="biselBrillante"
                      checked={form.biselBrillante === "NO"}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          biselBrillante: "NO",
                        }))
                      }
                    />
                    NO
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOpenPreview(true)}
                  className="w-full bg-gray-800 text-black py-3 rounded-lg font-semibold"
                >
                  Ver PDF
                </button>

                <button
                  type="button"
                  onClick={downloadOrderPdf}
                  className="w-full bg-blue-600 text-black py-3 rounded-lg font-semibold"
                >
                  Imprimir / Guardar PDF
                </button>
              </div>
            </div>

            <OrderPreviewModal
              open={openPreview}
              onClose={() => setOpenPreview(false)}
              onDownloadPdf={downloadOrderPdf}
              form={orderFormData}
            />

            <div
              ref={printRef}
              style={{
                position: "fixed",
                top: 0,
                left: "-10000px",
                width: "210mm",
                height: "297mm",
                background: "#fff",
              }}
            >
              <OrderPrint form={orderFormData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;