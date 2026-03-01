"use client";

import { useState } from "react";
import { List, UserPlus } from "lucide-react";
import { BaseTabs } from "@/components/Common/Inputs";

import CreateClient from "./CreateClient";
import ListClients from "./ListClients";

export default function ClientesPage() {
  const [tab, setTab] = useState("crear");

  const tabsData = [
    { key: "crear", label: "Crear cliente", icon: <UserPlus size={18} /> },
    { key: "lista", label: "Lista de clientes", icon: <List size={18} /> },
  ];

  return (
    <div className="pt-4 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-6">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
      </div>

      {tab === "crear" && <CreateClient />}
      {tab === "lista" && <ListClients />}
    </div>
  );
}