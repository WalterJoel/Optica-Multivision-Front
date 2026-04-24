"use client";

import { useState, useEffect } from "react";

const slides = [
  { id: 1, url: "/images/login/login-mujer.webp", title: "Premium Eyewear" },
  { id: 2, url: "/images/login/login-joven.webp", title: "Nueva Colección" },
];

const LoginCarrusel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Cambio de imagenes
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden w-1/2 lg:block overflow-hidden bg-dark">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url('${slide.url}')` }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
      ))}

      <div className="absolute bottom-12 left-12 z-20 text-white">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-60 mb-2">
          {slides[currentSlide].title}
        </p>
        <h1 className="text-3xl font-black tracking-tighter">MULTIVISION</h1>
      </div>
    </div>
  );
};

export default LoginCarrusel;
