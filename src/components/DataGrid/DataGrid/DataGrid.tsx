import React, {useState} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import type {TObject} from "../../typescript";
import {
  type IColumn,
  type ITableSort,
  Table,
} from "../../Table";
import {PaginationBar} from "../../PaginationBar";
import type {
  SxProps,
  Theme,
} from "../../ThemeProvider";

import type {IDataGridColumn} from "./types";

import ViewColumnIcon from "@mui/icons-material/ViewColumn";

export interface IDataGridProps<TData extends TObject> {
  /** MUI `sx` override applied to the root container. */
  sx?: SxProps<Theme>;

  /** Column definitions controlling visibility, sorting, filtering, and cell rendering. */
  columns: IDataGridColumn<TData>[];
  /** Data rows to display. Filtering, sorting, and pagination operate client-side on this array. */
  rows: TData[];

  /** Replaces the table with a centered spinner while data is being fetched. */
  loading?: boolean;
  /** Replaces the table with an error alert. Pass `null` to clear. */
  error?: string | null;

  /**
   * Number of rows per page on first render.
   * @default 30
   */
  defaultPageSize?: number;

  /** Returns a stable React key for each row — required for correct reconciliation during sort and filter. */
  getRowKey: (row: TData, index: number) => React.Key;
  /** Called when the user clicks a data row. Use to open a detail view or trigger an action. */
  onRowClick?: (row: TData) => void;
}

export const DataGrid = <TData extends TObject, >(
  props: IDataGridProps<TData>,
): React.ReactNode => {
  const {
    columns,
    rows,
    loading = false,
    error = null,
    defaultPageSize = 30,
    sx,
    getRowKey,
    onRowClick,
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    Object.fromEntries(columns.map(c => [String(c.fieldName), !c.hidden]))
  );
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: defaultPageSize});
  const [columnsMenuAnchor, setColumnsMenuAnchor] = useState<HTMLElement | null>(null);

  const tanstackColumns: ColumnDef<TData>[] = columns.map(col => ({
    id: String(col.fieldName),
    accessorKey: col.fieldName as string,
    header: col.headerLabel,
    enableSorting: col.sortable ?? false,
    enableColumnFilter: col.filterable ?? false,
  }));

  const handleSortingChange: OnChangeFn<SortingState> = updater => {
    setSorting(updater);
    setPagination(prev => ({...prev, pageIndex: 0}));
  };

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = updater => {
    setColumnFilters(updater);
    setPagination(prev => ({...prev, pageIndex: 0}));
  };

  const table = useReactTable({
    data: rows,
    columns: tanstackColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableSort: ITableSort<TData> = sorting.length > 0
    ? {fieldName: sorting[0].id as keyof TData, direction: sorting[0].desc ? -1 : 1}
    : {fieldName: undefined, direction: 0};

  const tableColumns: IColumn<TData>[] = columns.map(col => {
    const tanCol = table.getColumn(String(col.fieldName));
    return {
      fieldName: col.fieldName,
      headerLabel: col.filterable
        ? (
          <Box onClick={e => e.stopPropagation()}>
            <Typography variant="caption" sx={{fontWeight: 'bold', display: 'block'}}>
              {col.headerLabel}
            </Typography>
            <TextField
              size="small"
              variant="standard"
              placeholder="Filter…"
              value={(tanCol?.getFilterValue() as string) ?? ''}
              onChange={e => tanCol?.setFilterValue(e.target.value || undefined)}
              slotProps={{input: {sx: {fontSize: '0.75rem'}}}}
            />
          </Box>
        )
        : col.headerLabel,
      sortable: col.sortable,
      align: col.align,
      cellRender: col.cellRender,
      headerSx: col.headerSx,
      cellSx: col.cellSx,
      hidden: !(columnVisibility[String(col.fieldName)] ?? true),
    };
  });

  const handleChangeSort = (sort: ITableSort<TData>): void => {
    if (!sort.fieldName || sort.direction === 0) {
      setSorting([]);
    }
    else {
      setSorting([{id: String(sort.fieldName), desc: sort.direction === -1}]);
    }
    setPagination(prev => ({...prev, pageIndex: 0}));
  };

  if (loading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', py: 6, ...sx}}>
        <CircularProgress/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={sx}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Box sx={{textAlign: 'center', py: 6, ...sx}}>
        <Typography color="text.secondary">No data</Typography>
      </Box>
    );
  }

  const filteredCount = table.getFilteredRowModel().rows.length;
  const tableRows = table.getRowModel().rows.map(r => r.original);

  const paginationInput = (
    <PaginationBar
      pageNo={pagination.pageIndex}
      pageSize={pagination.pageSize}
      availableCount={filteredCount}
      onPageChange={pageNo => setPagination(prev => ({...prev, pageIndex: pageNo}))}
    />
  );

  return (
    <Box sx={sx}>
      <Box sx={{display: 'flex', justifyContent: 'flex-end', px: 1, pb: 0.5}}>
        <Tooltip title="Show / hide columns">
          <IconButton
            size="small"
            onClick={e => setColumnsMenuAnchor(e.currentTarget)}
          >
            <ViewColumnIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      </Box>

      {paginationInput}

      <Menu
        anchorEl={columnsMenuAnchor}
        open={Boolean(columnsMenuAnchor)}
        onClose={() => setColumnsMenuAnchor(null)}
      >
        {columns
          .filter(col => !!col.headerLabel)
          .map((col) => (
            <MenuItem key={String(col.fieldName)} dense disableRipple>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={columnVisibility[String(col.fieldName)] ?? true}
                    onChange={e => setColumnVisibility(prev => ({
                      ...prev,
                      [String(col.fieldName)]: e.target.checked,
                    }))}
                  />
                }
                label={col.headerLabel}
                sx={{m: 0}}
              />
            </MenuItem>
          ))}
      </Menu>

      <Table
        columns={tableColumns}
        rows={tableRows}
        sort={tableSort}
        getRowKey={getRowKey}
        onChangeSort={handleChangeSort}
        onRowClick={onRowClick}
      />

      {paginationInput}

      {filteredCount === 0 && (
        <Box sx={{textAlign: 'center', py: 3}}>
          <Typography color="text.secondary" variant="body2">
            No results match the current filters
          </Typography>
        </Box>
      )}

    </Box>
  );
};
