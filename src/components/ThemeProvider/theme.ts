import React from "react";
import {
  type Theme as MuiTheme,
  createTheme as muiCreateTheme,
} from "@mui/material/styles";

import {MUIV9_PALETTE_LIGHT} from "./palettes/MUIV9_PALETTE_LIGHT";
import {MUIV9_PALETTE_DARK} from "./palettes/MUIV9_PALETTE_DARK";

// eslint-disable-next-line
export interface Theme extends MuiTheme {
}

export interface IThemeProviderProps {
  themeName?: EThemeName;
  themeSize?: EThemeSize;
  themeChange?: (themeName: EThemeName, theme: Theme) => void;
  children: React.ReactNode;
}

export enum EThemeName {
  MUI9_LIGHT = 'MUI9_LIGHT',
  MUI9_DARK = 'MUI9_DARK',
}

export enum EThemeSize {
  XSMALL = "XSMALL",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  XLARGE = "XLARGE",
}

const themeSizes: Record<EThemeSize, {spacing: number; fontSize: number}> = {
  [EThemeSize.XSMALL]: {spacing: 4, fontSize: 12},
  [EThemeSize.SMALL]: {spacing: 6, fontSize: 13},
  [EThemeSize.MEDIUM]: {spacing: 8, fontSize: 14},
  [EThemeSize.LARGE]: {spacing: 8, fontSize: 16},
  [EThemeSize.XLARGE]: {spacing: 10, fontSize: 18},
};

const themeExtByName = {
  [EThemeName.MUI9_LIGHT]: MUIV9_PALETTE_LIGHT,
  [EThemeName.MUI9_DARK]: MUIV9_PALETTE_DARK,
};

export const createTheme = (
  {
    themeName,
    themeSize,
  }: {
    themeName: EThemeName;
    themeSize: EThemeSize;
  },
): Theme => {
  const muiMode = themeName === EThemeName.MUI9_DARK ? 'dark' : 'light';

  const {spacing, fontSize} = themeSizes[themeSize];

  const getRem = (rem: number): string => `${fontSize * rem}px`;

  return muiCreateTheme(
    {
      palette: {mode: muiMode},
      spacing,
      typography: {
        fontSize,
        htmlFontSize: fontSize,
        h1: {fontSize: getRem(2), fontWeight: 'bold'},
        h2: {fontSize: getRem(1.8), fontWeight: 'normal'},
        h3: {fontSize: getRem(1.4), fontWeight: 'bold'},
        h4: {fontSize: getRem(1.3), fontWeight: 'normal'},
        h5: {fontSize: getRem(1.2), fontWeight: 'bold'},
        h6: {fontSize: getRem(1.1), fontWeight: 'normal'},
        body1: {fontSize: getRem(0.9)},
        body2: {fontSize: getRem(0.8)},
        button: {textTransform: 'none'},
      },
      components: {
        MuiUseMediaQuery: {
          defaultProps: {
            defaultMatches: true,
          },
        },
      },
    },
    themeExtByName[themeName],
  ) as Theme;
};
