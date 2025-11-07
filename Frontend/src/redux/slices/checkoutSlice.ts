import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: CheckoutState = {
  items: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // ✅ Hỗ trợ thêm 1 hoặc nhiều sản phẩm vào checkout
    addCheckoutItem: (
      state,
      action: PayloadAction<any[] | any>
    ) => {
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

    // ✅ Xóa 1 sản phẩm khỏi danh sách
    removeCheckoutItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (i) => i.productColorId !== action.payload
      );
    },

    // ✅ Xóa toàn bộ danh sách
    clearCheckoutItems: (state) => {
      state.items = [];
    },
  },
});

export const { addCheckoutItem, removeCheckoutItem, clearCheckoutItems } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
