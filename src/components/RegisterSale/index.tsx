"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";

const RegisterSale = () => {
  return (
    <>
      <Breadcrumb title={"Registrar Venta"} pages={["registrar venta"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form>
            
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
                         
              {/* <!-- Customer Information --> */}
              <PaymentMethod />

            </div> 
            
          </form>
        </div>
      </section>
    </>
  );
};

export default RegisterSale;
