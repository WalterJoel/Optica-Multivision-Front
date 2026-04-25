export interface IStore {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  logoUrl: string;
  activo: boolean;
}

export type ICreateStore = Omit<IStore, "id" | "activo">;

export type IUpdateStore = Omit<IStore, "id" | "activo" | "logoUrl">;

// export interface CreateStoreResponse {
//   success: boolean;
//   data: Store;
//   message?: string;
// }
