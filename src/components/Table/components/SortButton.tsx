import {useTheme} from "../../ThemeProvider";
import {sxHover} from "../../sxHover";

import SortNoneIcon from "@mui/icons-material/ImportExport";
import SortAscIcon from "@mui/icons-material/ArrowUpward";
import ArrowDescIcon from "@mui/icons-material/ArrowDownward";

export interface ISortButtonProps<TData> {
  fieldName: keyof TData | string;
  sort: 0 | 1 | -1;
  onChange: (fieldName: keyof TData | string, direction: 0 | 1 | -1) => void;
}

export const SortButton = <TData, >(props: ISortButtonProps<TData>): React.ReactNode => {
  const {
    fieldName,
    sort,
    onChange,
  } = props;
  const theme = useTheme();

  const handleClick = (): void => {
    const cycle: (0 | 1 | -1)[] = [0, 1, -1];
    const next = (cycle.indexOf(sort) + 1) % cycle.length;
    onChange(fieldName, cycle[next]);
  };

  const Icon = (() => {
    switch (sort) {
      case 0: return SortNoneIcon;
      case 1: return SortAscIcon;
      case -1: return ArrowDescIcon;
    }
  })();

  return (
    <span
      style={{
        position: 'relative',
        top: 6,
        whiteSpace: "nowrap",
      }}
    >
      <Icon
        sx={{
          fontSize: 16,
          color: sort !== 0 ? theme.palette.primary.main : theme.palette.text.secondary,
          ...sxHover({pointer: true}),
        }}
        onClick={handleClick}
      />
    </span>
  );
};
