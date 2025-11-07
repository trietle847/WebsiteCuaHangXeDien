export type Product = {
  product_id: string;
  name: string;
  price: number;
  description: string;
  company_id: string;
  ProductDetail: any;
  ProductColors: ProductColor[];
};

export type ProductDetail = {
  productDetail_id: string;
  product_id: string;
  length: number;
  width: number;
  height: number;
  saddle_height: number;
  maximum_speed: number;
  battery: string;
  charging_time: number;
  maximum_load: number;
};

export type ProductColor = {
  productColor_id: string;
  color_id: string;
  product_id: string;
  stock_quantity: number;
  ColorImages: ColorImage[];
  Color: Color;
};

export type Color = {
  color_id: string;
  name: string;
  code: string;
};

export type ColorImage = {
  image_id: string;
  productColor_id: string;
  title: string;
  url: string;
};

export type Company = {
  company_id: string;
  name: string;
};

export type OrderItem = {
  productColor_id: string;
  productName: string;
  colorName: string;
  colorCode: string;
  stock_quantity: number;
  quantity: number | "";
  price: number;
  totalPrice: number | "";
};

export type OrderDetail = {
  ProductColor: {
    Color: {
      name: string;
      code: string;
    };
    Product: {
      name: string;
    };
  };
  price: number;
  quantity: number;
  total_price: number;
  product_name: string;
  color_name: string;
};

export type Delivery = {
  method: string;
  address: string;
  cost: number;
  recipient_name: string;
  recipient_phone: string;
  status: string;
  note: string | null;
};

export type Payment = {
  method: string;
  status: string;
  paid_at: string | null;
};

export type Promotion = {
  promotion_id: string;
  name: string;
  code: string;
  content: string;
  discount_type: "fixed_amount" | "percentage";
  discount_value: number;
  minimum_order_value: number | null;
  max_discount_amount: number | null;
  start_date: Date;
  end_date: Date;
  disabled: boolean | undefined;
  decreasedValue?: number;
};

export type User = {
  user_id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "store_keeper" | "sale_staff" | "mechanic";
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
};
