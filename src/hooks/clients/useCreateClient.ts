"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { ICreateClient } from "@/types/clients";

export const useCreateClient = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const addClient = async (payload: ICreateClient) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");

    try {
      // tipoDoc automático
      const tipoDoc = payload.tipoCliente === "PERSONA" ? "DNI" : "RUC";

      const body: any = {
        ...payload,
        tipoDoc,
        numeroDoc: payload.numeroDoc?.trim(),
      };

      // limpiar campos que no correspondan
      if (payload.tipoCliente === "PERSONA") {
        delete body.razonSocial;
      } else {
        delete body.nombres;
        delete body.apellidos;
      }

      await api.post("/clientes/crearCliente", body);

      setSuccess(true);
      setStatusMessage("Cliente creado correctamente");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al crear cliente";
      setSuccess(false);
      setStatusMessage(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return { addClient, loading, success, statusMessage };
};