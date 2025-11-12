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
    onView?: (element?: {
      title: string;
      content: JSX.Element | null;
      quickUpdate?: (id: number, data?: any) => Promise<any>;
      id?: number;
    }) => void;
  }) => GridColDef[];
  api: ApiClient & {
    activate?: (id: string | number) => Promise<any>;
    deactivate?: (id: string | number) => Promise<any>;
  };
  customFormComponents: ((data?: any) => JSX.Element) | null;
  formConfig?: ReturnType<typeof defineConfig>;
}
