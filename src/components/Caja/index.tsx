"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

const MiniTable = ({
  titulo,
  data,
  type,
}: {
  titulo: string;
  data: any[];
  type: "ingreso" | "egreso";
}) => (
  <div className="bg-white rounded-[24px] border border-blue-light-5 shadow-testimonial overflow-hidden flex flex-col transition-all hover:shadow-2">
    {/* Header Sutil con acento Blue Light */}
    <div className="px-6 py-5 flex justify-between items-center border-b border-gray-2 bg-white">
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${type === "ingreso" ? "bg-green" : "bg-red"} animate-pulse`}
        />
        <h3 className="text-[12px] font-black text-dark-2 uppercase tracking-[2px]">
          {titulo}
        </h3>
      </div>
      <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all">
        <Search size={14} className="text-blue-light-2" />
        <input
          type="text"
          placeholder="Filtrar historial..."
          className="bg-transparent text-[11px] ml-2 outline-none w-28 text-dark-3 font-medium placeholder:text-gray-5"
        />
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-blue-light-6/50 text-[10px] font-black text-blue uppercase tracking-widest">
            <th className="py-4 px-7">Concepto / Responsable</th>
            <th className="py-4 px-6 text-center">Metodo</th>
            <th className="py-4 px-7 text-right">Monto Neto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-2 text-[12px]">
          {data.map((m) => (
            <tr
              key={m.id}
              className="hover:bg-blue-light-6/30 transition-colors group"
            >
              <td className="py-5 px-7">
                <div className="flex flex-col">
                  <span className="font-bold text-dark group-hover:text-blue transition-colors">
                    {m.descripcion}
                  </span>
                  <span className="text-[10px] font-bold text-gray-5 mt-1 uppercase tracking-tighter">
                    {m.createdAt}{" "}
                    <span className="mx-1 text-blue-light-4">•</span>
                    <span className="text-blue-light font-black italic underline decoration-blue-light-4 underline-offset-2">
                      @{m.usuario}
                    </span>
                  </span>
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-light-5 shadow-sm">
                  {m.metodo === "EFECTIVO" ? (
                    <Wallet size={12} className="text-yellow-dark" />
                  ) : (
                    <CreditCard size={12} className="text-blue-light" />
                  )}
                  <span className="text-[10px] font-black text-dark-4 uppercase">
                    {m.metodo}
                  </span>
                </div>
              </td>
              <td className="py-5 px-7 text-right">
                <div className="flex flex-col items-end">
                  <span
                    className={`text-[15px] font-black tracking-tighter ${type === "ingreso" ? "text-green" : "text-red"}`}
                  >
                    S/ {m.monto.toFixed(2)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Footer Fino */}
    <div className="px-7 py-4 bg-white border-t border-gray-2 flex justify-between items-center">
      <span className="text-[10px] font-bold text-gray-4 uppercase tracking-[2px]">
        Página <span className="text-dark">01</span> de 12
      </span>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 transition-all">
          <ChevronLeft size={16} />
        </button>
        <button className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default function CajaPremiumFino() {
  const mockData = [
    {
      id: 1,
      monto: 1250.0,
      metodo: "EFECTIVO",
      descripcion: "Lunas High Index + Montura Boss",
      createdAt: "10:30 AM",
      usuario: "jorge.v",
    },
    {
      id: 2,
      monto: 420.5,
      metodo: "TARJETA",
      descripcion: "Tratamiento Antireflex Blue",
      createdAt: "11:15 AM",
      usuario: "admin.m",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-16 px-8 font-euclid-circular-a text-dark">
      <div className="max-w-[1400px] mx-auto">
        {/* HEADER MINIMALISTA PREMIUM */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-14 gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-16 h-16 rounded-[24px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10 group hover:border-blue-light transition-all">
                <TrendingUp
                  size={30}
                  className="text-blue-light group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-[2px] bg-yellow-dark" />
                <p className="text-[11px] font-black text-blue-light uppercase tracking-[4px]">
                  Financial Core
                </p>
              </div>
              <h1 className="text-4xl font-black text-dark tracking-tighter uppercase leading-none">
                Flujo de <span className="text-blue-light italic">Caja</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-white border border-gray-3 text-dark-2 font-bold text-[11px] hover:border-blue-light transition-all shadow-sm uppercase tracking-widest">
              <FileText size={15} className="text-blue-light" /> Exportar
            </button>
            <button className="flex items-center gap-3 px-8 py-3.5 rounded-[18px] bg-blue-light text-white font-black text-[11px] shadow-2 shadow-blue-light/20 hover:bg-blue transition-all active:scale-95 uppercase tracking-widest">
              <Plus size={18} strokeWidth={3} /> Nuevo Registro
            </button>
          </div>
        </header>

        {/* BALANCE CARDS - Glassmorphism & Soft Colors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Balance con Yellow Dark accent */}
          <div className="bg-white rounded-[35px] p-9 border border-blue-light-5 shadow-testimonial relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-dark/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-yellow-dark/10" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-[11px] font-black text-blue-light-2 uppercase tracking-[3px] mb-3">
                  Balance Consolidado
                </p>
                <h2 className="text-5xl font-black text-dark tracking-tighter mb-8">
                  <span className="text-blue-light-3 text-3xl font-medium mr-1">
                    S/
                  </span>
                  2,840.50
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-beige-dark/30 rounded-[20px] p-4 border border-white">
                  <p className="text-[9px] font-black text-gray-5 uppercase mb-1">
                    Efectivo
                  </p>
                  <p className="text-[16px] font-black text-yellow-dark tracking-tight">
                    S/ 1,200.00
                  </p>
                </div>
                <div className="bg-blue-light-6/50 rounded-[20px] p-4 border border-white">
                  <p className="text-[9px] font-black text-gray-5 uppercase mb-1">
                    Bancos
                  </p>
                  <p className="text-[16px] font-black text-blue-light tracking-tight">
                    S/ 1,640.50
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ingresos Card */}
          <div className="bg-white rounded-[35px] p-9 border border-blue-light-5 shadow-testimonial flex flex-col justify-between hover:border-green-light-3 transition-all">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-green-light-6 flex items-center justify-center text-green">
                <ArrowUpRight size={24} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-green uppercase px-2 py-1 bg-green-light-6 rounded-lg">
                  +2.4%
                </p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[11px] font-black text-gray-4 uppercase tracking-[2px] mb-1">
                Ingresos de Hoy
              </p>
              <p className="text-3xl font-black text-dark tracking-tighter">
                S/ 4,120.00
              </p>
            </div>
          </div>

          {/* Egresos Card */}
          <div className="bg-white rounded-[35px] p-9 border border-blue-light-5 shadow-testimonial flex flex-col justify-between hover:border-red-light-3 transition-all">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-red-light-6 flex items-center justify-center text-red">
                <ArrowDownLeft size={24} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-red uppercase px-2 py-1 bg-red-light-6 rounded-lg">
                  -1.1%
                </p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[11px] font-black text-gray-4 uppercase tracking-[2px] mb-1">
                Egresos de Hoy
              </p>
              <p className="text-3xl font-black text-dark tracking-tighter">
                S/ 1,280.00
              </p>
            </div>
          </div>
        </div>

        {/* HISTORIAL SECCION */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[13px] font-black text-dark uppercase tracking-[4px]">
            Operaciones <span className="text-blue-light">Recientes</span>
          </h2>
          <div className="h-[1px] flex-grow bg-gray-2" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <MiniTable
            titulo="Historial de Ingresos"
            data={mockData}
            type="ingreso"
          />
          <MiniTable
            titulo="Historial de Egresos"
            data={mockData}
            type="egreso"
          />
        </div>
      </div>
    </div>
  );
}
