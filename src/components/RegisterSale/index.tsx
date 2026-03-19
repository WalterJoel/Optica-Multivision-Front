"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";

const RegisterSale = () => {
  return (
    <>
      <Breadcrumb title={"Registrar Venta"} pages={["registrar venta"]} />

      <section className="overflow-hidden bg-gray-2 py-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 xl:px-8">
          <form>
            <div className="flex flex-col gap-7.5 xl:gap-10">
              <PaymentMethod />
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default RegisterSale;