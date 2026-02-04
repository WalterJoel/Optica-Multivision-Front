/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["encrypted-tbn0.gstatic.com"], // <- aquí tu dominio externo
  },
};

module.exports = nextConfig;
