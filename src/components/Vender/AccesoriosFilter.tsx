"use client";

type Props = {
  filters: any;
  setFilters: (v: any) => void;
};

export default function AccessoryFilters({ filters, setFilters }: Props) {
  return (
    <div className="relative bg-white border border-blue-light-5 rounded-3xl shadow-testimonial p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* 🔍 SEARCH */}
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-light text-sm">
            🔍
          </div>

          <input
            type="text"
            placeholder="Buscar nombre o código..."
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-blue-light-5 text-sm outline-none focus:ring-2 focus:ring-blue-light/40 transition"
          />
        </div>

        {/* PRECIOS */}
        {[
          { label: "S/0-50", min: 0, max: 50 },
          { label: "S/50-100", min: 50, max: 100 },
          { label: "S/100+", min: 100, max: 9999 },
        ].map((p) => {
          const active =
            filters.precioMin === p.min && filters.precioMax === p.max;

          return (
            <button
              key={p.label}
              onClick={() =>
                setFilters({
                  ...filters,
                  precioMin: p.min,
                  precioMax: p.max,
                })
              }
              className={`h-10 px-3 rounded-xl text-xs font-bold border transition
              ${
                active
                  ? "bg-blue-light text-white border-blue-light"
                  : "bg-white border-blue-light-5 text-gray-500 hover:bg-blue-light/10"
              }`}
            >
              {p.label}
            </button>
          );
        })}

        {/*  COLORES FIJOS */}
        <div className="flex items-center gap-2 ml-2">
          {[
            { name: "AZUL", value: "blue" },
            { name: "ROJO", value: "red" },
            { name: "ROSADO", value: "pink" },
            { name: "LILA", value: "purple" },
            { name: "NEGRO", value: "black" },
            { name: "PLOMO", value: "gray" },
          ].map((c) => {
            const active = filters.color === c.value;

            return (
              <button
                key={c.value}
                onClick={() =>
                  setFilters({
                    ...filters,
                    color: active ? "" : c.value,
                  })
                }
                className={`w-5 h-5 rounded-full border transition
                ${active ? "scale-110 ring-2 ring-blue-light" : ""}`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            );
          })}
        </div>

        {/* 🧹 LIMPIAR */}
        <button
          onClick={() =>
            setFilters({
              search: "",
              precioMin: 0,
              precioMax: 9999,
              color: "",
            })
          }
          className="h-10 px-4 rounded-xl text-xs font-bold text-gray-400 ml-auto hover:text-yellow-dark transition"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
