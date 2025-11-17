import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import useEntityConfig from "../../hooks/useEntityConfig";
import EntityDataGrid from "./EntityDataGrid";
import { SelectionProvider } from "../../context/SelectionContext";
import { useNavigate, useParams } from "react-router-dom";
import type { EntityVariant } from "../../lib/entities";

export default function Dashboard() {
  const { config, parentConfig, variant, error } = useEntityConfig();
  const { entity } = useParams<{ entity: string }>();

  if (error) {
    return error;
  }

  if (!config) {
    return <CircularProgress />;
  }

  let hasVariants = false;
  if (parentConfig && Object.keys(parentConfig).length > 1) {
    hasVariants = true;
  }

  let customPath = undefined;
  if (parentConfig) {
    customPath = `${entity}${variant ? `/${variant}` : ""}`;
  }

  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
        <SelectionProvider>
        {hasVariants && (
          <Tabs
            value={variant}
            onChange={(_, newVariant) =>
              navigate(`/dashboard/${entity}/${newVariant}`)
            }
            sx={{ mb: 2 }}
          >
            {/* Lặp qua parentConfig để lấy tên các tab */}
            {Object.entries(parentConfig as EntityVariant).map(
              ([key, variantConfig]) => (
                <Tab
                  key={key}
                  value={key} // 'customers', 'staff'
                  label={variantConfig.label} // "Khách hàng", "Nhân viên"
                />
              )
            )}
          </Tabs>
        )}

        <EntityDataGrid config={config!} customPath={customPath} />
        </SelectionProvider>
    </Box>
  );
}
