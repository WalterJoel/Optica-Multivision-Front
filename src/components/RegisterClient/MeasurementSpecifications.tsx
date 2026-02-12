import React from "react";
import { useState } from "react";
import { BaseInput } from "@/components/Inputs/BaseInput";
import { CreateLens } from "@/types/products";

const MeasurementSpecifications = () => {

  const [formData, setFormData] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    address: "",
    background: "",
    birthDate: "",
    fechaRegistro: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
            
            <BaseInput
              label="DNI"
              name="dni"
              type="text"
              placeholder="12345678"
              value={formData.dni}
              onChange={handleChange}
              required
            />

            <BaseInput
              label="Fecha de Registro"
              name="fechaRegistro"
              type="datetime-local"
              value={formData.fechaRegistro}
              onChange={handleChange}
              required
            />

          </div>

          {/* Nombres + Apellidos */}
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">

            <BaseInput
              label="Nombres"
              name="firstName"
              type="text"
              placeholder="Jhon"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <BaseInput
              label="Apellidos"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

          </div>

          {/* Fecha Nacimiento + Teléfono + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-5">

            <BaseInput
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />

            <BaseInput
              label="Teléfono"
              name="telephone"
              type="text"
              placeholder="123456789"
              value={formData.telephone}
              onChange={handleChange}
              required
            />

            <BaseInput
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

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

                <BaseInput
                  label="ESF"
                  name="esf"
                  type="text"
                  value={formData.esf}
                  onChange={handleChange}
                  required
                />

                <BaseInput
                  label="CYL"
                  name="cyl"
                  type="text"
                  value={formData.cyl}
                  onChange={handleChange}
                  required
                />

                <BaseInput
                  label="EJE"
                  name="eje"
                  type="text"
                  value={formData.eje}
                  onChange={handleChange}
                  required
                />

              </div>
            </div>

            {/* OJO IZQUIERDO */}
            <div className="flex-1">
              <label className="inline-block mb-4 text-sm font-semibold text-gray-700">
                Ojo Izquierdo <span className="text-red">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <BaseInput
                  label="ESF"
                  name="esf1"
                  type="text"
                  value={formData.esf1}
                  onChange={handleChange}
                  required
                />

                <BaseInput
                  label="CYL"
                  name="cyl1"
                  type="text"
                  value={formData.cyl1}
                  onChange={handleChange}
                  required
                />

                <BaseInput
                  label="EJE"
                  name="eje1"
                  type="text"
                  value={formData.eje1}
                  onChange={handleChange}
                  required
                />

              </div>
            </div>

          </div>

          {/* DIP / ADD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

            <BaseInput
              label="DIP"
              name="dip"
              type="text"
              value={formData.dip}
              onChange={handleChange}
              required
            />

            <BaseInput
              label="ADD"
              name="add"
              type="text"
              value={formData.add}
              onChange={handleChange}
              required
            />

          </div>

          {/* ENCARGADO */}
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
            <BaseInput
              label="Encargado de Mediciones"
              name="optometricAssistant"
              type="text"
              placeholder="Ej. Juan Pérez García"
              value={formData.optometricAssistant}
              onChange={handleChange}
              required
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

export default MeasurementSpecifications;
