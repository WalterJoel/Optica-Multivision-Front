import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { MetodoPago } from "@/commons/constants";

export interface VentaState {
  clienteId?: number | null;
  kitRegaloId?: number | null;
  metodoPago?: MetodoPago;
  observaciones?: string;
  total?: number;
  fechaVenta?: string;
}

const initialState: VentaState = {
  clienteId: null,
  kitRegaloId: null,
  metodoPago: null,
  observaciones: undefined,
  total: 0,
  fechaVenta: undefined,
};

export const ventaSlice = createSlice({
  name: "venta",
  initialState,
  reducers: {
    setClienteId: (state, action: PayloadAction<number>) => {
      state.clienteId = action.payload;
    },
    setKitRegaloId: (state, action: PayloadAction<number>) => {
      console.log(action.payload, " KIT ID XDDD");
      state.kitRegaloId = action.payload;
    },
    setMetodoPago: (
      state,
      action: PayloadAction<"efectivo" | "tarjeta" | "transferencia">,
    ) => {
      console.log(action.payload, " METODO DE PAGO XDDD");

      // state.metodoPago = action.payload; TODO BUILD
    },
    setObservaciones: (state, action: PayloadAction<string>) => {
      state.observaciones = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },

    resetVenta: (state) => {
      state.clienteId = null;
      state.kitRegaloId = null;
      state.metodoPago = null;
      state.observaciones = undefined;
      state.total = 0;
    },
  },
});

export const {
  setClienteId,
  setKitRegaloId,
  setMetodoPago,
  setObservaciones,
  setTotal,
  resetVenta,
} = ventaSlice.actions;

// ✅ Selector
export const selectVenta = (state: RootState) => state.venta;

// ✅ Reducer
export default ventaSlice.reducer;
