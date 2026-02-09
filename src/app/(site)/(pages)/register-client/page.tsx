import React from "react";
import RegisterClient from "@/components/RegisterClient";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register Client Page | NextCommerce Nextjs E-commerce template",
  description: "This is Checkout Page for NextCommerce Template",
  // other metadata
};

const RegisterClientPage = () => {
  return (
    <main>
      <RegisterClient />
    </main>
  );
};

export default RegisterClientPage;
