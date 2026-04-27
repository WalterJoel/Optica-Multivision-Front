import { useState } from 'react';
import { IMovimientosCaja } from '@/types/caja-movimiento';
import { movimientosCajaService } from '@/services/caja-movimiento';

export function useMovimientosCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const movimientosCaja = async (payload: IMovimientosCaja) => {
    setLoading(true);
    setSuccess(false);
    setMessage('');

    try {
      await movimientosCajaService(payload);
      setSuccess(true);
      setMessage('Movimientos de Caja');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? 'Error al mostrar movimientos de caja: ' + backendMessage
          : 'Error al mostrar movimientos de caja',
      );
    } finally {
      setLoading(false);
    }
  };

  return { movimientosCaja, loading, statusMessage, success };
}
