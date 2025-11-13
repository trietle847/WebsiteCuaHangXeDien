import { useParams } from "react-router-dom";
import { getEntityConfig } from "../lib/entities";
import type { EntityConfig } from "../lib/entities/config/types";
import type { EntityVariant } from "../lib/entities";

export default function useEntityConfig() {
  const { entity, variant } = useParams<{ entity: string; variant?: string }>();

  if (!entity) {
    return {
      config: null,
      parentConfig: null,
      variant: null,
      error: <div>Entity parameter not found</div>,
    };
  }

  const entityData = getEntityConfig(entity); // Lấy 'gói' config (products hoặc users)

  if (!entityData) {
    return {
      config: null,
      parentConfig: null,
      variant: null,
      error: <div>Entity config not found for '{entity}'</div>,
    };
  }

  if ("api" in entityData) {
    // 1. Đây là EntityConfig đơn giản (products, orders)
    // Cứ trả về, không quan tâm 'variant' (nó sẽ là undefined)
    return {
      config: entityData as EntityConfig,
      parentConfig: null,
      variant: null,
      error: null,
    };
  }

  // 2. Config có biến thể (users)
  const variantObject = entityData as EntityVariant;

  // Vì route đã navigate, 'variant' SẼ LUÔN CÓ
  if (variant && variantObject[variant]) {
    return { config: variantObject[variant], parentConfig: variantObject, variant, error: null };
  }

  // Chỉ chạy khi URL gõ sai (ví dụ: /users/abcxyz)
  return {
    config: null,
    parentConfig: null,
    variant: null,
    error: (
      <div>
        Variant '{variant}' not found in '{entity}'
      </div>
    ),
  };
}
