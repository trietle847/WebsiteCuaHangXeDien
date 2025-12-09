import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CheckoutItem {
  productColorId: number;
  quantity: number;
}

interface CheckoutState {
  items: CheckoutItem[];
}

const initialState: CheckoutState = {
  items: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addCheckoutItem: (state, action: PayloadAction<any[] | any>) => {
      const itemsToAdd = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      itemsToAdd.forEach((item) => {
        const existing = state.items.find(
          (i) => i.productColorId === item.productColorId
        );
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          state.items.push(item);
        }
      });
    },

    //  Xóa 1 sản phẩm khỏi danh sách
    removeCheckoutItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (i) => i.productColorId !== action.payload
      );
    },

    //  Cập nhật số lượng (tăng/giảm)
    updateCheckoutQuantity: (
      state,
      action: PayloadAction<{ productColorId: number; delta: number }>
    ) => {
      const { productColorId, delta } = action.payload;
      const item = state.items.find((i) => i.productColorId === productColorId);
      if (item) {
        item.quantity = Math.max(item.quantity + delta, 1);
      }
    },

    //  Xóa toàn bộ danh sách
    clearCheckoutItems: (state) => {
      state.items = [];
    },
  },
});

export const {
  addCheckoutItem,
  removeCheckoutItem,
  updateCheckoutQuantity,
  clearCheckoutItems,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
