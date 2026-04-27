import { useState } from 'react';
import { cerrarCajaService } from '@/services/caja';
import { ICerrarCaja } from '@/types/caja';
export function useCerrarCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const addCaja = async (payload: ICerrarCaja) => {
    setLoading(true);
    setSuccess(false);
    setMessage('');

    try {
      await cerrarCajaService(payload);
      setSuccess(true);
      setMessage('Caja cerrada correctamente');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? 'Error al cerrar caja: ' + backendMessage
          : 'Error al cerrar caja',
      );
    } finally {
      setLoading(false);
    }
  };

  return { addCaja, loading, statusMessage, success };
}
