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

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => {
    const price = Number(item.price);
    const discount = Number(item.discount || 0);
    const finalPrice = Math.max(0, price - discount);
    return total + finalPrice * item.quantity;
  }, 0),
);

export const {
  addItemToCart,
  applyDiscountToItem,
  removeDiscountFromItem,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;

export default cart.reducer;
