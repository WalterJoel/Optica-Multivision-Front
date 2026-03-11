"use client";

import { useState } from "react";
import { List, CirclePlus } from "lucide-react";
import { BaseTabs } from "@/components/Common/Inputs";

import CreateLensDiscount from "./CreateLensDiscount";
// import ListClients from "./CreateAccesoryDiscount";

export default function DiscountPage() {
  const [tab, setTab] = useState("lente");

  const tabsData = [
    { key: "lente", label: "Lentes", icon: <CirclePlus size={22} /> },
    { key: "accesorio", label: "Accesorios", icon: <List size={22} /> },
    { key: "montura", label: "Monturas", icon: <List size={22} /> },
  ];

  return (
    <div className="pt-6 pb-12 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-8 ">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
      </div>

      {tab === "lente" && <CreateLensDiscount />}
      {/* {tab === "accesorio" && <CreateClient />}
      {tab === "montura" && <ListClients />} */}
    </div>
  );
}
