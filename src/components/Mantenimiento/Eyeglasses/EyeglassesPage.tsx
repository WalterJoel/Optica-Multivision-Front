"use client";

import { useState } from "react";
import { List, CirclePlus } from "lucide-react";
import { BaseTabs } from "@/components/Common/Inputs";

import CreateEyeglass from "./CreateEyeglass";
import ListEyeglasses from "./ListEyeglasses";

export default function EyeglassesPage() {
  const [tab, setTab] = useState("crear");

  const tabsData = [
    { key: "crear", label: "Crear montura", icon: <CirclePlus size={22} /> },
    { key: "lista", label: "Lista de monturas", icon: <List size={22} /> },
  ];

  return (
    <div className="pt-6 pb-12 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-8 ">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
      </div>

      {tab === "crear" && <CreateEyeglass />}
      {tab === "lista" && <ListEyeglasses />}
    </div>
  );
}