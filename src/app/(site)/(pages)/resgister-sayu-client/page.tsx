import React from "react";
import RegisterSayuClient from "@/components/RegisterSayuClient";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Checkout Page | NextCommerce Nextjs E-commerce template",
  description: "This is Checkout Page for NextCommerce Template",
  // other metadata
};

const RegisterSayuClientPage = () => {
  return (
    <main>
      <RegisterSayuClient />
    </main>
  );
};

export default RegisterSayuClientPage;
