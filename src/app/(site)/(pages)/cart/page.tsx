import React from "react";

const CartPage = () => {
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-slate-100 max-w-md mx-auto">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Carrito de Compras</h2>
        <p className="text-slate-600 text-sm">
          El carrito se visualiza y gestiona directamente desde la barra lateral derecha haciendo clic en el icono del carrito en la cabecera.
        </p>
      </div>
    </div>
  );
};

export default CartPage;

