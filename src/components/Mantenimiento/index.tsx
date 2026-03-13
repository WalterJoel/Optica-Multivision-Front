"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import AddressModal from "./AddressModal";
import Orders from "../Orders";
import UsersTab from "./Usuarios/UsersPage";
import SedesPage from "./Stores/StorePage";
import KitPage from "./Kits/KitPage";
import {
  LayoutDashboard,
  ScanEye,
  User,
  BoomBox,
  DollarSign,
} from "lucide-react";
import ClientsPage from "./Clients/ClientsPage";
import AccesoriesPage from "./Accesories/AccesoriesPage";
import EyeglassesPage from "./Eyeglasses/EyeglassesPage";
import DiscountPage from "./Discounts/DiscountPage";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("clientes");
  const [addressModal, setAddressModal] = useState(false);

  const openAddressModal = () => {
    setAddressModal(true);
  };

  const closeAddressModal = () => {
    setAddressModal(false);
  };

  return (
    <>
      <Breadcrumb title={"My Account"} pages={["my account"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 xl:px-10">
          <div className="flex flex-col xl:flex-row gap-7.5 items-stretch">
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
                    <p className="font-medium text-dark mb-0.5">
                      James Septimus
                    </p>
                    <p className="text-custom-xs">Member Since Sep 2020</p>
                  </div>
                </div>

                <div className="p-4 sm:p-7.5 xl:p-9">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                    <button
                      onClick={() => setActiveTab("clientes")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "clientes"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <User size={25} />
                      Clientes
                    </button>

                    <button
                      onClick={() => setActiveTab("sedes")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "sedes"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        className="fill-current"
                      >
                        <path d="M12 2L2 7v13h20V7L12 2zm0 2.2L19.6 8H4.4L12 4.2z" />
                      </svg>
                      Sedes
                    </button>

                    <button
                      onClick={() => setActiveTab("users")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "users"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5z" />
                      </svg>
                      Usuarios
                    </button>

                    <button
                      onClick={() => setActiveTab("combos")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "combos"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <ScanEye size={25} />
                      Combos
                    </button>

                    <button
                      onClick={() => setActiveTab("downloads")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "downloads"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.5074 15.1306C11.3772 15.273 11.193 15.3542 11 15.3542C10.807 15.3542 10.6229 15.273 10.4926 15.1306L6.82594 11.1202C6.56973 10.8399 6.5892 10.4051 6.86943 10.1489C7.14966 9.89265 7.58452 9.91212 7.84073 10.1923L10.3125 12.8958V2.75C10.3125 2.3703 10.6203 2.0625 11 2.0625C11.3797 2.0625 11.6875 2.3703 11.6875 2.75V12.8958L14.1593 10.1923C14.4155 9.91212 14.8503 9.89265 15.1306 10.1489C15.4108 10.4051 15.4303 10.8399 15.1741 11.1202L11.5074 15.1306Z"
                          fill=""
                        />
                        <path
                          d="M3.4375 13.75C3.4375 13.3703 3.1297 13.0625 2.75 13.0625C2.37031 13.0625 2.0625 13.3703 2.0625 13.75V13.8003C2.06248 15.0539 2.06247 16.0644 2.16931 16.8591C2.28025 17.6842 2.51756 18.3789 3.06932 18.9307C3.62108 19.4824 4.3158 19.7198 5.1409 19.8307C5.93562 19.9375 6.94608 19.9375 8.1997 19.9375H13.8003C15.0539 19.9375 16.0644 19.9375 16.8591 19.8307C17.6842 19.7198 18.3789 19.4824 18.9307 18.9307C19.4824 18.3789 19.7198 17.6842 19.8307 16.8591C19.9375 16.0644 19.9375 15.0539 19.9375 13.8003V13.75C19.9375 13.3703 19.6297 13.0625 19.25 13.0625C18.8703 13.0625 18.5625 13.3703 18.5625 13.75C18.5625 15.0658 18.561 15.9835 18.468 16.6759C18.3775 17.3485 18.2121 17.7047 17.9584 17.9584C17.7047 18.2121 17.3485 18.3775 16.6759 18.4679C15.9835 18.561 15.0658 18.5625 13.75 18.5625H8.25C6.9342 18.5625 6.01652 18.561 5.32411 18.4679C4.65148 18.3775 4.29529 18.2121 4.04159 17.9584C3.78789 17.7047 3.62249 17.3485 3.53205 16.6759C3.43896 15.9835 3.4375 15.0658 3.4375 13.75Z"
                          fill=""
                        />
                      </svg>
                      Downloads
                    </button>

                    <button
                      onClick={() => setActiveTab("accesories")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "accesories"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <BoomBox size={25} />
                      Accesorios
                    </button>

                    <button
                      onClick={() => setActiveTab("eyeglasses")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "eyeglasses"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <ScanEye size={25} />
                      Monturas
                    </button>

                    <button
                      onClick={() => setActiveTab("discounts")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "discounts"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <DollarSign size={25} />
                      Descuentos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "sedes" ? "block" : "hidden"
                }`}
              >
                <SedesPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "clientes" ? "block" : "hidden"
                }`}
              >
                <ClientsPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "users" ? "block" : "hidden"
                }`}
              >
                <UsersTab />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "combos" ? "block" : "hidden"
                }`}
              >
                <KitPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10 ${
                  activeTab === "downloads" ? "block" : "hidden"
                }`}
              >
                <p>You don&apos;t have any download</p>
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "accesories" ? "block" : "hidden"
                }`}
              >
                <AccesoriesPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "eyeglasses" ? "block" : "hidden"
                }`}
              >
                <EyeglassesPage />
              </div>

              <div
                className={`w-full bg-white rounded-xl shadow-1 ${
                  activeTab === "discounts" ? "block" : "hidden"
                }`}
              >
                <DiscountPage />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddressModal isOpen={addressModal} closeModal={closeAddressModal} />
    </>
  );
};

export default MyAccount;
