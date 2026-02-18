"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import Link from "next/link";
import Image from "next/image";

const SingleGridItemProduct = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-white shadow-1 min-h-[270px] mb-4">
        <Image src={item.imagenUrl} alt={item.marca} width={250} height={250} />

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <Link
            href={{
              pathname: "/matrix",
              query: { lenteId: item.id },
            }}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
          >
            Ver Stock
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Image
              key={i}
              src="/images/icons/icon-star.svg"
              alt="star icon"
              width={15}
              height={15}
            />
          ))}
        </div>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
        {item.marca} - {item.material}
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark-4">S/. {item.precio_serie1}</span>
        <span className="text-dark-4">S/. {item.precio_serie2}</span>
        <span className="text-dark-4">S/. {item.precio_serie3}</span>
      </span>
    </div>
  );
};

export default SingleGridItemProduct;
