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
        existingItem.quantity += item.quantity;
      } else {
        state.items.push({
          ...item,
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

      if (item) item.quantity = quantity;
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => {
    const finalPrice = Math.max(0, item.price - (item.discount || 0));
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
