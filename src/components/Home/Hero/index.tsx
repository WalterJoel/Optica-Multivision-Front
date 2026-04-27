import HeroCarousel from "./HeroCarousel";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          {/* Carrusel principal de promociones ópticas */}
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              <HeroCarousel />
            </div>
          </div>

          {/* Promociones laterales */}
          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {/* 👓 Campaña de examen visual */}
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                      <a href="#">Examen Visual Gratuito</a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        Evaluación profesional sin costo
                      </p>

                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">
                          S/. 0
                        </span>
                        <span className="font-medium text-2xl text-dark-4 line-through">
                          S/. 80
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/home/home-medidas.webp"
                      alt="examen visual"
                      width={223}
                      height={261}
                    />
                  </div>
                </div>
              </div>

              {/* 👓 Monturas en oferta */}
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-10">
                      <a href="#">Monturas en Oferta Especial</a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        Descuentos por tiempo limitado
                      </p>

                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">
                          S/. 499
                        </span>
                        <span className="font-medium text-2xl text-dark-4 line-through">
                          S/. 999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/home/home-joven.webp"
                      alt="monturas ópticas"
                      width={223}
                      height={261}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
