"use client";

import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductList from "@/components/Products/ProductsList";

const ProductListPage = () => {
  return (
    <main>
      <ProductList stock={true} />
    </main>
  );
};

export default ProductListPage;
