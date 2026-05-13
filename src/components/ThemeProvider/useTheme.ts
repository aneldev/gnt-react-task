import {useTheme as muiUseTheme} from "@mui/material/styles";

import type {Theme} from "./theme";

export const useTheme = (): Theme => {
  return muiUseTheme() as Theme;
};
