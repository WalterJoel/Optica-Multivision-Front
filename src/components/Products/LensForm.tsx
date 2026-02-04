export default function LensForm() {
  const inputClass =
    "rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20";

  return (
    <form>
      {/* Marca & Material */}
      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        <div className="w-full">
          <label className="block mb-2.5">
            Marca <span className="text-red">*</span>
          </label>
          <input
            type="text"
            placeholder="Marca del lente"
            className={inputClass}
          />
        </div>

        <div className="w-full">
          <label className="block mb-2.5">
            Material <span className="text-red">*</span>
          </label>
          <input
            type="text"
            placeholder="Material del lente"
            className={inputClass}
          />
        </div>
      </div>

      {/* Imagen */}
      <div className="mb-5">
        <label className="block mb-2.5">
          Cargar imagen <span className="text-red">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-dark-5
          file:mr-4 file:py-2.5 file:px-5
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-blue file:text-white
          hover:file:bg-blue-dark"
        />
      </div>

      {/* Precios */}
      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        <div className="w-full">
          <label className="block mb-2.5">
            Precio Serie 1 <span className="text-red">*</span>
          </label>
          <input type="number" placeholder="0.00" className={inputClass} />
        </div>

        <div className="w-full">
          <label className="block mb-2.5">
            Precio Serie 2 <span className="text-red">*</span>
          </label>
          <input type="number" placeholder="0.00" className={inputClass} />
        </div>

        <div className="w-full">
          <label className="block mb-2.5">
            Precio Serie 3 <span className="text-red">*</span>
          </label>
          <input type="number" placeholder="0.00" className={inputClass} />
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
      >
        Guardar
      </button>
    </form>
  );
}
