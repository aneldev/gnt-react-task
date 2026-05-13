import {useEffect} from "react";
import {ThemeProvider as MUI9ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";

import {GlobalScrollbars} from "./components/GlobalScrollbars";
import {
  type IThemeProviderProps,
  createTheme,
  EThemeName,
  EThemeSize,
} from "./theme";

export const ThemeProvider = (props: IThemeProviderProps): React.ReactNode => {
  const {
    themeName = EThemeName.MUI9_LIGHT,
    themeSize = EThemeSize.SMALL,
    themeChange,
    children,
  } = props;

  const theme = createTheme({themeName, themeSize});

  useEffect(() => {
    themeChange?.(themeName, theme);
  }, [theme, themeChange, themeName]);

  return (
    <MUI9ThemeProvider theme={theme}>
      <CssBaseline/>
      <GlobalScrollbars/>
      {children}
    </MUI9ThemeProvider>
  );
};
