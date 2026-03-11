'use client';

import { useState } from 'react';
import { BaseInput } from '@/components/Common/Inputs/BaseInput';
import { BaseButtonIcon } from '@/components/Common/Buttons/BaseButtonIcon';
import { BaseButton } from '@/components/Common/Buttons/BaseButton';
import { AddAccessoryModal } from './AddAccessoryModal';
import { ICreateKit } from '@/types/kits';
import { useCreateKit } from '@/hooks/kits/useCreateKit';
import { Plus, Trash2 } from 'lucide-react';
import { ICreateKitAccesory, IListKitAccesory } from '@/types/kits';

const emptyForm: ICreateKit = {
  nombre: '',
  descripcion: '',
  precio: 0,
  accesorios: [],
};

export default function CreateKit() {
  const [form, setForm] = useState<ICreateKit>(emptyForm);
  const { addKit, success, statusMessage, loading } = useCreateKit();
  const [typeModal, setTypeModal] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [accesoriosKit, setAccesoriosKit] = useState<IListKitAccesory[]>([]); //lista temp

  const [nuevoAccesorio, setNuevoAccesorio] = useState({
    id: 0,
    nombre: '',
    cantidad: 1,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'precio' ? Number(value) : value,
    }));
  };

  const agregarAccesorio = () => {
    if (!nuevoAccesorio.nombre.trim()) return;

    const existe = accesoriosKit.some(
      (a) => a.accesorioId === nuevoAccesorio.id,
    );

    if (existe) {
      alert('Este accesorio ya fue agregado al kit.');
      return;
    }

    const nuevoItem: IListKitAccesory = {
      accesorioId: nuevoAccesorio.id,
      nombre: nuevoAccesorio.nombre.trim(),
      cantidad: nuevoAccesorio.cantidad,
    };

    setAccesoriosKit((prev) => [...prev, nuevoItem]);
    setNuevoAccesorio({ nombre: '', cantidad: 1, id: 0 });
    setOpenModal(false);
  };

  const eliminarAccesorio = (id: number) => {
    setAccesoriosKit((prev) => prev.filter((a) => a.accesorioId !== id));
  };

  const createKit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ICreateKit = {
      ...form,
      accesorios: accesoriosKit,
    };

    console.log('Payload listo:', payload);
  };

  return (
    <>
      <form
        onSubmit={createKit}
        className="w-full rounded-xl border border-gray-3 bg-white p-6"
      >
        {/* DATOS DEL KIT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseInput
            label="Nombre del Kit"
            name="nombre"
            value={form.nombre}
            placeholder="Kit de Limpieza Premium"
            required
            onChange={onChange}
            pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
          />

          <BaseInput
            label="Precio"
            name="precio"
            type="number"
            value={form.precio}
            placeholder="29.90"
            required
            onChange={onChange}
            pattern="/^[0-9]*\.?[0-9]*$/"
          />

          <BaseInput
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            placeholder="Kit completo para limpieza de lentes"
            onChange={onChange}
          />
        </div>

        {/* ACCESORIOS */}
        <div className="mt-12">
          <div className="flex justify-end items-center mb-6">
            <BaseButtonIcon
              variant="primary"
              onClick={() => setOpenModal(true)}
              center={false}
            >
              <Plus size={20} />
            </BaseButtonIcon>
          </div>

          <div className="border border-gray-3 rounded-2xl overflow-hidden">
            <div className="max-h-[320px] overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-3 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-600">
                      Producto
                    </th>
                    <th className="p-4 text-center font-semibold text-gray-600">
                      Cantidad
                    </th>
                    <th className="p-4 text-center font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {accesoriosKit.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-10 text-center text-gray-400"
                      >
                        No agregaste accesorios aún
                      </td>
                    </tr>
                  ) : (
                    accesoriosKit.map((acc) => (
                      <tr
                        key={acc.accesorioId}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="p-4">{acc.nombre}</td>
                        <td className="p-4 text-center">{acc.cantidad}</td>
                        <td className="p-4 text-center">
                          <BaseButtonIcon
                            type="button"
                            variant="danger"
                            onClick={() => eliminarAccesorio(acc.accesorioId)}
                          >
                            <Trash2 size={18} />
                          </BaseButtonIcon>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTÓN CREAR */}
        <div className="mt-12 flex justify-center">
          <BaseButton type="submit" className="min-w-[260px]">
            Crear Kit
          </BaseButton>
        </div>
      </form>

      <AddAccessoryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        nuevoAccesorio={nuevoAccesorio}
        setNuevoAccesorio={setNuevoAccesorio}
        onAdd={agregarAccesorio}
      />
    </>
  );
}
