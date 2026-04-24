"use client";

import { useState } from "react";
import { STATUS_MODAL } from "@/commons/constants";

interface ModalState {
  isOpen: boolean;
  type: string;
  message: string;
}

export const useNotify = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "",
    message: "",
  });

  const open = (type: string, message: string) => {
    setModal({
      isOpen: true,
      type,
      message,
    });
  };

  const close = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const success = (message: string) => {
    open(STATUS_MODAL.SUCCESS_MODAL, message);
  };

  const error = (message: string) => {
    open(STATUS_MODAL.ERROR_MODAL, message);
  };

  return {
    modal,
    open,
    close,
    success,
    error,
  };
};
