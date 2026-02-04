"use client";

import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductList from "@/components/Products/ProductsList";

const ProductListPage = () => {
  return (
    <main>
      <Breadcrumb
        title="Listado de Productos"
        pages={["productos", "listado"]}
      />
      <ProductList />
    </main>
  );
};

export default ProductListPage;
