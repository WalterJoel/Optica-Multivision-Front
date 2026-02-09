import React, { useState } from "react";

const MeasurementSpecifications = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Especificaciones de las Medidas
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">

        {/* OJOS */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">

          {/* OJO DERECHO */}
          <div className="flex-1">
            <label className="inline-block mb-4 text-sm font-semibold text-gray-700">
              Ojo Derecho <span className="text-red">*</span>
            </label>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
              <div className="w-full">
                <label className="block mb-2.5">
                  ESF <span className="text-red">*
                  </span>
                </label>
                
                <input
                  type="text"
                  name="esf"
                  value={formData.esf}
                  onChange={handleChange}
                  placeholder="ESF"
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2.5">CYL *</label>
                <input
                  type="text"
                  name="cyl"
                  value={formData.cyl}
                  onChange={handleChange}
                  placeholder="CYL"
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2.5">EJE *</label>
                <input
                  type="text"
                  name="eje"
                  value={formData.eje}
                  onChange={handleChange}
                  placeholder="EJE"
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>
            </div>
          </div>

          {/* OJO IZQUIERDO */}
          <div className="flex-1">
            <label className="inline-block mb-4 text-sm font-semibold text-gray-700">
              Ojo Izquierdo <span className="text-red">*</span>
            </label>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
              <div className="w-full">
                <label className="block mb-2.5">ESF *</label>
                <input
                  type="text"
                  name="esf1"
                  value={formData.esf1}
                  onChange={handleChange}
                  placeholder="ESF"
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2.5">CYL *</label>
                <input
                  type="text"
                  name="cyl1"
                  value={formData.cyl1}
                  onChange={handleChange}
                  placeholder="CYL"
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2.5">EJE *</label>
                <input
                  type="text"
                  name="eje1"
                  value={formData.eje1}
                  onChange={handleChange}
                  placeholder="EJE"
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DIP / ADD */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="flex-1">
            <label className="block mb-2.5">DIP *</label>
            <input
              type="text"
              name="dip"
              value={formData.dip}
              onChange={handleChange}
              placeholder="DIP"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2.5">ADD *</label>
            <input
              type="text"
              name="add"
              value={formData.add}
              onChange={handleChange}
              placeholder="ADD"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="mb-5">
          <label className="block mb-2.5">Encargado de Mediciones</label>
          <textarea
            name="optometricAssistant"
            rows={5}
            value={formData.optometricAssistant}
            onChange={handleChange}
            placeholder="Notas adicionales"
            className="rounded-md border border-gray-3 bg-gray-1 w-full p-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

      </div>
    </div>
  );
};

export default MeasurementSpecifications;
