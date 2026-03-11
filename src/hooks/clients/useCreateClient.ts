"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { ICreateClient } from "@/types/clients";

export const useCreateClient = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const toNumberOrUndef = (v: any) => {
    if (v === null || v === undefined) return undefined;
    const s = String(v).trim();
    if (s === "") return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const addClient = async (payload: ICreateClient) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");

    try {
      const tipoDoc = payload.tipoCliente === "PERSONA" ? "DNI" : "RUC";

      const body: any = {
        ...payload,
        tipoDoc,
        numeroDoc: payload.numeroDoc?.trim(),

        add: toNumberOrUndef(payload.add),

        dipOd: toNumberOrUndef(payload.dipOd),
        dipOi: toNumberOrUndef(payload.dipOi),

        odEsf: toNumberOrUndef(payload.odEsf),
        odCyl: toNumberOrUndef(payload.odCyl),
        odEje: toNumberOrUndef(payload.odEje),

        oiEsf: toNumberOrUndef(payload.oiEsf),
        oiCyl: toNumberOrUndef(payload.oiCyl),
        oiEje: toNumberOrUndef(payload.oiEje),
      };

      if (payload.tipoCliente === "PERSONA") {
        delete body.razonSocial;
      } else {
        delete body.nombres;
        delete body.apellidos;
      }

      const cleanEmpty = [
        "telefono",
        "correo",
        "direccion",
        "fechaNacimiento",
        "antecedentes",
        "nombres",
        "apellidos",
        "razonSocial",
      ];

      cleanEmpty.forEach((k) => {
        if (body[k] !== undefined && String(body[k]).trim() === "") {
          delete body[k];
        }
      });

      const measureKeys = [
        "add",
        "dipOd",
        "dipOi",
        "odEsf",
        "odCyl",
        "odEje",
        "oiEsf",
        "oiCyl",
        "oiEje",
      ];

      measureKeys.forEach((k) => {
        if (body[k] === undefined) delete body[k];
      });

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