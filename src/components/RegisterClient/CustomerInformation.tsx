import React from "react";
import { useState } from "react";

const CustomerInformation = () => {

  const [formData, setFormData] = useState({
    dni: "",
    firstname: "",
    lastName: "",
    telephone: "",
    email: "",
    address: "",
    background: ""

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
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Información del cliente
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
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
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
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
              className="w-full rounded-md
              border border-gray-300 bg-white py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue/20"         
             />
           </div>
 
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              Nombres <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Jhon"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
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
              placeholder="Deo"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-5">

          <div className="w-full">
             <label htmlFor="fechaRegistro" className="block mb-2.5 text-sm font-medium">
               Fecha de Nacimiento <span className="text-red">*</span>
             </label>

             <input
              type="date"
              id="fechaRegistro"
              name="fechaRegistro"
              className="w-full rounded-md
              border border-gray-300 bg-white py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue/20"         
             />
           </div>

          <div className="w-full">
            <label htmlFor="telephone" className="block mb-2.5">
              Teléfono <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="telephone"
              id="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="123456789"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label htmlFor="email" className="block mb-2.5">
              Correo Electrónico <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>


         <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
           <div className="w-full">
                <label htmlFor="address" className="block mb-2.5">
                      Dirección
                </label>

                <textarea
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                ></textarea>
             </div>
          

        
           <div className="w-full">
                <label htmlFor="background" className="block mb-2.5">
                      Antecedentes
                </label>

                <textarea
                      name="background"
                      id="background"
                      value={formData.background}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                ></textarea>
              </div>
          </div>

        <button
            type="submit"
            className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            Save
          </button>
      </div>
    </div>
  );
};

export default CustomerInformation;
