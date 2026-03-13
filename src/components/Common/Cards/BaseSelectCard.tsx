"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BaseSelectCardProps {
  id: number;
  title: string;
  price: number;
  icon: string;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function BaseSelectCard({
  id,
  title,
  price,
  icon,
  selected,
  onSelect,
}: BaseSelectCardProps) {
  return (
    <motion.div
      onClick={() => onSelect(id)}
      className={`flex flex-col items-center rounded-xl cursor-pointer border transition-all duration-200
      ${selected ? "border-4 border-blue-dark shadow-lg" : "border-gray-300"}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-2 flex flex-col items-center">
        <Image
          src={icon}
          alt={title}
          width={160}
          height={160}
          unoptimized
          className="object-contain"
        />

        <h3 className="font-bold text-center text-xl mt-2">{title}</h3>

        <p className="text-center text-lg">Precio: S/. {price}</p>
      </div>
    </motion.div>
  );
}
