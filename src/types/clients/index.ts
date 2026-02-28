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

  activo: boolean;
  fechaCreacion: string;
}