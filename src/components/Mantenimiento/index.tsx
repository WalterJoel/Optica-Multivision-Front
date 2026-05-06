"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";

import UsersTab from "./Usuarios/UsersPage";
import CajaPage from "./Caja/CajaPage";
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
} from "lucide-react";

import ClientsPage from "./Clients/ClientsPage";
import AccesoriesPage from "./Accesories/AccesoriesPage";
import EyeglassesPage from "./Eyeglasses/EyeglassesPage";
import DiscountPage from "./Discounts/DiscountPage";
import MovimientoCajaPage from "./MovimientosCaja/MovimientoCajaPage";
import { useSessionUser } from "@/hooks/session";
import LensesPage from "./Lenses/LensesPage";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("clientes");

  //Hooks
  const { fullName, user } = useSessionUser();

  const menuButton = (id: string, label: string, Icon: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
        activeTab === id ? "text-white bg-blue" : "text-dark-2 bg-gray-1"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <>
      <Breadcrumb title={"Mantenimiento"} pages={["my account"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 xl:px-10">
          <div className="flex flex-col xl:flex-row gap-7.5 items-stretch">
            {/* SIDEBAR */}
            <div className="xl:w-[350px] w-full bg-white rounded-xl shadow-1 flex-shrink-0">
              <div className="flex xl:flex-col">
                <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
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
                    {menuButton("clientes", "Clientes", User)}
                    {menuButton("sedes", "Sedes", Building2)}
                    {menuButton("users", "Usuarios", Users)}

                    {menuButton("abrir-caja", "Caja", CreditCard)}
                    {menuButton(
                      "movimiento",
                      "Movimientos de Caja",
                      MoveUpRight,
                    )}

                    {menuButton("combos", "Combos", Boxes)}

                    {menuButton("accesories", "Accesorios", Package)}
                    {menuButton("eyeglasses", "Monturas", ScanEye)}
                    {menuButton("discounts", "Descuentos", Tags)}
                    {menuButton("lens", "Lentes", Tags)}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-grow">
              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "sedes" ? "block" : "hidden"}`}
              >
                <SedesPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "clientes" ? "block" : "hidden"}`}
              >
                <ClientsPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "users" ? "block" : "hidden"}`}
              >
                <UsersTab />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "abrir-caja" ? "block" : "hidden"}`}
              >
                <CajaPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "movimiento" ? "block" : "hidden"}`}
              >
                <MovimientoCajaPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "combos" ? "block" : "hidden"}`}
              >
                <KitPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "accesories" ? "block" : "hidden"}`}
              >
                <AccesoriesPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "eyeglasses" ? "block" : "hidden"}`}
              >
                <EyeglassesPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "discounts" ? "block" : "hidden"}`}
              >
                <DiscountPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${activeTab === "lens" ? "block" : "hidden"}`}
              >
                <LensesPage />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
