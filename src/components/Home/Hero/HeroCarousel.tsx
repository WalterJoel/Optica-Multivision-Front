"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center flex-col-reverse sm:flex-row min-h-[520px]">
          {/* LEFT CONTENT */}
          <div className="w-full sm:w-1/2 max-w-[420px] px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-semibold text-4xl sm:text-6xl text-blue">
                30%
              </span>
              <span className="text-dark text-sm leading-tight">
                Sale <br /> Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-4">
              True Wireless Noise Cancelling Headphone
            </h1>

            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
              ipsum at risus euismod lobortis.
            </p>

            <a
              href="#"
              className="inline-flex items-center justify-center font-medium text-white rounded-md bg-dark px-9 py-3 transition hover:bg-blue"
            >
              Shop Now
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full sm:w-1/2 h-[280px] sm:h-[420px] lg:h-[550px] overflow-hidden">
            <Image
              src="/images/persons/amarillo.png"
              alt="Hero image"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center flex-col-reverse sm:flex-row min-h-[520px]">
          {/* LEFT CONTENT */}
          <div className="w-full sm:w-1/2 max-w-[420px] px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-semibold text-4xl sm:text-6xl text-blue">
                30%
              </span>
              <span className="text-dark text-sm leading-tight">
                Sale <br /> Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-4">
              True Wireless Noise Cancelling Headphone
            </h1>

            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
              ipsum at risus euismod lobortis.
            </p>

            <a
              href="#"
              className="inline-flex items-center justify-center font-medium text-white rounded-md bg-dark px-9 py-3 transition hover:bg-blue"
            >
              Shop Now
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full sm:w-1/2 h-[280px] sm:h-[420px] lg:h-[550px] overflow-hidden">
            <Image
              src="/images/persons/medicion.png"
              alt="Hero image"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center flex-col-reverse sm:flex-row min-h-[520px]">
          {/* LEFT CONTENT */}
          <div className="w-full sm:w-1/2 max-w-[420px] px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-semibold text-4xl sm:text-6xl text-blue">
                30%
              </span>
              <span className="text-dark text-sm leading-tight">
                Sale <br /> Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-4">
              True Wireless Noise Cancelling Headphone
            </h1>

            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
              ipsum at risus euismod lobortis.
            </p>

            <a
              href="#"
              className="inline-flex items-center justify-center font-medium text-white rounded-md bg-dark px-9 py-3 transition hover:bg-blue"
            >
              Shop Now
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full sm:w-1/2 h-[280px] sm:h-[420px] lg:h-[550px] overflow-hidden">
            <Image
              src="/images/persons/amarillo2.png"
              alt="Hero image"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center flex-col-reverse sm:flex-row min-h-[520px]">
          {/* LEFT CONTENT */}
          <div className="w-full sm:w-1/2 max-w-[420px] px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-semibold text-4xl sm:text-6xl text-blue">
                30%
              </span>
              <span className="text-dark text-sm leading-tight">
                Sale <br /> Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-4">
              True Wireless Noise Cancelling Headphone
            </h1>

            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
              ipsum at risus euismod lobortis.
            </p>

            <a
              href="#"
              className="inline-flex items-center justify-center font-medium text-white rounded-md bg-dark px-9 py-3 transition hover:bg-blue"
            >
              Shop Now
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full sm:w-1/2 h-[280px] sm:h-[420px] lg:h-[550px] overflow-hidden">
            <Image
              src="/images/persons/aqepena.png"
              alt="Hero image"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
