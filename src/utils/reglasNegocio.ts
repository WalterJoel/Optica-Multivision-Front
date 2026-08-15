/**
 * REGLAS DE NEGOCIO DEL SISTEMA DE ÓPTICA MULTIVISIÓN
 */

export interface IValidacionCuotaResult {
  esValido: boolean;
  error?: string;
  montoFinal?: number;
}

/**
 * REGLA DE NEGOCIO: PAGOS DE CUOTAS DE VENTAS A CRÉDITO
 * 1. Si la venta tiene varias cuotas (ej. 3 cuotas), el cliente puede liquidar (cancelar el 100% de la deuda)
 *    en cualquier cuota previa (1era o 2da).
 * 2. Si el cliente se encuentra en la ÚLTIMA cuota (ej: la 2da de 2, o la 3era de 3), es OBLIGATORIO
 *    cancelar la totalidad de la deuda restante para saldar por completo la venta. No se permiten abonos parciales.
 */
export const validarPagoCuotasVenta = (
  montoIngresado: string | number,
  deudaActual: number,
  totalVenta: number,
  montoPagadoActual: number,
  nroCuotas: number = 1,
  metodoPago: string
): IValidacionCuotaResult => {
  const montoNum = typeof montoIngresado === "string" ? parseFloat(montoIngresado) : montoIngresado;

  if (deudaActual <= 0) {
    return { esValido: false, error: "La venta ya no tiene deuda pendiente." };
  }

  if (!montoIngresado || isNaN(montoNum) || montoNum <= 0) {
    return { esValido: false, error: "Ingresa un monto válido mayor a 0." };
  }

  // Estimación de cuotas pagadas y restantes
  const montoCuota = totalVenta / nroCuotas;
  const cuotasPagadas = montoCuota > 0 ? Math.round(montoPagadoActual / montoCuota) : 0;
  const cuotasRestantes = Math.max(nroCuotas - cuotasPagadas, 1);
  const isUltimaCuota = cuotasRestantes <= 1;

  // REGLA DE NEGOCIO: En la última cuota no se permiten abonos parciales, debe liquidarse el 100% de la deuda.
  if (isUltimaCuota && montoNum < deudaActual) {
    return {
      esValido: false,
      error: `Es la última cuota: debes abonar el monto completo de S/ ${deudaActual.toFixed(2)}.`,
    };
  }

  if (!metodoPago) {
    return { esValido: false, error: "Selecciona un método de pago." };
  }

  const montoFinal = Math.min(montoNum, deudaActual);

  return {
    esValido: true,
    montoFinal,
  };
};
