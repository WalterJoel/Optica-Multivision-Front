"use client";

import React, { useState, useEffect } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";
import Image from "next/image";

import { Glasses, Package } from "lucide-react";

const SingleItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [inputValue, setInputValue] = useState(item.quantity.toString());
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setQuantity(item.quantity);
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleIncreaseQuantity = () => {
    const maxStock = item.stock ?? 9999;
    if (quantity < maxStock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      setInputValue(newQty.toString());
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      setInputValue(newQty.toString());
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputValue(val);
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        const maxStock = item.stock ?? 9999;
        const capped = Math.min(parsed, maxStock);
        setQuantity(capped);
        setInputValue(capped.toString());
        dispatch(updateCartItemQuantity({ id: item.id, quantity: capped }));
      }
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < 1) {
      setQuantity(1);
      setInputValue("1");
      dispatch(updateCartItemQuantity({ id: item.id, quantity: 1 }));
    }
  };

  const getResolvedImageUrl = () => {
    const imgUrl = item.imagenUrl || item.imgs?.thumbnails?.[0];
    if (!imgUrl) return null;
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      if (imgUrl.includes("flaticon")) return null;
      return imgUrl;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return `${baseUrl.replace(/\/$/, "")}/${imgUrl.replace(/^\//, "")}`;
  };

  const resolvedImg = getResolvedImageUrl();

  const getProductTypeBadge = () => {
    switch (item.productType) {
      case "LENTE":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-light/10 text-blue mb-1">
            Lente
          </span>
        );
      case "MONTURA":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-yellow-light-4 text-yellow-dark mb-1">
            Montura
          </span>
        );
      case "ACCESORIO":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 mb-1">
            Accesorio
          </span>
        );
      default:
        return null;
    }
  };

  const displayName = item.productName
    .replace(/^(MONTURA|LENTE|ACCESORIO)\s+/i, "")
    .trim();

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-7.5 bg-white">
      {/* PRODUCTO */}
      <div className="flex-[2] flex items-center gap-5.5 min-w-0">
        <div className="flex items-center justify-center rounded-[5px] bg-gray-2 w-16 h-16 shrink-0 overflow-hidden shadow-sm">
          {resolvedImg ? (
            <img
              src={resolvedImg}
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          ) : item.isLens ? (
            <div className="w-full h-full flex items-center justify-center bg-blue-light/10 text-blue">
              <Glasses size={24} />
            </div>
          ) : item.productType === "ACCESORIO" ? (
            <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600">
              <Package size={24} />
            </div>
          ) : (
              <div className="w-full h-full flex items-center justify-center bg-yellow-light-4 text-yellow-dark">
                <Glasses size={24} />
              </div>
            )}
        </div>
        <div className="min-w-0">
          {getProductTypeBadge()}
          <h3 className="text-dark font-medium truncate pr-2 hover:text-blue transition-colors cursor-pointer">
            {displayName}
          </h3>
        </div>
      </div>

      {/* CILINDRO */}
      <div className="flex-1 text-center">
        <p className="text-dark text-sm font-bold">
          {item.esf ?? "-"} / {item.cyl ?? "-"}
        </p>
      </div>

      {/* PRECIO */}
      <div className="flex-1 text-center">
        <p className="text-dark text-sm font-bold">S/. {Number(item.price).toFixed(2)}</p>
      </div>

      {/* DESCUENTO */}
      <div className="flex-1 text-center">
        <p className="text-dark text-sm font-bold">S/. {Number(item.discount || 0).toFixed(2)}</p>
      </div>

      {/* CANTIDAD */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center rounded-lg border border-gray-3 bg-white overflow-hidden shadow-sm">
          <button
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
            className="flex items-center justify-center w-9 h-9 hover:bg-gray-2 text-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
              <path
                d="M1 1H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-10 h-9 text-center border-x border-gray-3 text-sm font-bold text-dark outline-none focus:bg-gray-2/50"
          />

          <button
            onClick={handleIncreaseQuantity}
            disabled={quantity >= (item.stock ?? 9999)}
            className="flex items-center justify-center w-9 h-9 hover:bg-gray-2 text-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1V11M1 6H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* SUBTOTAL */}
      <div className="flex-1 text-center">
        <p className="text-blue font-bold text-sm">
          S/. {((Number(item.price) - Number(item.discount || 0)) * quantity).toFixed(2)}{" "}
        </p>
      </div>

      {/* ACCIÓN */}
      <div className="w-12 flex justify-end">
        <button
          onClick={handleRemoveFromCart}
          className="group flex items-center justify-center rounded-lg w-9 h-9 bg-gray-2 border border-gray-3 transition-all hover:bg-red-light-6 hover:border-red-light-4"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 22 22"
            fill="none"
            className="text-dark group-hover:text-red transition-colors"
          >
            <path
              d="M9.45 2.06h3.1c.2 0 .37 0 .53.03.65.1 1.2.5 1.5 1.08.08.15.13.31.2.5l.1.31c.02.05.02.06.03.07.16.45.57.75 1.05.76h2.75c.38 0 .69.31.69.69s-.31.69-.69.69H3.21c-.38 0-.69-.31-.69-.69s.31-.69.69-.69h2.75c.06 0 .07 0 .08-.01.48-.01.89-.31 1.05-.75l.1-.32c.07-.19.12-.35.2-.5.3-.58.86-.98 1.5-1.08.16-.03.33-.03.53-.03z"
              fill="currentColor"
            />
            <path
              d="M5.42 7.75c-.02-.38-.35-.67-.73-.64s-.66.35-.64.73l.42 6.37c.08 1.18.15 2.13.29 2.88.16.77.42 1.42.97 1.93.54.5 1.2.72 1.98.82.75.1 1.7.1 2.88.1h.81c1.18 0 2.13 0 2.88-.1.79-.1 1.45-.32 1.99-.82.54-.51.81-1.16.96-1.93.15-.75.21-1.7.29-2.88l.43-6.37c.02-.38-.26-.71-.64-.73s-.71.26-.73.64l-.42 6.33c-.08 1.23-.14 2.09-.27 2.74-.13.62-.3 1-.55 1.23-.25.24-.59.39-1.23.47-.65.09-1.51.09-2.75.09h-.71c-1.24 0-2.1 0-2.75-.09-.64-.08-.98-.23-1.23-.47s-.43-.61-.55-1.23c-.13-.65-.19-1.51-.27-2.74l-.43-6.33z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
