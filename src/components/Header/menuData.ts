import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Traslados",
    newTab: false,
    path: "/traslados",
    submenu: [
      {
        id: 21,
        title: "Mis traslados",
        newTab: false,
        path: "/solicitudes",
      },
      {
        id: 22,
        title: "Crear Traslado",
        newTab: false,
        path: "/traslados",
      },
    ],
  },
  {
    id: 3,
    title: "Vender",
    newTab: false,
    path: "/vender",
  },
  {
    id: 4,
    title: "Ventas",
    newTab: false,
    path: "/sell-products",
  },
  {
    id: 5,
    title: "Caja",
    newTab: false,
    path: "/caja",
  },
  {
    id: 6,
    title: "Mantenimiento",
    newTab: false,
    path: "/my-account",
  },
  // vista de seguimiento de pedidos
  {
    id: 7,
    title: "Seguimiento de Pedidos",
    newTab: false,
    path: "/seguimiento-pedidos",
  },
  {
    id: 8,
    title: "Inventarios",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 81,
        title: "Por Excel",
        newTab: false,
        path: "/inventarios/excel",
      },
      {
        id: 82,
        title: "Monturas",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 83,
        title: "Lentes",
        newTab: false,
        path: "/lentes",
      },
      {
        id: 84,
        title: "Accesorios",
        newTab: false,
        path: "/inventarios/accesorios",
      },
    ],
  },
];
