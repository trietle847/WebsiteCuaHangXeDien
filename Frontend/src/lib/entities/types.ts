import type { GridColDef } from "@mui/x-data-grid";
import { defineConfig } from "./form/formConfig";
import { type JSX } from "react";
import ApiClient from "../../services/axios";

export interface EntityConfig {
  idKey: string;
  name: string;
  label: string;
  permission: {
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  getColumns: (actions: {
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
  }) => GridColDef[];
  api: ApiClient;
  customFormComponents: JSX.Element | null;
  formConfig?: ReturnType<typeof defineConfig>;
}
