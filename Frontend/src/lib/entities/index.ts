import { cache } from "react";
import type { EntityConfig } from "./config/types";
import { productConfig } from "./config/product.config";
import { userConfig } from "./config/user.config";
import { staffConfig } from "./config/staff.config";
import { orderConfig } from "./config/order.config";
import { promotionConfig } from "./config/promotion.config";

export const entities: Record<string, EntityConfig> = {
  products: productConfig,
  users: userConfig,
  staffs: staffConfig,
  orders: orderConfig,
  promotions: promotionConfig,
};

export const getEntityConfig = cache(
  (name: string): EntityConfig | undefined => {
    return entities[name];
  }
);