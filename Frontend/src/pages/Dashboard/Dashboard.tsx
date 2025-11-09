import { Box } from "@mui/material";
import useEntityConfig from "../../hooks/useEntityConfig";
import EntityDataGrid from "./EntityDataGrid";
import GlobalDialog from "../../components/dialog/GlobalDialog";
import { DialogProvider } from "../../context/DialogContext";

export default function Dashboard() {
  const { config, error } = useEntityConfig();

  if (error) {
    return error;
  }

  return (
    <Box sx={{ p: 2 }}>
      <DialogProvider>
        <EntityDataGrid config={config!} />
        <GlobalDialog />
      </DialogProvider>
    </Box>
  );
}
