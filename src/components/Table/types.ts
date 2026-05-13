import React from 'react';

import type {TObject} from '../typescript';

import {EBreakpointDevice} from "../ui-types";

import type {
  Theme,
  SxProps,
} from "../ThemeProvider";

export interface IColumn<TData extends TObject> {
  fieldName: keyof TData | string;
  align?: EColumnAlign;           // Default is EAlign.RIGHT
  sticky?: boolean;               // Make the column fixed, this turns automatically the table to horizontal scrollable

  headerSx?: SxProps<Theme>;
  headerLabel: string | React.ReactNode;
  headerTooltip?: string;

  breakpoints?: ('allExclude' | EBreakpointDevice)[];

  cellSx?: SxProps<Theme>;
  cellRender?: TCellRenderMethod<TData>;

  sortable?: boolean;
  hidden?: boolean;
}

export type TCellRenderMethod<TData extends TObject, TValue = unknown> = (
  cellValue: TValue,
  args: {
    row: TData;
    rows: TData[];
    prevRow: TData | null;
    nextRow: TData | null;
    index: number;
  },
) => React.ReactNode | string | number | null;

export enum EColumnAlign {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export interface ITableSort<TData> {
  fieldName?: keyof TData;
  direction: 0 | 1 | -1;
}

export enum ETableSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}
