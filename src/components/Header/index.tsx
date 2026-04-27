"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { menuData } from "./menuData";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { LogoMultivision } from "../Common/LogoMultivision";
import { signOut } from "next-auth/react";
import Chat from "@/components/Chat";
import {
  LogOut,
  MessageCircleMore,
  ShoppingCart,
  Home,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useSessionUser } from "@/hooks/session";

const Header = () => {
  const { user, foto, fullName, accessToken } = useSessionUser();
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { openCartModal } = useCartModalContext();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  // FUNCIÓN DE LOGOUT INTEGRADA
  const handleLogout = async () => {
    localStorage.clear(); // Limpia tokens y persistencia local
    await signOut({
      callbackUrl: "/signin", // Redirige a signin después de limpiar cookies
      redirect: true,
    });
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY >= 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-[999] transition-all duration-500 ${
        stickyMenu
          ? "bg-white/80 backdrop-blur-lg py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-white/20"
          : "bg-gradient-to-b from-slate-50/50 to-transparent py-5"
      }`}
    >
      <div className="mt-5 max-w-[1700px] mx-auto px-4 md:px-16 flex items-center justify-between gap-4">
        {/* 1. LOGO */}
        <Link
          href="/"
          className="shrink-0 transition-transform active:scale-95"
        >
          <LogoMultivision size="sm" subtitle={false} />
        </Link>

        {/* 2. MENU DATA - DISEÑO CAPSULA PREMIUM */}
        <nav className="hidden xl:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-1 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm w-full max-w-3xl">
            {menuData.map((item, i) => (
              <li key={i} className="flex-1 text-center relative group">
                {item.submenu ? (
                  <>
                    {/* ITEM CON SUBMENU */}
                    <span className="block py-2.5 text-[11px] font-black text-slate-500 hover:text-blue hover:bg-white rounded-xl transition-all uppercase tracking-tighter hover:shadow-sm cursor-pointer">
                      {item.title}
                    </span>

                    {/* DROPDOWN SIMPLE */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-white  rounded-xl shadow-lg p-2 min-w-[160px] z-50">
                      {item.submenu.map((sub, j) => (
                        <Link
                          key={j}
                          href={sub.path}
                          className="block px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-blue hover:bg-blue/5 rounded-lg"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.path || "#"}
                    className="block py-2.5 text-[11px] font-black text-slate-500 hover:text-blue hover:bg-white rounded-xl transition-all uppercase tracking-tighter hover:shadow-sm"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. ACCIONES */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/60 backdrop-blur-md border border-white rounded-full p-1 shadow-sm">
            {/* SEDE */}
            <div className="flex items-center gap-2 px-4 border-r border-slate-200/50">
              <div className="bg-yellow-dark/20 p-1.5 rounded-full">
                <Home size={16} className="text-yellow-dark" strokeWidth={3} />
              </div>
              <span className="text-sm font-black text-slate-800 hidden md:inline">
                {user?.sedeNombre || ""}
              </span>
            </div>

            {/* PERFIL DROPDOWN */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-white rounded-full transition-all group"
              >
                <div className="relative h-10 w-10">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center text-white text-xs font-black shadow-md overflow-hidden ring-2 ring-white">
                    {foto || fullName?.charAt(0)}
                  </div>
                </div>
                <div className="hidden lg:flex flex-col items-start leading-none ml-1">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                    {fullName}
                  </span>
                  <span className="text-[9px] font-bold text-blue/70 uppercase">
                    {/* {user.role} */}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-300 ml-1 ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white p-2 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={handleLogout} // ACCIÓN DE LOGOUT ASIGNADA
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-[11px] uppercase tracking-widest group"
                  >
                    <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <LogOut size={16} strokeWidth={3} />
                    </div>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CHAT PREMIUM */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-3 rounded-full transition-all border shadow-sm ${
              chatOpen
                ? "bg-blue text-white border-blue shadow-blue/20"
                : "bg-white text-slate-400 border-white hover:border-blue hover:text-blue"
            }`}
          >
            <MessageCircleMore size={20} strokeWidth={2.5} />
          </button>

          {/* CARRITO CON GLOW */}
          <button
            onClick={openCartModal}
            className="flex items-center gap-4 px-6 py-3 bg-yellow-dark text-dark rounded-full hover:scale-105 transition-all shadow-[0_10px_20px_rgba(255,183,0,0.2)] active:scale-95"
          >
            <div className="relative">
              <ShoppingCart size={22} strokeWidth={3} />
              <span className="absolute -top-2.5 -right-2.5 bg-dark text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-yellow-dark">
                {product.length}
              </span>
            </div>
            <span className="text-base font-[1000] tracking-tighter hidden sm:inline">
              ${totalPrice}
            </span>
          </button>

          {/* MENÚ MÓVIL */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-3 bg-white border border-slate-100 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL PREMIUM */}
      {/* {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 absolute w-full left-0 animate-in slide-in-from-top duration-300 shadow-2xl">
          <nav className="p-6">
            <ul className="flex flex-col gap-3">
              {menuData.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.path || "#"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 text-xs font-black text-slate-700 hover:bg-blue/5 hover:text-blue rounded-2xl uppercase tracking-widest transition-all border border-transparent hover:border-blue/10"
                  >
                    {item.title}
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )} */}
    </header>
  );
};

export default Header;
