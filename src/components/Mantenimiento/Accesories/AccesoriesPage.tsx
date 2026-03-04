"use client";

import { useState } from "react";
import { List, CirclePlus } from "lucide-react";
import { BaseTabs } from "@/components/Common/Inputs";

import CreateAccesory from "./CreateAccesory";
import ListAccesories from "./ListAccesories";

export default function AccesoriesPage() {
  const [tab, setTab] = useState("crear");

  const tabsData = [
    { key: "crear", label: "Crear cliente", icon: <CirclePlus size={22} /> },
    { key: "lista", label: "Lista de clientes", icon: <List size={22} /> },
  ];

  return (
    <div className="pt-6 pb-12 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-8 ">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
      </div>

      {tab === "crear" && <CreateAccesory />}
      {tab === "lista" && <ListAccesories />}
    </div>
  );
}
