import React from "react";

import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import type {TObject} from "../typescript";
import {BreakpointDeviceRender} from "../BreakpointDeviceRender";
import {
  FlexContainerHorizontal,
  FlexItemMax,
  FlexItemMin,
} from "../FlexContainer";
import {EBreakpointDevice} from "../ui-types";
import {getDeepValue} from "../utils";

import {
  type SxProps,
  type Theme,
  useTheme,
} from "../ThemeProvider";
import {sxHover} from "../sxHover";

import {
  type IColumn,
  type ITableSort,
  ETableSize,
} from "./types.ts";

import {SortButton} from "./components";

export interface ITableProps<TData extends TObject> {
  sx?: SxProps<Theme>;
  show?: boolean;
  showHeader?: boolean;
  ariaLabel?: string;
  columns: IColumn<TData>[];
  sort?: ITableSort<TData>;
  rowHover?: boolean;
  transparent?: boolean;
  rows: TData[];
  size?: ETableSize; // Default is ETableSize.LARGE
  scrollableX?: boolean;
  getRowKey: (row: TData, index: number) => React.Key;
  onRowClick?: (rowData: TData) => void;
  onChangeSort?: (sort: ITableSort<TData>) => void;
}

export const Table = <TData extends TObject, >(props: ITableProps<TData>): React.ReactNode => {
  const {
    sx,
    show = true,
    showHeader = true,
    ariaLabel,
    scrollableX = false,
    columns,
    sort = {
      fieldName: undefined,
      direction: 0,
    },
    rowHover = true,
    transparent = false,
    size = ETableSize.LARGE,
    rows,
    getRowKey,
    onRowClick,
    onChangeSort,
  } = props;
  const theme = useTheme();

  const handleChangeSort = (fieldName: keyof TData | string, direction: 0 | 1 | -1): void => {
    if (!onChangeSort) return;
    onChangeSort({
      fieldName: fieldName as keyof TData,
      direction,
    });
  };

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, rowData: TData): void => {
    if (['BUTTON', 'A'].includes((event.target as HTMLElement).nodeName)) return;
    onRowClick?.(rowData);
  };

  const renderValue = (column: IColumn<TData>, row: TData, rowIndex: number): React.ReactNode => {
    const value = getDeepValue(row, column.fieldName as string);
    if (column.cellRender) {
      return column.cellRender(
        value, {
          row,
          rows,
          prevRow: rows[rowIndex - 1] || null,
          nextRow: rows[rowIndex + 1] || null,
          index: rowIndex,
        });
    }
    return value as React.ReactNode;
  };

  const cellPadding = (() => {
    switch (size) {
      case ETableSize.SMALL:
        return theme.spacing(0.5);
      case ETableSize.MEDIUM:
        return theme.spacing(1);
      case ETableSize.LARGE:
        return theme.spacing(2);
    }
  })();

  const mapColumnHeader = (column: IColumn<TData>, index: number) => (
    <TableCell
      key={String(column.fieldName)}
      sx={{
        padding: cellPadding,
        ...column.headerSx,
        position: column.sticky ? "sticky" : undefined,
        left: column.sticky ? 0 : undefined,
        background: theme => column.sticky ? theme.palette.background.paper : undefined,
        zIndex: column.sticky ? index : undefined,
      }}
      align={column.align}
    >
      <FlexContainerHorizontal alignVertical="middle">
        <FlexItemMax>
          <Box title={column.headerTooltip}>
            <b>{column.headerLabel}</b>
          </Box>
        </FlexItemMax>
        <FlexItemMin>
          {!!column.sortable && (
            <SortButton
              fieldName={column.fieldName}
              sort={sort.fieldName === column.fieldName ? sort.direction : 0}
              onChange={handleChangeSort}
            />
          )}
        </FlexItemMin>
      </FlexContainerHorizontal>
    </TableCell>
  );

  const mapColumnBody = (row: TData, column: IColumn<TData>, rowIndex: number, columnIndex: number): React.ReactNode => (
    <TableCell
      sx={{
        ...column.cellSx,
        position: column.sticky ? "sticky" : undefined,
        left: column.sticky ? 0 : undefined,
        background: theme => column.sticky ? theme.palette.background.paper : undefined,
        zIndex: column.sticky ? columnIndex : undefined,
      }}
      key={String(column.fieldName)}
      align={column.align}
      style={{padding: cellPadding}}
      component="th"
      scope="row"
    >
      {renderValue(column, row, rowIndex)}
    </TableCell>
  );

  const showColumnByBreakpoint = (column: IColumn<TData>, breakpoint: EBreakpointDevice): boolean => {
    if (!column.breakpoints) return true; // 4TS
    return column.breakpoints.includes("allExclude")
      ? !column.breakpoints.includes(breakpoint)
      : column.breakpoints.includes(breakpoint);
  };

  if (!show) return null;

  const hasStickyColumns = columns.find(c => c.sticky);

  return (
    <TableContainer
      sx={{
        overflowX: scrollableX || hasStickyColumns ? "auto" : undefined,
        maxWidth: scrollableX || hasStickyColumns ? "100%" : undefined,
        backgroundColor: transparent ? 'transparent' : undefined,
        boxShadow: transparent ? 'none' : undefined,
        ...sx,
      }}
      component={Paper}
    >
      <MuiTable aria-label={ariaLabel}>

        {showHeader && (
          <TableHead>
            <TableRow>
              <BreakpointDeviceRender
                render={breakpoint => (
                  columns
                    .filter(column => !column.hidden)
                    .filter(column => showColumnByBreakpoint(column, breakpoint))
                    .map(mapColumnHeader)
                )}
              />
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
              sx={
                sxHover({
                  hover: rowHover,
                  pointer: !!onRowClick,
                })
              }
              onClick={(e) => handleRowClick(e, row)}
            >
              <BreakpointDeviceRender
                render={breakpoint => (
                  columns
                    .filter(column => !column.hidden)
                    .filter(column => showColumnByBreakpoint(column, breakpoint))
                    .map((column, columnIndex) => mapColumnBody(row, column, rowIndex, columnIndex))
                )}
              />
            </TableRow>
          ))}
        </TableBody>

      </MuiTable>
    </TableContainer>
  );
};
