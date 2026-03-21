import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 0,
    title: "Vender",
    newTab: false,
    path: "/shop-products",

    //path: "/my-account",
  },
  {
    id: 0,
    title: "Mantenimiento",
    newTab: false,
    path: "/my-account",
  },
  //vista de seguimiento de pedidos
  {
    id: 2,
    title: "Seguimiento de Pedidos",
    newTab: false,
    path: "/seguimiento-pedidos",
  },
  {
    id: 0,
    title: "Matriz",
    newTab: false,
    path: "/matrix",
  },
  {
    id: 1,
    title: "Popular",
    newTab: false,
    path: "/",
  },

  {
    id: 4,
    title: "Productos",
    newTab: false,
    path: "/products/list",
  },
  {
    id: 6,
    title: "pages",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 64,
        title: "Checkout",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 65,
        title: "Cart",
        newTab: false,
        path: "/cart",
      },
      {
        id: 66,
        title: "Wishlist",
        newTab: false,
        path: "/wishlist",
      },
      {
        id: 67,
        title: "Sign in",
        newTab: false,
        path: "/signin",
      },
      {
        id: 68,
        title: "Sign up",
        newTab: false,
        path: "/signup",
      },
      {
        id: 69,
        title: "My Account",
        newTab: false,
        path: "/my-account",
      },
      {
        id: 70,
        title: "Contact",
        newTab: false,
        path: "/contact",
      },
      {
        id: 62,
        title: "Error",
        newTab: false,
        path: "/error",
      },
      {
        id: 63,
        title: "Mail Success",
        newTab: false,
        path: "/mail-success",
      },
      {
        id: 88,
        title: "Añadir Productos",
        newTab: false,
        path: "/products",
      },
      {
        id: 88,
        title: "Registrar Cliente",
        newTab: false,
        path: "/register-client",
      },
      {
        id: 88,
        title: "Registrar Venta",
        newTab: false,
        path: "/register-sale",
      },
    ],
  },
];
