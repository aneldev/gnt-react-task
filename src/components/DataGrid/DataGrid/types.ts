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
  fieldName: keyof TData | string;
  headerLabel: string;
  hidden?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  align?: EColumnAlign;
  cellRender?: TCellRenderMethod<TData>;
  headerSx?: SxProps<Theme>;
  cellSx?: SxProps<Theme>;
}
