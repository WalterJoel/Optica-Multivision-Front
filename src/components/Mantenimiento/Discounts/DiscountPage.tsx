"use client";

import { useState } from "react";
import { List, CirclePlus } from "lucide-react";
import { BaseTabs } from "@/components/Common/Inputs";

import CreateLensDiscount from "./CreateLensDiscount";
import CreateAccessoryDiscount from "./CreateAccessoryDiscount";
import CreateMonturaDiscount from "./CreateMonturaDiscount";
import ListDiscounts from "./ListDiscounts";

export default function DiscountPage() {
  const [tab, setTab] = useState("lente");

  const tabsData = [
    { key: "lente", label: "Descuento Lentes", icon: <CirclePlus size={22} /> },
    { key: "accesorio", label: "Descuento Accesorios", icon: <CirclePlus size={22} /> },
    { key: "montura", label: "Descuento Monturas", icon: <CirclePlus size={22} /> },
    { key: "lista", label: "Lista de Descuentos", icon: <List size={22} /> },
  ];

  return (
    <div className="pt-6 pb-12 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-8 ">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
      </div>

      {tab === "lente" && <CreateLensDiscount />}
      {tab === "accesorio" && <CreateAccessoryDiscount />}
      {tab === "montura" && <CreateMonturaDiscount />}
      {tab === "lista" && <ListDiscounts />}
    </div>
  );
}
