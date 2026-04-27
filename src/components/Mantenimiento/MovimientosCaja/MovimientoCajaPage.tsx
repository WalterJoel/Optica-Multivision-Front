"use client";

import { useState } from "react";
import { Building2, List } from "lucide-react";
import RegistrarIngreso from "./RegistrarIngreso";
import RegistrarEgreso from "./RegistrarEgreso";
import { BaseTabs } from "@/components/Common/Inputs";

export default function MovimientoCajaPage() {
  const [tab, setTab] = useState("registrar-ingreso");

  const tabsData = [
    {
      key: "registrar-ingreso",
      label: "Registar Ingreso",
      icon: <Building2 size={18} />,
    },
    {
      key: "registrar-egreso",
      label: "Registrar Egreso",
      icon: <List size={18} />,
    },
  ];

  return (
    <div className="pt-6 pb-12 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-8 ">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />{" "}
      </div>

      {tab === "registrar-ingreso" && <RegistrarIngreso />}
      {tab === "registrar-egreso" && <RegistrarEgreso />}
    </div>
  );
}
