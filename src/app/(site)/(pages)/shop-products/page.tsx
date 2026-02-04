import React from "react";
import ShopProducts from "@/components/ShopProducts";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
};

const ShopProductsPage = () => {
  return (
    <main>
      <ShopProducts />
    </main>
  );
};

export default ShopProductsPage;
