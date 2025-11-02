import { cache } from "react";
import type { EntityConfig } from "./config/types";
import { productConfig } from "./config/product.config";
import { userConfig } from "./config/user.config";
import { staffConfig } from "./config/staff.config";
import { orderConfig } from "./config/order.config";

export const entities: Record<string, EntityConfig> = {
  products: productConfig,
  users: userConfig,
  staffs: staffConfig,
  orders: orderConfig,
};

export const getEntityConfig = cache(
  (name: string): EntityConfig | undefined => {
    return entities[name];
  }
);