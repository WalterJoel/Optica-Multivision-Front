"use client";

import { useState } from "react";
import { Building2, List } from "lucide-react";
import CreateKit from "./CreateKit";
import ListKit from "./ListKit";
import { BaseTabs } from "@/components/Common/Inputs";

export default function SedesPage() {
  const [tab, setTab] = useState("crear");

  const tabsData = [
    { key: "crear", label: "Crear Kit", icon: <Building2 size={18} /> },
    { key: "lista", label: "Listar Kits", icon: <List size={18} /> },
  ];

  return (
    <div className="pt-6 pb-12 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-8 ">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />{" "}
      </div>

      {tab === "crear" && <CreateKit />}
      {tab === "lista" && <ListKit />}
    </div>
  );
}
