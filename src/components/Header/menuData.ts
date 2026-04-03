import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 0,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 1,
    title: "Vender",
    newTab: false,
    path: "/shop-products",
  },
  {
    id: 10,
    title: "Ventas",
    newTab: false,
    path: "/sell-products",
  },
  {
    id: 2,
    title: "Mantenimiento",
    newTab: false,
    path: "/my-account",
  },
  //vista de seguimiento de pedidos
  {
    id: 3,
    title: "Seguimiento de Pedidos",
    newTab: false,
    path: "/seguimiento-pedidos",
  },

  {
    id: 4,
    title: "Productos",
    newTab: false,
    path: "/products/list",
  },
  {
    id: 5,
    title: "pages",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 64,
        title: "Inventario Monturas",
        newTab: false,
        path: "/checkout",
      },
      // {
      //   id: 65,
      //   title: "Cart",
      //   newTab: false,
      //   path: "/cart",
      // },

      // {
      //   id: 68,
      //   title: "Sign up",
      //   newTab: false,
      //   path: "/signup",
      // },

      // {
      //   id: 88,
      //   title: "Añadir Productos",
      //   newTab: false,
      //   path: "/products",
      // },
    ],
  },
];
