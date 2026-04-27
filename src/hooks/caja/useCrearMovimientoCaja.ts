import { useState } from 'react';
import { ICrearMovimientoCaja } from '@/types/caja';
import { crearMovimientoCajaService } from '@/services/caja';

export function useCrearMovimientoCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const crearMovimientoCaja = async (payload: ICrearMovimientoCaja) => {
    setLoading(true);
    setSuccess(false);
    setMessage('');

    try {
      await crearMovimientoCajaService(payload);
      setSuccess(true);
      setMessage('Movimiento registrado correctamente');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? 'Error al registrar movimiento: ' + backendMessage
          : 'Error al registrar movimiento',
      );
    } finally {
      setLoading(false);
    }
  };

  return { crearMovimientoCaja, loading, statusMessage, success };
}
