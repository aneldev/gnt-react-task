import React from "react";

import {
  useTheme,
  useMediaQuery,
} from "../ThemeProvider";
import {EBreakpoint} from "./types";

export interface IContainerBreakpointProps {
  breakpoint: EBreakpoint;   // From start of breakpoint
  toBreakpoint?: EBreakpoint; // To start of an breakpoint
  children: React.ReactNode;
}

export const ContainerBreakpoint = (props: IContainerBreakpointProps): React.ReactNode => {
  const { breakpoint, toBreakpoint, children } = props;
  const theme = useTheme();

  const upQuery = useMediaQuery(theme.breakpoints.up(breakpoint));
  const betweenQuery = useMediaQuery(theme.breakpoints.between(breakpoint, toBreakpoint ?? EBreakpoint.XLARGE));

  const matches = toBreakpoint ? betweenQuery : upQuery;

  return <>{matches ? children : null}</>;
};
