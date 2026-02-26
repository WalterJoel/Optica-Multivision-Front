import { ReactNode } from "react";

type Tab = {
  key: string;
  label: string;
  icon?: ReactNode;
};

type BaseTabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
};

export function BaseTabs({ tabs, activeTab, onChange }: BaseTabsProps) {
  return (
    <div className="flex w-full border-b border-gray-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm border-b-2 transition
            ${
              activeTab === tab.key
                ? "border-blue text-blue font-semibold"
                : "border-transparent text-gray-500 hover:text-blue"
            }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
