import { Box } from "@mui/material";
import useEntityConfig from "../../hooks/useEntityConfig";
import EntityDataGrid from "./EntityDataGrid";

export default function Dashboard() {

  const { config, error } = useEntityConfig();

  if (error) {
    return error;
  }

  return (
    <Box sx={{ p: 2 }}>
      <EntityDataGrid config={config!} />
    </Box>
  );
}
