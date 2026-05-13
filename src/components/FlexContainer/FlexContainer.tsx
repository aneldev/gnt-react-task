import React from "react";
import {Box} from "@mui/material";

import type {TBoxSpacing} from "../ui-types";
import {
  type SxProps,
  type Theme,
  useTheme,
} from "../ThemeProvider";
import {EFlexContainerOrientation} from "./types.ts";

export interface IFlexContainerProps {
  show?: boolean;
  inline?: boolean;
  orientation?: EFlexContainerOrientation;

  spacing?: TBoxSpacing;

  justifyStart?: boolean;
  justifyCenter?: boolean;
  justifyEnd?: boolean;
  justifyStretch?: boolean;
  justifySpaceBetween?: boolean;

  alignStart?: boolean;
  alignCenter?: boolean;
  alignEnd?: boolean;
  alignStretch?: boolean;

  leftRightSpace?: boolean;
  topBottomSpace?: boolean;

  reverseOrder?: boolean;

  fullHeight?: boolean;

  sx?: SxProps<Theme>;
  title?: string;

  children: React.ReactNode;

  onClick?: (e: React.MouseEvent) => void;
  onMouseMove?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onScroll?: (event: React.UIEvent) => void;
  onWheel?: (event: React.WheelEvent<HTMLDivElement>) => void;
}

export const FlexContainer = (props: IFlexContainerProps): React.ReactNode => {
  const {
    show = true,
    inline = false,
    orientation = EFlexContainerOrientation.HORIZONTAL,
    spacing = 0,
    justifyStart = false,
    justifyCenter = false,
    justifyEnd = false,
    justifyStretch = false,
    justifySpaceBetween = false,
    alignStart = false,
    alignCenter = false,
    alignEnd = false,
    alignStretch = false,
    leftRightSpace = true,
    topBottomSpace = true,
    fullHeight = false,
    reverseOrder = false,
    sx: userSx = {},
    title,
    children,
    onClick,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    onScroll,
    onWheel,
  } = props;
  const theme = useTheme();

  const innerBorderSpace =
    spacing
      ? theme.spacing(spacing)
      : undefined;

  const sx: SxProps<Theme> = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: (() => {
      if (!reverseOrder) {
        return orientation === EFlexContainerOrientation.VERTICAL
          ? 'column'
          : undefined;
      }
      return orientation === EFlexContainerOrientation.HORIZONTAL
        ? 'row-reverse'
        : 'column-reverse';
    })(),

    justifyContent: (() => {
      if (justifySpaceBetween) return "space-between";
      if (justifyStart) return "flex-start";
      if (justifyCenter) return "center";
      if (justifyEnd) return "flex-end";
      if (justifyStretch) return "stretch";
      return undefined;
    })(),

    alignItems: (() => {
      if (alignStart) return "flex-start";
      if (alignCenter) return "center";
      if (alignEnd) return "flex-end";
      if (alignStretch) return "stretch";
      return undefined;
    })(),

    mx: leftRightSpace ? undefined : -spacing,
    my: topBottomSpace ? undefined : -spacing,

    height: fullHeight ? '100%' : undefined,

    paddingRight: innerBorderSpace,
    paddingBottom: innerBorderSpace,
    "& > *": {
      marginTop: innerBorderSpace,
      marginLeft: innerBorderSpace,
    },
    ...userSx,
  };

  if (!show) return null;
  return (
    <Box
      sx={sx}
      title={title}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onScroll={onScroll}
      onWheel={onWheel}
    >
      {children}
    </Box>
  );
};
