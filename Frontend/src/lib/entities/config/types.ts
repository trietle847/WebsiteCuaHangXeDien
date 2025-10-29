import type { GridColDef } from "@mui/x-data-grid";
import { defineConfig } from "../form/formConfig";
import { type JSX } from "react";
import ApiClient from "../../../services/axios";

export interface EntityConfig {
  idKey: string;
  searchKey?: string;
  name: string;
  label: string;
  permission: {
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  getColumns: (actions?: {
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onActivate?: (item: any) => void;
    onDeactivate?: (item: any) => void;
    onView?: (element?: { title: string; content: React.ReactNode }) => void;
  }) => GridColDef[];
  api: ApiClient & {
    activate?: (id: string | number) => Promise<any>;
    deactivate?: (id: string | number) => Promise<any>;
  };
  customFormComponents: ((data?: any) => JSX.Element) | null;
  formConfig?: ReturnType<typeof defineConfig>;
}
