"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `orden-pedido-${form.orderId || "sin-codigo"}`,
  });

  return (
    <section className="overflow-hidden pt-[180px] pb-20 bg-gray-2 min-h-screen">
      <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
        <div className="w-full">
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-stretch xl:gap-8">
            <div
              className={`w-full ${showOrder ? "lg:w-[35%]" : "lg:max-w-[700px]"}`}
            >
              <div className="flex h-full w-full flex-col rounded-xl bg-white p-5 shadow-lg xl:p-6">
                <div className="mb-5 flex items-center">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm">
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

                <div className="mb-5 border-b border-gray-3">
                  <BaseTabs
                    tabs={paymentTabs}
                    activeTab={paymentType}
                    onChange={(value) => setPaymentType(value as PaymentType)}
                  />
                </div>

                <div className="flex flex-1 flex-col space-y-5">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-600">
                      Método de Pago
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => {
                        const active = form.method === method.key;

                        return (
                          <motion.button
                            key={method.key}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                method: method.key,
                              }))
                            }
                            className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 ${
                              active
                                ? "border-blue bg-blue/5"
                                : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={method.icon}
                              alt={method.label}
                              width={36}
                              height={36}
                            />
                            <span className="text-sm">{method.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
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
                    label="Observaciones"
                    name="observaciones"
                    value={form.observaciones}
                    placeholder="Descripción breve"
                    onChange={onChange}
                  />

                  <BaseInput
                    label="Responsable de la venta"
                    name="responsible"
                    type="text"
                    value={form.responsible}
                    onChange={onChange}
                  />

                  <div className="mt-auto pt-2">
                    <button
                      type="submit"
                      className="w-full rounded bg-blue py-3 text-white"
                    >
                      Registrar Venta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showOrder && (
              <div className="w-full lg:w-[65%]">
                <div className="flex h-full flex-col rounded-xl bg-white p-5 shadow-lg xl:p-6">
                  <h3 className="mb-5 text-lg font-semibold">
                    Datos de Orden de Montaje
                  </h3>

                  <div className="flex flex-1 flex-col space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      <h4 className="mb-3 font-semibold">Medidas</h4>

                      <div className="mb-2 grid grid-cols-5 gap-2 text-sm font-semibold">
                        <div></div>
                        <div>ESF</div>
                        <div>CIL</div>
                        <div>EJE</div>
                        <div>DIP</div>
                      </div>

                      <div className="mb-2 grid grid-cols-5 items-center gap-2">
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

                      <div className="grid grid-cols-5 items-center gap-2">
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
                      <h4 className="mb-3 font-semibold">Material del lente</h4>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                      <h4 className="mb-3 font-semibold">
                        Material de montura
                      </h4>
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
                      <h4 className="mb-3 font-semibold">Montura</h4>
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
                    <BaseTarea
                      label="Observaciones"
                      name="observaciones"
                      value={form.observaciones}
                      placeholder="Ingrese observaciones"
                      onChange={onChange}
                    />

                    <div>
                      <h4 className="mb-3 font-semibold">Bisel brillante</h4>
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

                    <div className="mt-auto grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setOpenPreview(true)}
                        className="w-full rounded-lg bg-blue py-3 font-semibold text-white"
                      >
                        Ver PDF
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="w-full rounded-lg bg-blue py-3 font-semibold text-white"
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethod;
