import React from "react";
import RegisterClient from "@/components/RegisterSale";

import { Metadata } from "next";
import RegisterSale from "@/components/RegisterSale";
export const metadata: Metadata = {
  title: "Register Sale Page | NextCommerce Nextjs E-commerce template",
  description: "This is Checkout Page for NextCommerce Template",
  // other metadata
};

const RegisterSalePage = () => {
  return (
    <main>
      <RegisterSale />
    </main>
  );
};

export default RegisterSalePage;
