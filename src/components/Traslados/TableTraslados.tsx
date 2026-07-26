"use client";

import React, { useEffect, useState, useMemo } from "react";
import { TipoProducto } from "@/commons/constants";
import { IVentaPorTipoItem } from "@/types/sales";
import { Search, PackageCheck } from "lucide-react";

export interface ITablaTrasladoRow extends IVentaPorTipoItem {
  _rowKey: string;
  selectedQuantity: number | "";
  isSelected: boolean;
}

interface TableTrasladosProps {
  items: IVentaPorTipoItem[];
  tipoProducto: string;
  loading?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
}

export function TableTraslados({
  items,
  tipoProducto,
  loading = false,
  onSelectionChange,
}: TableTrasladosProps) {
  const [tableData, setTableData] = useState<ITablaTrasladoRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initialized = (items || []).map((item, idx) => ({
      ...item,
      _rowKey: `${item.productoId || item.stockId || item.id || "item"}-${idx}`,

      selectedQuantity: item.cantidad ?? 1,
      isSelected: true,
    }));
    setTableData(initialized);
  }, [items]);

  const handleQuantityChange = (rowKey: string, rawVal: string) => {
    if (rawVal === "") {
      setTableData((prev) =>
        prev.map((row) =>
          row._rowKey === rowKey ? { ...row, selectedQuantity: "" } : row
        )
      );
      return;
    }

    const val = parseInt(rawVal, 10);
    if (!isNaN(val)) {
      setTableData((prev) =>
        prev.map((row) =>
          row._rowKey === rowKey ? { ...row, selectedQuantity: Math.max(1, val) } : row
        )
      );
    }
  };

  const handleBlurQuantity = (rowKey: string) => {
    setTableData((prev) =>
      prev.map((row) =>
        row._rowKey === rowKey && (row.selectedQuantity === "" || row.selectedQuantity < 1)
          ? { ...row, selectedQuantity: 1 }
          : row
      )
    );
  };

  const handleToggleSelect = (rowKey: string) => {
    setTableData((prev) =>
      prev.map((row) =>
        row._rowKey === rowKey ? { ...row, isSelected: !row.isSelected } : row
      )
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setTableData((prev) =>
      prev.map((row) => ({ ...row, isSelected: checked }))
    );
  };

  useEffect(() => {
    if (onSelectionChange) {
      const selected = tableData
        .filter((row) => row.isSelected)
        .map((row) => ({
          ...row,
          selectedQuantity:
            typeof row.selectedQuantity === "number" && row.selectedQuantity >= 1
              ? row.selectedQuantity
              : 1,
        }));
      onSelectionChange(selected);
    }
  }, [tableData, onSelectionChange]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData;
    const term = searchTerm.toLowerCase().trim();
    return tableData.filter((row) => {
      const codigo = (row.codigo || "").toLowerCase();
      const marca = (row.marca || "").toLowerCase();
      const material = (row.material || "").toLowerCase();
      const nombre = (row.nombre || "").toLowerCase();
      return (
        codigo.includes(term) ||
        marca.includes(term) ||
        material.includes(term) ||
        nombre.includes(term)
      );
    });
  }, [tableData, searchTerm]);

  const allSelected =
    filteredData.length > 0 && filteredData.every((row) => row.isSelected);
  const someSelected =
    filteredData.some((row) => row.isSelected) && !allSelected;

  const totalSelectedCount = useMemo(
    () => tableData.filter((r) => r.isSelected).length,
    [tableData]
  );

  return (
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col my-4">
      {/* Barra superior */}
      <div className="px-4 py-3 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
        <div className="flex items-center gap-2">
          <PackageCheck size={18} className="text-blue-light" />
          <span className="text-xs font-black uppercase text-dark tracking-wider">
            Productos Encontrados ({filteredData.length})
          </span>
          {totalSelectedCount > 0 && (
            <span className="ml-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              {totalSelectedCount} seleccionado(s)
            </span>
          )}
        </div>

        <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
          <Search size={15} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por código, marca, etc..."
            className="bg-transparent text-xs ml-2 outline-none w-56 text-dark-3 font-semibold placeholder:text-gray-5"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-spacing-0">
          <thead>
            <tr className="bg-beige backdrop-blur-sm">
              <th className="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3 text-center w-10">
                N°
              </th>
              <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3">
                Código
              </th>
              {tipoProducto === TipoProducto.MONTURA && (
                <>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3">
                    Marca
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3">
                    Material
                  </th>
                </>
              )}
              {tipoProducto === TipoProducto.ACCESORIO && (
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3">
                  Nombre
                </th>
              )}
              {tipoProducto === TipoProducto.LENTE && (
                <>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3">
                    Marca
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3">
                    Material
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3 text-center">
                    SPH
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3 text-center">
                    CYL
                  </th>
                </>
              )}
              <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3 text-center">
                Cantidad
              </th>
              <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-dark-3 border-b border-gray-3 text-center">
                <div className="flex items-center justify-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-emerald-600 rounded"
                    title="Seleccionar todo"
                  />
                  <span>Seleccionar</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-beige/60 border-b border-gray-3">
            {loading ? (
              <tr>
                <td
                  colSpan={tipoProducto === TipoProducto.LENTE ? 8 : 7}
                  className="px-4 py-10 text-center text-dark-5 font-bold uppercase text-[11px] tracking-widest"
                >
                  Cargando productos...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={tipoProducto === TipoProducto.LENTE ? 8 : 7}
                  className="px-4 py-10 text-center text-dark-5 font-bold uppercase text-[11px] tracking-widest"
                >
                  No se encontraron productos para los filtros seleccionados
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={row._rowKey}
                  className={`group transition-all duration-150 ${
                    row.isSelected ? "bg-emerald-50/50" : "hover:bg-beige/30"
                  }`}
                >
                  <td className="px-3 py-2 text-center font-extrabold text-xs text-dark-5">
                    {index + 1}
                  </td>

                  <td className="px-4 py-2">
                    <span className="font-black text-dark text-xs uppercase">
                      {row.codigo}
                    </span>
                  </td>

                  {tipoProducto === TipoProducto.MONTURA && (
                    <>
                      <td className="px-4 py-2 font-semibold text-dark-2 text-xs uppercase">
                        {row.marca || "-"}
                      </td>
                      <td className="px-4 py-2 font-semibold text-dark-2 text-xs uppercase">
                        {row.material || "-"}
                      </td>
                    </>
                  )}

                  {tipoProducto === TipoProducto.ACCESORIO && (
                    <td className="px-4 py-2 font-semibold text-dark-2 text-xs uppercase">
                      {row.nombre || "-"}
                    </td>
                  )}

                  {tipoProducto === TipoProducto.LENTE && (
                    <>
                      <td className="px-4 py-2 font-semibold text-dark-2 text-xs uppercase">
                        {row.marca || "-"}
                      </td>
                      <td className="px-4 py-2 font-semibold text-dark-2 text-xs uppercase">
                        {row.material || "-"}
                      </td>
                      <td className="px-4 py-2 font-bold text-dark text-xs text-center">
                        {row.sph ?? "-"}
                      </td>
                      <td className="px-4 py-2 font-bold text-dark text-xs text-center">
                        {row.cyl ?? "-"}
                      </td>
                    </>
                  )}

                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min={1}
                        value={row.selectedQuantity}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleQuantityChange(row._rowKey, e.target.value)
                        }
                        onBlur={() => handleBlurQuantity(row._rowKey)}
                        className="w-16 h-9 px-2 text-center font-black text-xs text-dark border-2 border-blue-light/50 rounded-xl bg-white focus:border-blue-light focus:ring-2 focus:ring-blue-light/20 outline-none shadow-sm transition-all hover:border-blue-light cursor-pointer"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={row.isSelected}
                        onChange={() => handleToggleSelect(row._rowKey)}
                        className="w-5 h-5 cursor-pointer accent-emerald-600 rounded"
                        title={row.isSelected ? "Desmarcar" : "Marcar"}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
