import type { GridColDef } from '@mui/x-data-grid';
import { defineConfig } from '../../components/form/formConfig';

export interface EntityConfig {
    name: string;
    label: string;
    permission: {
        create?: boolean;
        update?: boolean;
        delete?: boolean;
    }
    getColumns: (actions: {
        onEdit: (item: any) => void;
        onDelete: (item: any) => void;
    }) => GridColDef[];
    formConfig: ReturnType<typeof defineConfig>;
}