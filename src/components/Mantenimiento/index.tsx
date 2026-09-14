"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";

import UsersTab from "./Usuarios/UsersPage";

import SedesPage from "./Stores/StorePage";
import KitPage from "./Kits/KitPage";

import {
  User,
  Users,
  Building2,
  Boxes,
  CreditCard,
  MoveUpRight,
  ScanEye,
  Package,
  Tags,
  EyeIcon,
} from "lucide-react";

import ClientsPage from "./Clients/ClientsPage";
import AccesoriesPage from "./Accesories/AccesoriesPage";
import EyeglassesPage from "./Eyeglasses/EyeglassesPage";
import DiscountPage from "./Discounts/DiscountPage";
import MovimientoCajaPage from "./MovimientosCaja/MovimientoCajaPage";
import { useSessionUser } from "@/hooks/session";
import LensesPage from "./Lenses/LensesPage";
import { tienePermiso, PERMISOS_PESTAÑAS_MANTENIMIENTO } from "@/commons/permissions";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("sedes");

  //Hooks
  const { fullName, user, role } = useSessionUser();

  const menuButton = (id: string, label: string, Icon: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${activeTab === id ? "text-white bg-blue" : "text-dark-2 bg-gray-1"
        }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <>
      {/* <Breadcrumb title={"Mantenimiento"} pages={["my account"]} /> */}
      <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
        <div className="max-w-[1700px] mx-auto">
          <div className="flex flex-col xl:flex-row gap-7.5 items-stretch">
            {/* SIDEBAR */}
            <div className="xl:w-[350px] w-full bg-white rounded-xl shadow-1 flex-shrink-0">
              <div className="flex xl:flex-col">
                <div className="hidden   lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden">
                    <Image
                      src="/images/users/user-04.jpg"
                      alt="user"
                      width={64}
                      height={64}
                    />
                  </div>

                  <div>
                    <p className="font-medium text-dark mb-0.5">{fullName}</p>
                    <p className="text-custom-xs">
                      Miembro con rol {user?.role}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-7.5 xl:p-9">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.clientes, role) && menuButton("clientes", "Clientes", User)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.sedes, role) && menuButton("sedes", "Sedes", Building2)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.users, role) && menuButton("users", "Usuarios", Users)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.movimiento, role) && menuButton("movimiento", "Movimientos de Caja", MoveUpRight)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.combos, role) && menuButton("combos", "Combos", Boxes)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.accesories, role) && menuButton("accesories", "Accesorios", Package)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.eyeglasses, role) && menuButton("eyeglasses", "Monturas", ScanEye)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.lens, role) && menuButton("lens", "Lentes", EyeIcon)}
                    {tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.discounts, role) && menuButton("discounts", "Descuentos", Tags)}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENT (Lazy tab rendering) */}
            <div className="flex-grow flex flex-col">
              <div className="w-full bg-white rounded-xl shadow-1 flex-grow flex flex-col">
                {activeTab === "clientes" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.clientes, role) && <ClientsPage />}
                {activeTab === "sedes" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.sedes, role) && <SedesPage />}
                {activeTab === "users" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.users, role) && <UsersTab />}
                {activeTab === "movimiento" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.movimiento, role) && <MovimientoCajaPage />}
                {activeTab === "combos" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.combos, role) && <KitPage />}
                {activeTab === "accesories" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.accesories, role) && <AccesoriesPage />}
                {activeTab === "eyeglasses" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.eyeglasses, role) && <EyeglassesPage />}
                {activeTab === "discounts" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.discounts, role) && <DiscountPage />}
                {activeTab === "lens" && tienePermiso(PERMISOS_PESTAÑAS_MANTENIMIENTO.lens, role) && <LensesPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
