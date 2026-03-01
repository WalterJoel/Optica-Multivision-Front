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

        // ✅ convertir medidas a number (o no enviarlas)
        dip: toNumberOrUndef((payload as any).dip),
        add: toNumberOrUndef((payload as any).add),

        odEsf: toNumberOrUndef((payload as any).odEsf),
        odCyl: toNumberOrUndef((payload as any).odCyl),
        odEje: toNumberOrUndef((payload as any).odEje),

        oiEsf: toNumberOrUndef((payload as any).oiEsf),
        oiCyl: toNumberOrUndef((payload as any).oiCyl),
        oiEje: toNumberOrUndef((payload as any).oiEje),
      };

      // limpiar campos que no correspondan
      if (payload.tipoCliente === "PERSONA") {
        delete body.razonSocial;
      } else {
        delete body.nombres;
        delete body.apellidos;
      }

      // ✅ limpiar strings vacíos generales (opcional pero recomendado)
      const cleanEmpty = [
        "telefono",
        "correo",
        "direccion",
        "nombres",
        "apellidos",
        "razonSocial",
      ];
      cleanEmpty.forEach((k) => {
        if (body[k] !== undefined && String(body[k]).trim() === "") delete body[k];
      });

      // ✅ eliminar medidas si quedaron undefined (para no mandar "dip: undefined")
      const measureKeys = [
        "dip",
        "add",
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