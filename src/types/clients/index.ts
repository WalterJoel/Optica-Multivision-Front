export type ClientType = "PERSONA" | "EMPRESA";

export interface ICreateClient {
  tipoCliente: ClientType;
  numeroDoc: string;

  nombres?: string;
  apellidos?: string;

  razonSocial?: string;

  telefono?: string;
  correo?: string;
  direccion?: string;

  // ✅ medidas (en el form como string para inputs)
  dip?: string;
  add?: string;

  odEsf?: string;
  odCyl?: string;
  odEje?: string;

  oiEsf?: string;
  oiCyl?: string;
  oiEje?: string;
}

export interface IClient {
  id: number;
  tipoCliente: ClientType;
  tipoDoc: "DNI" | "RUC";
  numeroDoc: string;

  nombres: string | null;
  apellidos: string | null;
  razonSocial: string | null;

  telefono: string | null;
  correo: string | null;
  direccion: string | null;

  // ✅ MEDIDAS (vienen como number/null desde backend)
  dip: number | null;
  add: number | null;

  odEsf: number | null;
  odCyl: number | null;
  odEje: number | null;

  oiEsf: number | null;
  oiCyl: number | null;
  oiEje: number | null;

  // ✅ encargado y fecha de medición
  encargadoMedicionId: number | null;
  fechaMedicion: string | null;

  activo: boolean;
  fechaCreacion: string;
}