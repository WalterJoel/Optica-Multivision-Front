import { Roles } from "./constants";

// 1. RUTAS DE NAVEGACIÓN PRINCIPALES (Middleware y MenuData Header)
export const PERMISOS_RUTAS: Record<string, Roles[]> = {
  "/": [Roles.ADMIN, Roles.VENDEDOR],
  "/vender": [Roles.ADMIN, Roles.VENDEDOR],
  "/ventas": [Roles.ADMIN, Roles.VENDEDOR],
  "/caja": [Roles.ADMIN, Roles.VENDEDOR],
  "/mantenimiento": [Roles.ADMIN, Roles.VENDEDOR],
  "/seguimiento-pedidos": [Roles.ADMIN, Roles.VENDEDOR],
  "/traslados": [Roles.ADMIN, Roles.VENDEDOR],
  "/solicitudes": [Roles.ADMIN, Roles.VENDEDOR],
  "/inventarios/excel": [Roles.ADMIN],
  "/inventarios/accesorios": [Roles.ADMIN, Roles.VENDEDOR],
  "/lentes": [Roles.ADMIN, Roles.VENDEDOR],
  "/matrix": [Roles.ADMIN, Roles.VENDEDOR],
};

// 2. PESTAÑAS INTERNAS DE MANTENIMIENTO
export const PERMISOS_PESTAÑAS_MANTENIMIENTO: Record<string, Roles[]> = {
  clientes: [Roles.ADMIN, Roles.VENDEDOR],
  sedes: [Roles.ADMIN],
  users: [Roles.ADMIN],
  movimiento: [Roles.ADMIN, Roles.VENDEDOR],
  combos: [Roles.ADMIN],
  accesories: [Roles.ADMIN],
  eyeglasses: [Roles.ADMIN],
  lens: [Roles.ADMIN],
  discounts: [Roles.ADMIN],
};

// 3. ACCIONES Y BOTONES ESPECÍFICOS EN LA UI
export const PERMISOS_ACCIONES: Record<string, Roles[]> = {
  // Ventas (Resumen de ventas y MiniTable)
  ANULAR_VENTA: [Roles.ADMIN],
  EDITAR_VENTA: [Roles.ADMIN],
  REGISTRAR_PAGO_CUOTA: [Roles.ADMIN, Roles.VENDEDOR],
  DESCARGAR_REPORTE_EXCEL: [Roles.ADMIN],

  // Matriz de Lentes
  GUARDAR_MATRIZ_STOCK: [Roles.ADMIN],

  // Traslados
  CREAR_TRASLADO: [Roles.ADMIN, Roles.VENDEDOR],
  CANCELAR_TRASLADO: [Roles.ADMIN],

  // Movimientos de Caja
  EDITAR_MOVIMIENTO_CAJA: [Roles.ADMIN],
};

// 4. HELPER UNIVERSAL PARA VALIDAR PERMISOS EN VISTAS Y BOTONES
export const tienePermiso = (rolesPermitidos: Roles[] = [], rolActual?: string): boolean => {
  if (!rolActual) return false;
  return rolesPermitidos.includes(rolActual as Roles);
};
