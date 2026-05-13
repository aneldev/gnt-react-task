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

export interface IFlexItemMaxProps {
  innerRef?: React.Ref<HTMLDivElement>;
  flex?: number;        // Custom Flex, all other FlexItemMax should have flex value!
  fullHeight?: boolean;
  overFlowX?: boolean;
  overFlowY?: boolean;  // You need to use the ContainerJsHeight at close to root level.
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

export const FlexItemMax = (props: IFlexItemMaxProps): React.ReactNode => {
  const {
    innerRef,
    flex,
    fullHeight,
    overFlowX = false,
    overFlowY = false,
    sx: userSx = {},
    show = true,
    hidden = false,
    noSpacing = false,
    title,
    children = null,
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

  const applyFullHeight = fullHeight || overFlowY;

  const hiddenSx = hidden
    ? {height: 0, overflow: 'hidden', position: 'absolute', right: '100000px'} as const
    : {};

  const sx: SxProps<Theme> = {
    flex: flex || `1 1 100%`,
    height: applyFullHeight ? '100%' : undefined,
    position: 'relative',
    margin: noSpacing ? 0 : undefined,
    transition: theme => sxTransition(theme, "margin", ECSSDuration.SHORT),
    ...hiddenSx,
    ...userSx,
  };

  if (overFlowX || overFlowY) {
    const style: SxProps<Theme> = {
      overflowX: (() => {
        if (overFlowY && !overFlowX) return "hidden";
        if (overFlowX) return "auto";
        return undefined;
      })(),
      overflowY: (() => {
        if (overFlowX && !overFlowY) return "hidden";
        if (overFlowY) return "auto";
        return undefined;
      })(),
      width: overFlowX ? "1px" : undefined,
      height: overFlowY ? "1px" : undefined,
      minWidth: overFlowX ? '100%' : undefined,
      minHeight: (() => {
        if (applyFullHeight) return "100%";
        return overFlowY ? '100%' : undefined;
      })(),
    };
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
        <Box
          ref={innerRef}
          sx={style}
        >
          {children}
        </Box>
      </Box>
    );
  }
  return (
    <Box
      ref={innerRef}
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
