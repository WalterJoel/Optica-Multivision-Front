import Sales from "@/components/RegisterSale/Sales";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Sell | NextCommerce Nextjs E-commerce template",
  description: "This is My Sell page for NextCommerce Template",
};

const MySellPage = () => {
  const mockItems = [
    {
      id: 1,
      productName: "Lentes Ray-Ban",
      price: 150,
      discount: 20,
      quantity: 1,
      esf: "-1.25",
      cyl: "-0.50",
      imgs: { thumbnails: ["/products/lentes1.png"] },
    },
    {
      id: 2,
      productName: "Lentes de lectura",
      price: 80,
      discount: 0,
      quantity: 2,
      esf: "+1.00",
      cyl: "0.00",
      imgs: { thumbnails: ["/products/lentes2.png"] },
    },
    {
      id: 3,
      productName: "Lentes con filtro azul",
      price: 120,
      discount: 10,
      quantity: 1,
      esf: "-0.75",
      cyl: "-0.25",
      imgs: { thumbnails: ["/products/lentes3.png"] },
    },
    {
      id: 4,
      productName: "Lentes deportivos",
      price: 200,
      discount: 30,
      quantity: 1,
      esf: "-2.00",
      cyl: "-1.00",
      imgs: { thumbnails: ["/products/lentes4.png"] },
    },
    {
      id: 5,
      productName: "Lentes antirreflejo",
      price: 95,
      discount: 5,
      quantity: 3,
      esf: "+0.50",
      cyl: "-0.25",
      imgs: { thumbnails: ["/products/lentes5.png"] },
    },
    {
      id: 6,
      productName: "Lentes progresivos",
      price: 250,
      discount: 40,
      quantity: 1,
      esf: "-1.75",
      cyl: "-0.75",
      imgs: { thumbnails: ["/products/lentes6.png"] },
    },
    {
      id: 7,
      productName: "Lentes de sol polarizados",
      price: 180,
      discount: 25,
      quantity: 2,
      esf: "0.00",
      cyl: "0.00",
      imgs: { thumbnails: ["/products/lentes7.png"] },
    },
  ];

  return (
    <main className="pt-20">
      <Sales />
    </main>
  );
};

export default MySellPage;
