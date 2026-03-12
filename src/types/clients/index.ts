export type ClientType = 'PERSONA' | 'EMPRESA';

export interface ICreateClient {
  tipoCliente: ClientType;
  numeroDoc: string;

  nombres?: string;
  apellidos?: string;
  razonSocial?: string;

  telefono?: string;
  correo?: string;
  direccion?: string;
  fechaNacimiento?: string;
  antecedentes?: string;

  add?: string;

  dipOd?: string;
  dipOi?: string;

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
  tipoDoc: 'DNI' | 'RUC';
  numeroDoc: string;

  nombres: string | null;
  apellidos: string | null;
  razonSocial: string | null;

  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  fechaNacimiento: string | null;
  antecedentes: string | null;

  add: number | null;

  dipOd: number | null;
  dipOi: number | null;

  odEsf: number | null;
  odCyl: number | null;
  odEje: number | null;

  oiEsf: number | null;
  oiCyl: number | null;
  oiEje: number | null;

  encargadoMedicionId: number | null;
  fechaMedicion: string | null;

  activo: boolean;
  fechaCreacion: string;
}

export interface ISearchClient {
  id: number;
  numeroDoc: string;
  nombres: string | null;
  apellidos: string | null;
}

export interface IResponseClient {
  total: number;
  clientes: ISearchClient[];
}