"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<number | null>(null);
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

  const toggleMobileSubmenu = (id: number) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === id ? null : id);
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
      className={`fixed left-0 top-0 w-full z-[999] transition-all duration-500 ${stickyMenu
        ? "bg-white/80 backdrop-blur-lg py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-white/20"
        : "bg-gradient-to-b from-slate-50/50 to-transparent py-5"
        }`}
    >
      {/* Thin dual-color premium accent line at the very top of the viewport */}
      <div className="absolute top-0 left-0 w-full h-[4px] flex z-[1000]">
        <div className="w-1/2 h-full bg-blue shadow-[0_0_8px_rgba(30,64,175,0.4)]" />
        <div className="w-1/2 h-full bg-yellow shadow-[0_0_8px_rgba(255,183,0,0.4)]" />
      </div>

      <div className="mt-5 max-w-[1700px] mx-auto px-4 md:px-16 flex items-center justify-between gap-4">
        {/* 1. LOGO */}
        <Link
          href="/"
          className="shrink-0 transition-transform active:scale-95"
        >
          <LogoMultivision size="sm" subtitle={false} />
        </Link>

        {/* 2. MENU DATA - DISEÑO CAPSULA PREMIUM DUAL BORDER */}
        <nav className="hidden xl:flex flex-1 items-center justify-center max-w-[800px] w-full mx-auto">
          <div 
            className="relative p-[1.5px] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full"
            style={{ backgroundImage: "linear-gradient(to right, #1976D2 50%, #FBBF24 50%)" }}
          >
            {/* Nav content */}
            <ul className="relative flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-[14px] w-full">
              {menuData.map((item, i) => {
                const isActive = pathname === item.path || (item.submenu && item.submenu.some(sub => pathname === sub.path));
                return (
                  <li key={i} className="flex-1 text-center relative group">
                    {item.submenu ? (
                      <>
                        <span className={`block py-2 text-[10.5px] font-black uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
                          isActive 
                            ? "text-blue bg-blue/5 shadow-[inset_0_1px_2px_rgba(30,64,175,0.05)] border border-blue/10" 
                            : "text-slate-500 hover:text-blue hover:bg-slate-50 border border-transparent"
                        }`}>
                          <span className="flex items-center justify-center gap-1">
                            {item.title}
                            <ChevronDown size={11} className="opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                          </span>
                        </span>

                        {/* Dropdown with premium slide/fade animation */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                          <div 
                            className="p-[1.5px] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-w-[170px]"
                            style={{ backgroundImage: "linear-gradient(to right, #1976D2 50%, #FBBF24 50%)" }}
                          >
                            <div className="bg-white rounded-[10px] p-1.5 w-full">
                              {item.submenu.map((sub, j) => {
                                const isSubActive = pathname === sub.path;
                                return (
                                  <Link
                                    key={j}
                                    href={sub.path}
                                    className={`block px-3.5 py-2 text-[10.5px] font-bold rounded-lg transition-all text-left uppercase tracking-tight ${
                                      isSubActive 
                                        ? "text-blue bg-blue/5 font-black" 
                                        : "text-slate-600 hover:text-blue hover:bg-slate-50"
                                    }`}
                                  >
                                    {sub.title}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.path || "#"}
                        className={`block py-2 text-[10.5px] font-black uppercase tracking-tight rounded-xl transition-all ${
                          isActive 
                            ? "text-blue bg-blue/5 shadow-[inset_0_1px_2px_rgba(30,64,175,0.05)] border border-blue/10" 
                            : "text-slate-500 hover:text-blue hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
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
            className={`p-3 rounded-full transition-all border shadow-sm ${chatOpen
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
              S/. {totalPrice}
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

      {/* MENÚ MÓVIL PREMIUM CON DISEÑO DE ALTA GAMA */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900/40 backdrop-blur-sm fixed inset-0 top-[76px] z-[998] transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="bg-white/95 backdrop-blur-xl border-t border-slate-100 absolute w-full left-0 shadow-2xl p-6 rounded-b-[2rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dual color accent under top border */}
            <div className="absolute top-0 left-0 w-full h-[3px] flex">
              <div className="w-1/2 h-full bg-blue" />
              <div className="w-1/2 h-full bg-yellow" />
            </div>

            <nav className="relative pt-2">
              <ul className="flex flex-col gap-2">
                {menuData.map((item, i) => {
                  const isActive = pathname === item.path || (item.submenu && item.submenu.some(sub => pathname === sub.path));
                  const hasSubmenu = !!item.submenu;
                  const isSubmenuOpen = mobileSubmenuOpen === item.id;

                  return (
                    <li key={i} className="w-full">
                      {hasSubmenu ? (
                        <div className="flex flex-col w-full">
                          <button
                            onClick={() => toggleMobileSubmenu(item.id)}
                            className={`flex items-center justify-between w-full p-3.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all border ${
                              isActive
                                ? "bg-blue/5 text-blue border-blue/20"
                                : "text-slate-700 bg-slate-50/50 border-slate-100 hover:bg-slate-100"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
                              {item.title}
                            </span>
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-300 ${isSubmenuOpen ? "rotate-180 text-blue" : "text-slate-400"}`} 
                            />
                          </button>
                          
                          {/* Submenu Accordion */}
                          <div className={`overflow-hidden transition-all duration-300 ${isSubmenuOpen ? "max-h-60 mt-1.5 opacity-100" : "max-h-0 opacity-0"}`}>
                            <ul className="pl-4 pr-2 py-1.5 flex flex-col gap-1.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                              {item.submenu!.map((sub, j) => {
                                const isSubActive = pathname === sub.path;
                                return (
                                  <li key={j}>
                                    <Link
                                      href={sub.path}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={`flex items-center justify-between p-3 text-[11px] font-bold rounded-xl uppercase tracking-wider transition-all ${
                                        isSubActive
                                          ? "text-blue bg-white shadow-sm"
                                          : "text-slate-600 hover:text-blue hover:bg-white"
                                      }`}
                                    >
                                      {sub.title}
                                      {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-blue" />}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.path || "#"}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-3.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all border ${
                            isActive
                              ? "bg-blue/5 text-blue border-blue/20 shadow-sm"
                              : "text-slate-700 bg-slate-50/50 border-transparent hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />}
                            {item.title}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blue" : "bg-slate-300"}`} />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
