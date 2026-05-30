"use client";

import { useState } from "react";
import { List, CirclePlus } from "lucide-react";
import { BaseTabs } from "@/components/Common/Inputs";

import AlCredito from "./AlCredito";
import AlContado from "./AlContado";

export default function EyeglassesPage() {
  const [tab, setTab] = useState("contado");

  const tabsData = [
    { key: "contado", label: "Contado", icon: <CirclePlus size={22} /> },
    { key: "credito", label: "Crédito", icon: <List size={22} /> },
  ];

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">

        <div className="border-b border-gray-3 mb-8 ">
          <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
        </div>

        {tab === "contado" && <AlContado />}
        {tab === "credito" && <AlCredito />}
      </div>
    </div>
  );
}