"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface BaseSearchInputProps<T> {
  label?: string;
  name?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  results: T[];
  showList: boolean;
  renderItem: (item: T) => React.ReactNode;
}

export default function BaseSearchInput<T>({
  label,
  name,
  required,
  value,
  onChange,
  placeholder = "Buscar...",
  results,
  showList,
  renderItem,
}: BaseSearchInputProps<T>) {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-dark/50 group-focus-within:text-blue transition-colors z-10">
            <Search size={18} />
          </div>

          <input
            id={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full bg-white border border-blue-dark/20 text-blue-dark rounded-full pl-11 pr-4 py-2.5 
                       outline-none transition-all duration-200 text-sm
                       focus:border-blue focus:ring-4 focus:ring-blue/10
                       placeholder:text-gray-400 shadow-sm"
          />
        </div>

        <AnimatePresence>
          {showList && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute top-full mt-2 w-full bg-white border border-blue-dark/40 
                         rounded-2xl shadow-xl z-50 overflow-hidden left-0 ring-4 ring-blue/5"
            >
              <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                {results.map((item, index) => (
                  <div
                    key={index}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-4 py-3 cursor-pointer transition-colors duration-150
                               hover:bg-blue-light-5 border-b border-blue-dark/10 last:border-b-0
                               flex items-center gap-3 text-blue-dark text-sm font-semibold"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue shrink-0" />
                    <div className="flex-1">{renderItem(item)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
