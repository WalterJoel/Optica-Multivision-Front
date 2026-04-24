"use client";

import { createContext, useContext } from "react";
import { useNotify as useNotifyLogic } from "@/hooks/notify";
import { StatusModal } from "@/components/Common/modal";

type NotifyContextType = ReturnType<typeof useNotifyLogic>;

const NotifyContext = createContext<NotifyContextType | null>(null);

export const NotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const notify = useNotifyLogic();

  return (
    <NotifyContext.Provider value={notify}>
      {children}

      <StatusModal
        isOpen={notify.modal.isOpen}
        type={notify.modal.type}
        message={notify.modal.message}
        onClose={notify.close}
      />
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(NotifyContext);

  if (!context) {
    throw new Error("useNotify must be used inside NotifyProvider");
  }

  return context;
};
