import React from "react";
import { Metadata } from "next";
import RegisterProduct from "@/components/Products";
export const metadata: Metadata = {
  title: "Checkout Page | NextCommerce Nextjs E-commerce template",
  description: "This is Checkout Page for NextCommerce Template",
  // other metadata
};

const RegisterProductPage = () => {
  return (
    <main>
      <RegisterProduct />
    </main>
  );
};

export default RegisterProductPage;
