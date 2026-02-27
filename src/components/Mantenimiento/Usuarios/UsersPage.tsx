"use client";

import { useState } from "react";
import { UserPlus, List } from "lucide-react";
import CreateUser from "./CreateUser";
import ListUsers from "./ListUsers";
import { BaseTabs } from "@/components/Common/Inputs";

export default function UsersPage() {
  const [tab, setTab] = useState("crear");

  const tabsData = [
    { key: "crear", label: "Crear usuario", icon: <UserPlus size={18} /> },
    { key: "lista", label: "Lista de usuarios", icon: <List size={18} /> },
  ];

  return (
    <div className="pt-4 px-6 xl:px-8 w-full">
      <div className="border-b border-gray-3 mb-6">
        <BaseTabs tabs={tabsData} activeTab={tab} onChange={setTab} />
      </div>

      {tab === "crear" && <CreateUser />}
      {tab === "lista" && <ListUsers />}
    </div>
  );
}