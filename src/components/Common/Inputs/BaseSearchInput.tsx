"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";

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
  error?: boolean;
}

export const BaseSearchInput = <T,>({
  label,
  name,
  required,
  value,
  onChange,
  placeholder = "Buscar...",
  results,
  showList,
  renderItem,
  error,
}: BaseSearchInputProps<T>) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <div className="relative w-full">
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 
            ${error ? "text-red-500" : "text-blue-dark/50 group-focus-within:text-blue"}`}
          >
            <Search size={18} />
          </div>

          <input
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            required={required}
            className={`w-full bg-white rounded-full pl-11 pr-10 py-2.5 
                       outline-none transition-all duration-200 text-sm shadow-sm
                       placeholder:text-gray-400
                       ${
                         error
                           ? "border-2 border-red-500 focus:ring-red-100"
                           : "border border-blue-dark/20 focus:border-blue focus:ring-4 focus:ring-blue/10"
                       }`}
          />

          {error && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={18} />
            </div>
          )}
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
};
