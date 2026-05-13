import React from "react";
import {Box} from "@mui/material";

import type {
  Theme,
  SxProps,
} from "../ThemeProvider";

import {
  sxTransition,
  ECSSDuration,
} from "../sxTransition";

export interface IFlexItemMinProps {
  innerRef?: React.Ref<HTMLDivElement>;
  fullHeight?: boolean;
  width?: number;
  sx?: SxProps<Theme>;
  show?: boolean;       // Render or not
  hidden?: boolean;     // In the DOM but not visible
  noSpacing?: boolean;  // Do not apply spacing for this item. Useful when the content is shown with animation.
  title?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onMouseMove?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onScroll?: (event: React.UIEvent) => void;
  onWheel?: (event: React.WheelEvent<HTMLDivElement>) => void;
}

export const FlexItemMin = (props: IFlexItemMinProps): React.ReactNode => {
  const {
    innerRef,
    fullHeight,
    sx = {},
    width,
    show = true,
    hidden = false,
    noSpacing = false,
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

  if (!show) return null;

  return (
    <Box
      ref={innerRef}
      sx={{
        flex: '0 0',
        minHeight: fullHeight ? '100%' : undefined,
        position: 'relative',
        margin: noSpacing ? 0 : undefined,
        transition: theme => sxTransition(theme, "margin", ECSSDuration.SHORT),
        minWidth: width === undefined ? undefined : width,
        maxWidth: width === undefined ? undefined : width,
        ...(hidden ? {height: 0, overflow: 'hidden', position: 'absolute', right: '100000px'} : {}),
        ...sx,
      }}
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
