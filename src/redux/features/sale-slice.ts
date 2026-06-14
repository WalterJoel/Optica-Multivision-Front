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
  bloqueadoPorDeuda?: boolean;
  deudaMensaje?: string | null;
}

const initialState: VentaState = {
  clienteId: null,
  kitRegaloId: null,
  metodoPago: null,
  observaciones: undefined,
  total: 0,
  fechaVenta: undefined,
  bloqueadoPorDeuda: false,
  deudaMensaje: null,
};

export const ventaSlice = createSlice({
  name: "venta",
  initialState,
  reducers: {
    setClienteId: (state, action: PayloadAction<number | null>) => {
      state.clienteId = action.payload;
    },
    setKitRegaloId: (state, action: PayloadAction<number>) => {
      console.log(action.payload, " KIT ID XDDD");
      state.kitRegaloId = action.payload;
    },
    setMetodoPago: (state, action: PayloadAction<MetodoPago>) => {
      console.log(action.payload, " METODO DE PAGO XDDD");
      state.metodoPago = action.payload;
    },
    setObservaciones: (state, action: PayloadAction<string>) => {
      state.observaciones = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setBloqueadoPorDeuda: (state, action: PayloadAction<boolean>) => {
      state.bloqueadoPorDeuda = action.payload;
    },
    setDeudaMensaje: (state, action: PayloadAction<string | null>) => {
      state.deudaMensaje = action.payload;
    },

    resetVenta: (state) => {
      state.clienteId = null;
      state.kitRegaloId = null;
      state.metodoPago = null;
      state.observaciones = undefined;
      state.total = 0;
      state.bloqueadoPorDeuda = false;
      state.deudaMensaje = null;
    },
  },
});

export const {
  setClienteId,
  setKitRegaloId,
  setMetodoPago,
  setObservaciones,
  setTotal,
  setBloqueadoPorDeuda,
  setDeudaMensaje,
  resetVenta,
} = ventaSlice.actions;

// ✅ Selector
export const selectVenta = (state: RootState) => state.venta;

// ✅ Reducer
export default ventaSlice.reducer;
