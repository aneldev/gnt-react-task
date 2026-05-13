import React from "react";

import type {TBoxSpacing} from "../ui-types";
import type {
  SxProps,
  Theme,
} from "../ThemeProvider";
import {FlexContainer} from "./FlexContainer";
import {EFlexContainerOrientation} from "./types";

export interface IFlexContainerHorizontalProps {
  sx?: SxProps<Theme>;
  show?: boolean;
  inline?: boolean;

  spacing?: TBoxSpacing;

  alignHorizontal?: 'left' | 'center' | 'right' | "stretch";
  alignHorizontalSpaceBetween?: boolean;
  alignVertical?: 'top' | 'middle' | 'bottom' | "stretch";

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

export const FlexContainerHorizontal = (props: IFlexContainerHorizontalProps): React.ReactNode => {
  const {
    sx = {},
    show = true,
    inline = false,
    spacing,

    alignHorizontal,
    alignHorizontalSpaceBetween,
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
      orientation={EFlexContainerOrientation.HORIZONTAL}
      title={title}

      spacing={spacing}

      justifyStart={alignHorizontal === 'left'}
      justifyCenter={alignHorizontal === 'center'}
      justifyEnd={alignHorizontal === 'right'}
      justifyStretch={alignHorizontal === 'stretch'}
      justifySpaceBetween={alignHorizontalSpaceBetween}

      alignStart={alignVertical === 'top'}
      alignCenter={alignVertical === 'middle'}
      alignEnd={alignVertical === 'bottom'}
      alignStretch={alignVertical === 'stretch'}

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
