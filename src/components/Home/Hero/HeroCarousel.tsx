"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const slides = [
  {
    title: "Lentes oftálmicos con tecnología antirreflejo",
    desc: "Mejora tu visión con lentes de alta precisión diseñados para comodidad, nitidez y protección visual durante todo el día.",
    cta: "Ver modelos",
    tag1: "Descuento",
    tag2: "en lentes",
    image: "/images/login/login-joven.webp",
  },
  {
    title: "Evaluación visual profesional sin costo",
    desc: "Detecta a tiempo problemas de visión con nuestro equipo de especialistas y tecnología de diagnóstico avanzada.",
    cta: "Reservar cita",
    tag1: "Examen",
    tag2: "visual",
    image: "/images/login/login-medicion.webp",
  },
  {
    title: "Estilos de monturas para cada tipo de rostro",
    desc: "Encuentra el diseño perfecto con monturas ligeras, resistentes y adaptadas a tu estilo personal.",
    cta: "Explorar colección",
    tag1: "Monturas",
    tag2: "modernas",
    image: "/images/login/login-joven2.webp",
  },
  {
    title: "Lentes con filtro de luz azul",
    desc: "Reduce la fatiga visual causada por pantallas con tecnología de protección contra luz azul.",
    cta: "Proteger mi vista",
    tag1: "Protección",
    tag2: "visual",
    image: "/images/login/login-mujer.webp",
  },
];

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={0}
      centeredSlides
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <div className="flex flex-col-reverse sm:flex-row items-stretch min-h-[650px] sm:h-[520px]">
            {/* LEFT */}
            <div className="w-full sm:w-1/2 px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-4xl sm:text-6xl text-blue">
                  30%
                </span>
                <span className="text-dark text-sm leading-tight">
                  {s.tag1} <br /> {s.tag2}
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-4">
                {s.title}
              </h1>

              <p className="text-gray-600 mb-8">{s.desc}</p>

              <a
                href="#"
                className="inline-flex w-fit items-center justify-center font-medium text-white rounded-md bg-dark px-8 py-3 transition hover:bg-blue"
              >
                {s.cta}
              </a>
            </div>

            {/* RIGHT */}
            <div className="relative w-full sm:w-1/2 h-[260px] sm:h-full">
              <Image
                src={s.image}
                alt="hero optica"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
