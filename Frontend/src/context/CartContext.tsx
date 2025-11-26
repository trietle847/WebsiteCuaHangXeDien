import React, { createContext, useContext, useState, useEffect } from "react";
import cartApi from "../services/cart.api";
import { useAuth } from "./AuthContext";

const CartContext = createContext<any>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any>({});

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartApi.getAll();
      console.log("🟢 Cart API:", response.data);
      setCart(response.data);
    } catch (e) {
      console.error("Lỗi lấy giỏ hàng:", e);
      setCart({ Items: [] });
    } finally {
      setLoading(false);
    }
  };

  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    } else {
      setCart({ Items: [] });
    }
  }, [userInfo]);

  const addItem = async (productColorId: number, quantity: number) => {
    setLoading(true);
    try {
      await cartApi.create({ productColorId, quantity });
      // fetch lại cart mới nhất
      await fetchCart();
    } catch (e) {
      console.error("Lỗi khi thêm sản phẩm:", e);
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = async (cartItemId: number, delta: number) => {
    if (!cart || loading) return;
    const item = cart.Items.find((i: any) => i.cartItem_id === cartItemId);
    if (!item) return;

    const maxStock = item.ProductColor.stock_quantity || 0;
    const newQuantity = Math.max(1, item.quantity + delta);

    if (newQuantity > maxStock) {
      setErrorMsg((prev: any) => ({
        ...prev,
        [cartItemId]: `Số lượng tối đa: ${maxStock}`,
      }));
      return;
    } else {
      setErrorMsg((prev: any) => ({ ...prev, [cartItemId]: "" }));
    }

    setLoading(true);
    try {
      await cartApi.update(cartItemId, { quantity: newQuantity });
      const updatedItems = cart.Items.map((i: any) =>
        i.cartItem_id === cartItemId ? { ...i, quantity: newQuantity } : i
      );
      setCart({ ...cart, Items: updatedItems });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!cart) return;
    if (!confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?")) return;

    setLoading(true);
    try {
      await cartApi.delete(cartItemId);
      setCart({
        ...cart,
        Items: cart.Items.filter(
          (item: any) => item.cartItem_id !== cartItemId
        ),
      });
      setErrorMsg((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[cartItemId];
        return newErrors;
      });
    } catch (e) {
      console.error("Lỗi khi xóa sản phẩm:", e);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart
    ? cart.Items?.reduce(
        (sum: number, item: any) =>
          sum + item.ProductColor?.Product?.price * item.quantity,
        0
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        errorMsg,
        fetchCart,
        updateQuantity,
        removeItem,
        totalPrice,
        addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải được sử dụng trong CartProvider");
  return context;
};
