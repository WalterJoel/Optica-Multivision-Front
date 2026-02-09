"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomerInformation from "./CustomerInformation";
import MeasurementSpecifications from "./MeasurementSpecifications";

const RegisterClient = () => {
  return (
    <>
      <Breadcrumb title={"Registrar Cliente"} pages={["registrar cliente"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- left --> */}
              <div className="lg:max-w-[670px] w-full">
                
                {/* <!-- Customer Information --> */}
                <CustomerInformation />

              </div>

               <div className="max-w-[670px] w-full">
                {/* <!-- rigth --> */}
                 <div className="lg:max-w-[670px] w-full">
                
                  {/* <!-- Measurement Specifications --> */}
                  <MeasurementSpecifications />

                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Process to Checkout
                </button>

              </div> 
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default RegisterClient;
