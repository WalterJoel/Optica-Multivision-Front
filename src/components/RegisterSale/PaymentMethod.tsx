import React, { useState, useEffect } from "react";
import { BaseInput } from "@/components/Inputs/BaseInput";

const PaymentMethod = () => {
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("credit");
  const [installments, setInstallments] = useState(2);
  const [showOrder, setShowOrder] = useState(false);

  const [formData, setFormData] = useState({
    // PAYMENT
    amountReceived: "",
    method: "",
    date: new Date().toISOString().slice(0, 10),
    customerSearch: "",
    total: 125,
    payment: "",
    observations: "",
    responsible: "",

    // ORDER
    orderId: "",
    optica: "",
    orderDate: new Date().toISOString().slice(0, 10),
    materialLente: "",
    materialMontura: "",
    monturaEstado: "",
    marca: "",
    biselBrillante: "no",
    precio: "",
    orderObservations: "",
    nombre: "",
    celular: "",
    direccion: "",
    od_esf: "",
    od_cil: "",
    od_eje: "",
    od_dip: "",
    oi_esf: "",
    oi_cil: "",
    oi_eje: "",
    oi_dip: "",
    add: "",
  });

  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    <div>
      <div>
        <div className="flex-1 w-full">

          {/* Checkbox Orden de Pedido */}
          <div className="flex items-center gap-2 mb-4">
            <input
             type="checkbox"
             id="showOrder"
             checked={showOrder}
             onChange={() => setShowOrder(!showOrder)}
             className="w-4 h-4"
             />
            <label htmlFor="showOrder" className="text-sm font-medium">
              Montaje
            </label>
          </div>

        </div>
      </div>

    <div className={`w-full flex flex-col ${showOrder ? "lg:flex-row" : ""} gap-8 xl:gap-11 items-stretch`}>
      
      {/* COLUMNA */}
      <div className="flex-1 w-full">

        <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
          Modalidad de Pago
        </h2>

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
              >Al Contado
            </button>

            <button
              type="button"
              onClick={() => setPaymentType("credit")}
              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                paymentType === "credit"
                  ? "bg-blue-800 text-blue shadow"
                  : "text-gray-600"
              }`}
              >Al Crédito
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
  <label className="block mb-3 font-medium text-sm text-gray-700">
    Elige el número de cuotas:
  </label>

  <div className="flex gap-3">
    {[2, 3].map((num) => (
      <button
        key={num}
        type="button"
        onClick={() => setInstallments(num)}
        className={`
          w-12 h-12 text-sm font-semibold transition-all duration-200
          ${
            installments === num
              ? "bg-blue text-white shadow-input scale-105"
              : "rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          }
        `}
      >
        {num}
      </button>
    ))}
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
                    paymentType === "cash" ? change.toFixed(2) : debt.toFixed(2)
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
                className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
              >
                Registrar Venta
              </button>
            </div>
          </div>
        </div>
      </div>

      {showOrder && (
      <div className="flex-1 w-full">
        <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
          Orden de Pedido
        </h2>

        <div className="bg-white w-full rounded-xl shadow-lg p-6">
          {/* ID */}
          <div className="flex justify-end">
            <BaseInput
              label="Orden de Pedido (ID)"
              name="orderId"
              type="text"
              value={formData.orderId}
              onChange={handleChange}
            />
          </div>

          {/* Óptica y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              label="Óptica"
              name="optica"
              type="text"
              value={formData.optica}
              onChange={handleChange}
            />

            <BaseInput
              label="Celular"
              name="celular"
              type="text"
              value={formData.celular}
              onChange={handleChange}
            />
          </div>

          <BaseInput
            label="Dirección"
            name="direccion"
            type="text"
            value={formData.direccion}
            onChange={handleChange}
          />

          {/* TABLA MEDIDAS */}
          <div>
            <h3 className="font-semibold mb-3">Medidas</h3>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th></th>
                    <th>ESF</th>
                    <th>CIL</th>
                    <th>EJE</th>
                    <th>DIP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold">OD</td>
                    <td>
                      <input
                        name="od_esf"
                        value={formData.od_esf}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        name="od_cil"
                        value={formData.od_cil}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        name="od_eje"
                        value={formData.od_eje}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        name="od_dip"
                        value={formData.od_dip}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="font-semibold">OI</td>
                    <td>
                      <input
                        name="oi_esf"
                        value={formData.oi_esf}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        name="oi_cil"
                        value={formData.oi_cil}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        name="oi_eje"
                        value={formData.oi_eje}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        name="oi_dip"
                        value={formData.oi_dip}
                        onChange={handleChange}
                        className="w-full p-1 border"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">ADD:</span>
              <input
                type="text"
                className="flex-1 border-0 border-b border-black focus:outline-none"
              />
            </div>
          </div>

          {/* MATERIAL DEL LENTE */}
          <div>
            <h3 className="font-semibold mb-3">Material del Lente</h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                "Poly AR",
                "Poly Blue Green",
                "Poly Blue",
                "Poly Chromic Blue AR Gris",
                "NK Blue",
                "NK Chromic Ar Gris",
                "NK Chromic Blue AR Gris",
                "Crystal Blue",
                "Fotoblue Crystal Blue",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="materialLente"
                    value={item}
                    checked={formData.materialLente === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* MATERIAL MONTURA */}
          <div>
            <h3 className="font-semibold mb-3">Material de Montura</h3>

            <div className="flex flex-wrap gap-4 text-sm">
              {["Carey", "Acetato", "Metal", "TR-90", "Aluminio"].map(
                (item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="materialMontura"
                      value={item}
                      checked={formData.materialMontura === item}
                      onChange={handleChange}
                    />
                    {item}
                  </label>
                ),
              )}
            </div>

            <div className="flex gap-6 mt-3 text-sm">
              {["Nueva", "Usada"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="monturaEstado"
                    value={item}
                    checked={formData.monturaEstado === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <BaseInput
            label="Marca"
            name="marca"
            type="text"
            value={formData.marca}
            onChange={handleChange}
          />

          {/* OBSERVACIONES + PRECIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Observaciones</label>
              <textarea
                name="orderObservations"
                rows={4}
                value={formData.orderObservations}
                onChange={handleChange}
                className="w-full border p-2 mt-2"
              />
            </div>

            <BaseInput
              label="Precio"
              name="precio"
              type="number"
              placeholder="0.00"
              value={formData.precio}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
          </div>

          {/* Bisel */}
          <div className="flex gap-6 text-sm">
            <span className="font-semibold">Bisel brillante:</span>
            {["si", "no"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="biselBrillante"
                  value={item}
                  checked={formData.biselBrillante === item}
                  onChange={handleChange}
                />
                {item.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
      </div>
       )} 
    </div>

  </div>
  );
};

export default PaymentMethod;
