interface ITableKitAccesories {
  id: number; // Id de la tabla KIT_ACCESORIOS
  cantidad: number;
  createdAt: Date;
  accesorio: {
    id: number; // Id del accesorio
    precio: number;
    nombre: string;
    atributo: string;
    imagenUrl: string;
    createdAt: string;
  };
}

export interface IKit {
  id: number;
  nombre: string;
  precio: number; //Precio total del kit
  activo: boolean;
  createdAt: string;
  descripcion: string;
  accesorios: ITableKitAccesories[];
}

export interface IResponseKitAccesory {
  id: number;
  nombre: string;
  productoId: number;
  precio: number;
}
export interface IKitAccesory {
  id: number;
  nombre: string;
  cantidad: number;
  productoId: number;
  precio: number;
}

export interface ICreateKit {
  nombre: string;
  precio: number;
  descripcion: string;
}
export interface ICreateAccesory {
  cantidad: number;
  accesorioId: number;
}
export interface ICreateKitAccesory {
  nombre: string;
  precio: number;
  descripcion: string;
  accesorios: ICreateAccesory[];
}
