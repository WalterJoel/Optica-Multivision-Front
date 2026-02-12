import React, { useState, useEffect } from "react";
import { BaseInput } from "@/components/Inputs/BaseInput";

const PaymentMethod = () => {
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("credit");
  const [installments, setInstallments] = useState(2);

  const [formData, setFormData] = useState({
    amountReceived: "",
    method: "",
    date: new Date().toISOString().slice(0, 10),
    customerSearch: "",
    total: 125,
    payment: "",
    observations: "",
    responsible: "",
  });

  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const payment = parseFloat(formData.payment) || 0;

    if (paymentType === "cash") {
      setChange(payment - formData.total);
    } else {
      setDebt(formData.total - payment);
    }
  }, [formData.payment, paymentType, formData.total]);

  return (
    <div className="bg-white w-full rounded-xl shadow-lg p-6">

      {/* Tabs */}
      <div className="bg-gray-200 p-1 rounded-lg flex mb-6">
        <button
          type="button"
          onClick={() => setPaymentType("cash")}
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            paymentType === "cash"
              ? "bg-blue-800 text-blue shadow"
              : "text-gray-600"
          }`}
        >
          Al Contado
        </button>

        <button
          type="button"
          onClick={() => setPaymentType("credit")}
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            paymentType === "credit"
              ? "bg-blue-800 text-blue shadow"
              : "text-gray-600"
          }`}
        >
          Al Crédito
        </button>
      </div>

      <div className="space-y-5">
        {/* Cantidad / Método / Fecha */}
        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseInput
            label="Cantidad Recibida"
            name="amountReceived"
            type="number"
            placeholder="0.00"
            value={formData.amountReceived}
            onChange={handleChange}
            min={0}
            step="0.01"
            required
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-600">
              Método de Pago
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none"
            >
              <option value="">Seleccione</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>

          <BaseInput
            label="Fecha"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* Crédito */}
        {paymentType === "credit" && (
          <div>
            <label className="block mb-2 font-medium">
              Número de Cuotas: {installments}
            </label>

            <input
              type="range"
              min="2"
              max="3"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="w-full accent-blue-800"
            />

            <div className="flex justify-between text-sm text-gray-500">
              <span>2</span>
              <span>3</span>
            </div>
          </div>
        )}

        {/* Cliente */}
        <BaseInput
          label="Cliente"
          name="customerSearch"
          type="text"
          placeholder={
            paymentType === "credit"
              ? "Buscar o Crear nuevo Cliente"
              : "Apellidos del cliente"
          }
          value={formData.customerSearch}
          onChange={handleChange}
        />

        {/* Montos */}
        <div>
          <h3 className="font-semibold mb-3">Montos:</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseInput
              label="Total"
              name="total"
              type="text"
              value={`S/ ${formData.total.toFixed(2)}`}
              onChange={() => {}}
              readOnly
            />

            <BaseInput
              label="Pago"
              name="payment"
              type="number"
              placeholder="0.00"
              value={formData.payment}
              onChange={handleChange}
              min={0}
              step="0.01"
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
        </div>

        {/* Observaciones */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-600">
            Observaciones
          </label>
          <textarea
            name="observations"
            rows={3}
            value={formData.observations}
            onChange={handleChange}
            placeholder="Ingrese las observaciones"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none"
          />
        </div>

        {/* Responsable */}
        <BaseInput
          label="Responsable"
          name="responsible"
          type="text"
          placeholder="Nombre Completo"
          value={formData.responsible}
          onChange={handleChange}
        />

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
          type="submit"
          className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5">
            Cerrar
          </button>
          
          <button 
          type="submit"
          className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5">
            Registrar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
