import { cache } from "react";
import type { EntityConfig } from "./config/types";
import { productConfig } from "./config/product.config";
import { userConfig } from "./config/user.config";
import { staffConfig } from "./config/staff.config";
import { orderConfig } from "./config/order.config";
import { promotionConfig } from "./config/promotion.config";
import { serviceTicketConfig } from "./config/serviceTicket.config";
import { commentConfig } from "./config/comment.config";

export type EntityVariant = {
  [key: string]: EntityConfig;
}

export const entities: Record<string, EntityConfig | EntityVariant> = {
  products: productConfig,
  users: {
    customers: userConfig,
    staffs: staffConfig,
  },
  orders: orderConfig,
  promotions: promotionConfig,
  services: serviceTicketConfig,
  comments: commentConfig,
};

export const getEntityConfig = cache(
  (name: string): EntityConfig | EntityVariant | undefined => {
    return entities[name];
  }
);