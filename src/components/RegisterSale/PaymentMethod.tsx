import React from "react";
import { useState, useEffect } from "react";
import { BaseInput } from "@/components/Inputs/BaseInput";
import { CreateLens } from "@/types/products";

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
 
     setFormData({
       ...formData,
       [name]: value,
     });
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
       <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
 
         {/* HEADER */}
         <h2 className="text-xl font-semibold mb-6">Registrar Venta</h2>
 
         {/* 🔥 TABS ESTILO IMAGEN */}
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
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input
               type="text"
               name="amountReceived"
               placeholder="Cantidad en soles"
               value={formData.amountReceived}
               onChange={handleChange}
               className="border rounded-md px-3 py-2"
             />
 
             <select
               name="method"
               value={formData.method}
               onChange={handleChange}
               className="border rounded-md px-3 py-2"
             >
               <option value="">Seleccione</option>
               <option value="cash">Efectivo</option>
               <option value="card">Tarjeta</option>
               <option value="transfer">Transferencia</option>
             </select>
 
             <input
               type="date"
               name="date"
               value={formData.date}
               onChange={handleChange}
               className="border rounded-md px-3 py-2"
             />
           </div>
 
           {/* SOLO CRÉDITO */}
           {paymentType === "credit" && (
             <div>
               <label className="block mb-2 font-medium">
                 Número de Cuotas: {installments}
               </label>
 
               <input
                 type="range"
                 min="2"
                 max="5"
                 value={installments}
                 onChange={(e) => setInstallments(Number(e.target.value))}
                 className="w-full accent-blue-800"
               />
 
               <div className="flex justify-between text-sm text-gray-500">
                 <span>2</span>
                 <span>3</span>
                 <span>4</span>
                 <span>5</span>
               </div>
             </div>
           )}
 
           {/* Buscar Cliente */}
           <input
             type="text"
             name="customerSearch"
             placeholder={
               paymentType === "credit"
                 ? "Buscar o Crear nuevo Cliente"
                 : "Apellidos del cliente"
             }
             value={formData.customerSearch}
             onChange={handleChange}
             className="border rounded-md px-3 py-2 w-full"
           />
 
           {/* Montos */}
           <div>
             <h3 className="font-semibold mb-3">Montos:</h3>
 
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <input
                 type="text"
                 value={`S/ ${formData.total.toFixed(2)}`}
                 disabled
                 className="border rounded-md px-3 py-2 bg-gray-100"
               />
 
               <input
                 type="number"
                 name="payment"
                 value={formData.payment}
                 onChange={handleChange}
                 placeholder="S/ 000.00"
                 className="border rounded-md px-3 py-2"
               />
 
               {paymentType === "cash" ? (
                 <input
                   type="text"
                   value={`S/ ${change.toFixed(2)}`}
                   disabled
                   className="border rounded-md px-3 py-2 bg-gray-100"
                 />
               ) : (
                 <input
                   type="text"
                   value={`S/ ${debt.toFixed(2)}`}
                   disabled
                   className="border rounded-md px-3 py-2 bg-gray-100"
                 />
               )}
             </div>
           </div>
 
           {/* Observaciones */}
           <textarea
             name="observations"
             rows={3}
             value={formData.observations}
             onChange={handleChange}
             placeholder="Ingrese las observaciones"
             className="border rounded-md px-3 py-2 w-full"
           />
 
           {/* Responsable */}
           <input
             type="text"
             name="responsible"
             value={formData.responsible}
             onChange={handleChange}
             placeholder="Nombre Completo"
             className="border rounded-md px-3 py-2 w-full"
           />
 
           {/* BOTONES */}
           <div className="flex justify-end gap-3 pt-4">
             <button className="bg-red-500 text-blue px-5 py-2 rounded-md">
               Cerrar
             </button>
 
             <button className="bg-green-500 text-blue px-5 py-2 rounded-md">
               Registrar Venta
             </button>
           </div>
         </div>
       </div>
     
   );
};

export default PaymentMethod;
