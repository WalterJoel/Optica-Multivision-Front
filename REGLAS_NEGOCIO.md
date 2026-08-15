# REGLAS DE NEGOCIO DEL SISTEMA - ÓPTICA MULTIVISIÓN

Este documento contiene las reglas de negocio oficiales del sistema para consulta y mantenimiento.

---

## 1. VENTAS Y COBRANZA DE CUOTAS (A CRÉDITO)

### A. Liquidación de Cuotas
- **Cuotas Previas (ej: Cuota 1 o 2 en una venta de 3 cuotas)**:
  - El cliente puede realizar abonos parciales libres mayores a S/ 0.00.
  - El cliente **puede liquidar (cancelar el 100% de la deuda restante)** en cualquier cuota previa si así lo desea. La venta pasará automáticamente a estado `PAGADO` (`deuda = 0`).

- **Última Cuota (ej: Cuota 2 en venta de 2 cuotas, o Cuota 3 en venta de 3 cuotas)**:
  - Es **OBLIGATORIO** cancelar la totalidad del saldo pendiente (`deudaActual`).
  - No se permiten abonos parciales en la última cuota que dejen deudas pendientes.

---

## 2. VENTA AL CONTADO
- En ventas al contado, el campo `montoPagado` siempre es igual al 100% del `total` de la venta.
- Si el cliente entrega un billete de mayor denominación (ej. S/ 200 para una compra de S/ 100), la pantalla calcula el **Vuelto**, pero la caja y el registro contable almacenan únicamente los S/ 100.00 abonados a la tienda.

---

## 3. SEGUIMIENTO DE PEDIDOS
- Las ventas que incluyen laboratorio/montaje crean automáticamente un registro de seguimiento de pedidos en taller.
- El estado pasa de `EN_TALLER` $\rightarrow$ `LISTO` $\rightarrow$ `ENTREGADO`.

---

## 4. KITS DE ACCESORIOS Y LENTES
- Los kits se crean y asocian por sede activa (`sedeId`).
- En la venta de lentes por par (2 lunas del mismo lente), se descuenta un único kit de accesorio según la regla de empaque por par.
