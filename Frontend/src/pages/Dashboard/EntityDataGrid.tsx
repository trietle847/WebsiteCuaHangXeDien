import { DataGrid } from "@mui/x-data-grid";
import type { EntityConfig } from "../../lib/entities/types";

interface EntityDataGridProps {
  config: EntityConfig;
}

export default function EntityDataGrid({ config }: EntityDataGridProps) {
  if (!config) {
    return <div>Entity config not found</div>;
  }

    return (
    <DataGrid
      rows={[]}
      columns={config.getColumns({
        onEdit: (id) => console.log("Edit", id),
        onDelete: (id) => console.log("Delete", id),
        })}
      />
    );
}
