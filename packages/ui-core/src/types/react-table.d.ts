import '@tanstack/react-table';
// Extend Tanstack Table ColumnDef interface
// This allows us to pass styling to the header and cell of a column in a data table (see DataTable component)
declare module '@tanstack/react-table' {
  interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
  }
}
