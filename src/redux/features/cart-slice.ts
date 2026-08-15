import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItem } from "@/types/cart";

type InitialState = {
  items: CartItem[];
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        const maxStock = existingItem.stock ?? 9999;
        existingItem.quantity = Math.min(existingItem.quantity + item.quantity, maxStock);
      } else {
        const maxStock = item.stock ?? 9999;
        state.items.push({
          ...item,
          quantity: Math.min(item.quantity, maxStock),
          discount: 0,
        });
      }
    },

    applyDiscountToItem: (
      state,
      action: PayloadAction<{
        itemId: number;
        discount: number;
        discountId: number;
      }>,
    ) => {
      const { itemId, discount, discountId } = action.payload;

      const item = state.items.find((item) => item.id === itemId);

      if (!item) return;

      item.discount = Math.max(0, discount);
    },

    removeDiscountFromItem: (
      state,
      action: PayloadAction<{ itemId: number }>,
    ) => {
      const item = state.items.find(
        (item) => item.id === action.payload.itemId,
      );

      if (!item) return;

      item.discount = 0;
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        const maxStock = item.stock ?? 9999;
        item.quantity = Math.min(quantity, maxStock);
      }
    },

    // Permite actualizar el precio de un producto al momento solo de vender (afecta únicamente al carrito de esta venta, no a la base de datos)
    updateCartItemPrice: (
      state,
      action: PayloadAction<{ id: number; price: number }>,
    ) => {
      const { id, price } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.price = Math.max(0, price);
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount || 0);
    const finalPrice = Math.max(0, price - discount);
    return sum + finalPrice * item.quantity;
  }, 0);
  return Number(total.toFixed(2));
});

export const {
  addItemToCart,
  applyDiscountToItem,
  removeDiscountFromItem,
  removeItemFromCart,
  updateCartItemQuantity,
  updateCartItemPrice,
  removeAllItemsFromCart,
} = cart.actions;

export default cart.reducer;
