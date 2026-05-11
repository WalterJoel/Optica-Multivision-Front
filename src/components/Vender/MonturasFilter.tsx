"use client";

type Props = {
  filters: any;
  setFilters: (v: any) => void;
};

export default function MonturaFilters({ filters, setFilters }: Props) {
  return (
    <div className="relative bg-white border border-blue-light-5 rounded-3xl shadow-testimonial p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* SEARCH */}
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-light text-sm">
            🔍
          </div>

          <input
            type="text"
            placeholder="Buscar marca, material..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-blue-light-5 text-sm outline-none focus:ring-2 focus:ring-blue-light/40 transition"
          />
        </div>

        {/* SEXO */}
        <select
          value={filters.sexo}
          onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
          className="h-10 px-3 rounded-xl border border-blue-light-5 text-sm bg-white"
        >
          <option value="">Sexo</option>
          <option value="HOMBRE">Hombre</option>
          <option value="MUJER">Mujer</option>
          <option value="UNISEX">Unisex</option>
        </select>

        {/* FORMA */}
        <select
          value={filters.formaFacial}
          onChange={(e) =>
            setFilters({ ...filters, formaFacial: e.target.value })
          }
          className="h-10 px-3 rounded-xl border border-blue-light-5 text-sm bg-white"
        >
          <option value="">Forma</option>
          <option value="OVALADO">Ovalado</option>
          <option value="REDONDO">Redondo</option>
          <option value="CUADRADO">Cuadrado</option>
        </select>

        {/* LIMPIAR */}
        <button
          onClick={() =>
            setFilters({
              sexo: "",
              formaFacial: "",
              precioMin: 0,
              precioMax: 9999,
              search: "",
            })
          }
          className="h-10 px-4 rounded-xl text-xs font-bold text-gray-400 ml-auto"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
