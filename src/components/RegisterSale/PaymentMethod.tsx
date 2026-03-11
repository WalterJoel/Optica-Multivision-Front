"use client";

import React, { useState, useEffect } from "react";
import { BaseInput, BaseTabs, BaseTarea } from "@/components/Common/Inputs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchClient } from "@/hooks/clients";

const PaymentMethod = () => {
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("credit");
  const [showOrder, setShowOrder] = useState(false);

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

  const [form, setform] = useState({
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
    marca: "",
    precio: "",
    celular: "",
    direccion: "",
  });

  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);
  const [showClientList, setShowClientList] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setform((prev) => ({
      ...prev,
      [name]: value,
    }));

    /* ejecutar búsqueda */

    if (name === "customerSearch") {
      searchClients(value);
      setShowClientList(true);
    }
  };

  /* seleccionar cliente */

  const selectClient = (client: any) => {
    setform((prev) => ({
      ...prev,
      customerSearch: client.nombres
        ? `${client.nombres} ${client.apellidos ?? ""}`
        : client.numeroDoc,
    }));

    setShowClientList(false);
  };

  /* CALCULOS */

  useEffect(() => {
    const payment = parseFloat(form.payment) || 0;

    if (paymentType === "cash") {
      setChange(payment - form.total);
    } else {
      setDebt(form.total - payment);
    }
  }, [form.payment, paymentType, form.total]);

  return (
    <div>
      <div className="w-full flex flex-col lg:flex-row gap-8 xl:gap-11 items-stretch">
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

            {/* TABS */}

            <div className="border-b border-gray-3 mb-6">
              <BaseTabs
                tabs={paymentTabs}
                activeTab={paymentType}
                onChange={(value) => setPaymentType(value as "cash" | "credit")}
              />
            </div>

            <div className="space-y-5">
              {/* METODO PAGO */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-3 block">
                  Método de Pago
                </label>

                <div className="grid grid-cols-4 gap-4">
                  {paymentMethods.map((method) => {
                    const active = form.method === method.key;

                    return (
                      <motion.button
                        key={method.key}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setform((prev) => ({
                            ...prev,
                            method: method.key,
                          }))
                        }
                        className={`p-4 rounded-xl border ${
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

              {/* CLIENTE */}

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

              {/* MONTOS */}

              <div className="grid grid-cols-3 gap-4">
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
                    paymentType === "cash" ? change.toFixed(2) : debt.toFixed(2)
                  }`}
                  onChange={() => {}}
                  readOnly
                />
              </div>

              {/* OBSERVACIONES */}

              <BaseTarea
                label="Descripción"
                name="atributo"
                value={form.observaciones}
                placeholder="Descripción breve del accesorio"
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

        {/* COLUMNA ORDEN */}

        {showOrder && (
          <div className="lg:w-[35%] w-full">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
