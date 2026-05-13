import React from "react";

import type {TBoxSpacing} from "../ui-types";
import type {
  SxProps,
  Theme,
} from "../ThemeProvider";
import {FlexContainer} from "./FlexContainer";
import {EFlexContainerOrientation} from "./types.ts";

export interface IFlexContainerVerticalProps {
  sx?: SxProps<Theme>;
  show?: boolean;
  inline?: boolean;

  spacing?: TBoxSpacing;

  alignHorizontal?: 'left' | 'center' | 'right' | "stretch";
  alignVertical?: 'top' | 'middle' | 'bottom' | "stretch";
  alignVerticalSpaceBetween?: boolean;

  leftRightSpace?: boolean;
  topBottomSpace?: boolean;

  reverseOrder?: boolean;

  fullHeight?: boolean;

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

export const FlexContainerVertical = (props: IFlexContainerVerticalProps): React.ReactNode => {
  const {
    sx = {},
    show = true,
    inline,
    spacing,

    alignHorizontal,
    alignVerticalSpaceBetween,
    alignVertical,

    leftRightSpace,
    topBottomSpace,

    reverseOrder,
    fullHeight,

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
  return (
    <FlexContainer
      sx={sx}
      show={show}
      inline={inline}
      orientation={EFlexContainerOrientation.VERTICAL}
      title={title}

      spacing={spacing}

      justifyStart={alignVertical === 'top'}
      justifyCenter={alignVertical === 'middle'}
      justifyEnd={alignVertical === 'bottom'}
      justifyStretch={alignVertical === 'stretch'}
      justifySpaceBetween={alignVerticalSpaceBetween}

      alignStart={alignHorizontal === 'left'}
      alignCenter={alignHorizontal === 'center'}
      alignEnd={alignHorizontal === 'right'}
      alignStretch={alignHorizontal === 'stretch'}

      leftRightSpace={leftRightSpace}
      topBottomSpace={topBottomSpace}

      fullHeight={fullHeight}
      reverseOrder={reverseOrder}

      children={children}

      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onScroll={onScroll}
      onWheel={onWheel}
    />
  );
};
