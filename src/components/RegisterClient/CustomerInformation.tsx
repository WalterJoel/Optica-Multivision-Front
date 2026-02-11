import React from "react";
import { useState } from "react";
import { BaseInput } from "@/components/Inputs/BaseInput";
import { CreateLens } from "@/types/products";

const CustomerInformation = () => {

  const [formData, setFormData] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    address: "",
    background: "",
    esf: "",
    cyl: "",
    eje: "",
    esf1: "",
    cyl1: "",
    eje1: "",
    dip: "",
    add: "",
    optometricAssistant: "",

  });

  //arrow function
  const handleChange = (e) => {
    alert (e.target.name)
    const { name, value } = e.target;

    setFormData({
    ...formData,
    [name]: value,
    });

  }
  
  return (

    <div className="flex flex-col lg:flex-row gap-8 xl:gap-11 items-stretch">

      {/* COLUMNA */}
      <div className="flex-1 w-full">

        <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
          Información del cliente
        </h2>
        
        <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">

          {/* DNI + Fecha Registro */}
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
            
            <div className="w-full">
               
               <label htmlFor="dni" className="block mb-2.5">
                DNI <span className="text-red">*</span>
               </label>

               <input
                type="text"
                name="dni"
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
               />
            </div>

            <div className="w-full">
               <label htmlFor="fechaRegistro" className="block mb-2.5 text-sm font-medium">
                Fecha de Registro <span className="text-red">*</span>
               </label>

          <input
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
            id="fechaRegistro"
            name="fechaRegistro"
            className="w-full rounded-md border border-gray-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

      </div>

      {/* Nombres + Apellidos */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">

        <div className="w-full">
          <label htmlFor="firstName" className="block mb-2.5">
            Nombres <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Jhon"
            className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="w-full">
          <label htmlFor="lastName" className="block mb-2.5">
            Apellidos <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

      </div>

      {/* Fecha Nacimiento + Teléfono + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-5">

        <div>
          <label className="block mb-2.5">
            Fecha de Nacimiento <span className="text-red">*</span>
          </label>

          <input
            type="date"
            name="birthDate"
            className="w-full rounded-md border border-gray-300 py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div>
          <label className="block mb-2.5">
            Teléfono <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="123456789"
            className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div>
          <label className="block mb-2.5">
            Correo Electrónico <span className="text-red">*</span>
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

      </div>

      {/* Dirección + Antecedentes */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">

        <div className="w-full">
          <label className="block mb-2.5">
            Dirección
          </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={5}
            className="rounded-md border border-gray-300 w-full p-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="w-full">
          <label className="block mb-2.5">
            Antecedentes
          </label>

          <textarea
            name="background"
            value={formData.background}
            onChange={handleChange}
            rows={5}
            className="rounded-md border border-gray-300 w-full p-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  </div>
      
      <div className="flex-1 w-full">
    <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
    Especificaciones de las Medidas
  </h2>

  <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">

    {/* OJOS */}
    <div className="flex flex-col xl:flex-row gap-8 mb-8">

      {/* OJO DERECHO */}
      <div className="flex-1">
        <label className="inline-block mb-4 text-sm font-semibold text-gray-700">
          Ojo Derecho <span className="text-red">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block mb-2.5">ESF *</label>
            <input
              type="text"
              name="esf"
              value={formData.esf}
              onChange={handleChange}
              className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div>
            <label className="block mb-2.5">CYL *</label>
            <input
              type="text"
              name="cyl"
              value={formData.cyl}
              onChange={handleChange}
              className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div>
            <label className="block mb-2.5">EJE *</label>
            <input
              type="text"
              name="eje"
              value={formData.eje}
              onChange={handleChange}
              className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
      </div>

      {/* OJO IZQUIERDO */}
      <div className="flex-1">
        <label className="inline-block mb-4 text-sm font-semibold text-gray-700">
          Ojo Izquierdo <span className="text-red">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block mb-2.5">ESF *</label>
            <input
              type="text"
              name="esf1"
              value={formData.esf1}
              onChange={handleChange}
              className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div>
            <label className="block mb-2.5">CYL *</label>
            <input
              type="text"
              name="cyl1"
              value={formData.cyl1}
              onChange={handleChange}
              className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div>
            <label className="block mb-2.5">EJE *</label>
            <input
              type="text"
              name="eje1"
              value={formData.eje1}
              onChange={handleChange}
              className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
      </div>

    </div>

    {/* DIP / ADD */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
      <div>
        <label className="block mb-2.5">DIP *</label>
        <input
          type="text"
          name="dip"
          value={formData.dip}
          onChange={handleChange}
          className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
        />
      </div>

      <div>
        <label className="block mb-2.5">ADD *</label>
        <input
          type="text"
          name="add"
          value={formData.add}
          onChange={handleChange}
          className="rounded-md border border-gray-300 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
        />
      </div>
    </div>

    {/* ENCARGADO */}
    <div>
      <label className="block mb-2.5">
        Encargado de Mediciones
      </label>

      <textarea
        name="optometricAssistant"
        rows={4}
        value={formData.optometricAssistant}
        onChange={handleChange}
        className="rounded-md border border-gray-300 w-full p-5 outline-none focus:ring-2 focus:ring-blue/20"
      />
    </div>

  </div>

   <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Process to Checkout
                </button>

</div>


</div>

  );
};

export default CustomerInformation;
