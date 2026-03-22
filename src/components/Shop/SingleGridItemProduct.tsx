"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";

interface Props {
  item: any;
  onQuickView?: (item: any) => void;
}

const SingleGridItemProduct = ({ item, onQuickView }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const isLente = item.tipo === "LENTE" || item.tipo === "lente";

  const displayImage = item.imagenUrl || item.imgs?.previews?.[0];
  const displayBrand = item.marca || "Sin Marca";
  const displayTitle = item.nombre || item.producto?.nombre || item.title || "Producto";

  const handleAddToCart = () => {
    const itemToCart = {
      id: item.id,
      title: item.nombre || item.title || item.producto?.nombre || "Producto",
      price: Number(item.precio || item.producto?.precio || 0),
      quantity: 1,
      imgs: item.imgs || {
        thumbnails: [item.imagenUrl],
        previews: [item.imagenUrl],
      },
    };

    dispatch(addItemToCart(itemToCart));
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-white shadow-1 min-h-[270px] mb-4 ring-4 ring-blue-light/30">
        {displayImage && (
          <Image
            src={displayImage}
            alt={displayBrand}
            width={250}
            height={250}
            className="object-contain p-4"
          />
        )}

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => onQuickView?.(item)}
            aria-label="Ver detalle"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666Z"
              />
            </svg>
          </button>

          {isLente ? (
            <Link
              href={{
                pathname: "/matrix",
                query: { lenteId: item.id, type: "stock" },
              }}
              className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark shadow-md"
            >
              Abrir Matriz
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark shadow-md"
            >
              Agregar
            </button>
          )}
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

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1">
        {displayTitle}
      </h3>

      <div className="flex flex-col gap-1">
  {isLente ? (
    <div className="flex flex-wrap gap-2 text-custom-sm font-medium">
      <span className="text-blue bg-blue/5 px-2 py-1 rounded">
        S1: S/. {Number(item.precio_serie1 || 0)}
      </span>
      <span className="text-blue bg-blue/5 px-2 py-1 rounded">
        S2: S/. {Number(item.precio_serie2 || 0)}
      </span>
      <span className="text-blue bg-blue/5 px-2 py-1 rounded">
        S3: S/. {Number(item.precio_serie3 || 0)}
      </span>
    </div>
  ) : (
    <span className="flex items-center gap-2 font-medium text-lg">
      <span className="text-dark">
        S/. {Number(item.precio || item.producto?.precio || 0)}
      </span>
    </span>
  )}
</div>
    </div>
  );
};

export default SingleGridItemProduct;