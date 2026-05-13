import type {TObject} from '../../typescript';

import type {
  SxProps,
  Theme,
} from '../../ThemeProvider';
import type {
  EColumnAlign,
  TCellRenderMethod,
} from '../../Table';

export interface IDataGridColumn<TData extends TObject> {
  /** Key used to read the cell value from each row. Use a free string for computed columns that rely solely on `cellRender`. */
  fieldName: keyof TData | string;
  /** Text displayed in the column header and in the show/hide column menu. */
  headerLabel: string;
  /** Column is hidden by default but remains available in the column-visibility menu. */
  hidden?: boolean;
  /** Enables click-to-sort on this column. The sort cycles: ascending → descending → off. */
  sortable?: boolean;
  /** Renders a text filter input below the header label. Matching is case-insensitive substring. */
  filterable?: boolean;
  /** Horizontal alignment of the cell content. */
  align?: EColumnAlign;
  /** Custom cell renderer. Receives the full row — use when the raw field value needs formatting or interactive elements. */
  cellRender?: TCellRenderMethod<TData>;
  /** MUI `sx` override for the header cell. */
  headerSx?: SxProps<Theme>;
  /** MUI `sx` override for all data cells in this column. */
  cellSx?: SxProps<Theme>;
}
