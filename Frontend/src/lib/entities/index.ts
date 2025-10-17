import { cache } from "react";
import type { EntityConfig } from "./types";
import { ProductEntity } from "./config/product.config";

export const entities: Record<string, EntityConfig> = {
  products: ProductEntity,
};

export const getEntityConfig = cache(
  (name: string): EntityConfig | undefined => {
    return entities[name];
  }
);