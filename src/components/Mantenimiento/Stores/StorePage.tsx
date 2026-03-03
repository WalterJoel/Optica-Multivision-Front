"use client";

import { useState } from "react";
import { Building2, List } from "lucide-react";
import CreateStore from "./CreateStore";
import ListStores from "./ListStores";
import { BaseTabs } from "@/components/Common/Inputs";

export default function SedesPage() {
  const [tab, setTab] = useState("crear");

  const tabsData = [
    { key: "crear", label: "Crear sede", icon: <Building2 size={18} /> },
    { key: "lista", label: "Lista de sedes", icon: <List size={18} /> },
  ];

  return (
    <div className="pt-4 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-6">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />{" "}
      </div>

      {tab === "crear" && <CreateStore />}
      {tab === "lista" && <ListStores />}
    </div>
  );
}
