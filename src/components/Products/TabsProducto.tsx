type Props = {
  tipo: "montura" | "luna" | "accesorio";
  setTipo: (v: any) => void;
};

export default function TabsProducto({ tipo, setTipo }: Props) {
  return (
    <div className="flex border-b border-gray-3 mb-6">
      {["montura", "luna", "accesorio"].map((t) => (
        <button
          key={t}
          onClick={() => setTipo(t as any)}
          className={`px-6 py-3 font-medium border-b-2 duration-200
            ${
              tipo === t
                ? "border-blue text-blue"
                : "border-transparent text-dark-5 hover:text-blue"
            }
          `}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
