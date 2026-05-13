import React from "react";

import {
  ContainerBreakpoint,
  EBreakpoint,
} from "../ContainerBreakpoint";
import {EBreakpointDevice} from "../ui-types";

export interface IContainerDeviceBreakpointProps {
  allExcept?: boolean;      // Default is false, if true reverts the rest props

  mobile?: boolean;         // Default is false
  tablet?: boolean;         // Default is false
  laptop?: boolean;         // Default is false
  desktop?: boolean;        // Default is false
  wide?: boolean;           // Default is false, aka: infinite

  in?: EBreakpointDevice[]; // Default is [], in breakpoints

  children: React.ReactNode;
}

export const ContainerDeviceBreakpoint = (props: IContainerDeviceBreakpointProps): React.ReactNode => {
  const {
    allExcept = false,
    mobile = false,
    tablet = false,
    laptop = false,
    desktop = false,
    wide = false,
    "in": _in = [],
    children,
  } = props;

  const calcAllExcept = (show: boolean): boolean => allExcept ? !show : show;

  return (
    <>
      {calcAllExcept(mobile || _in.includes(EBreakpointDevice.MOBILE)) && (
        <ContainerBreakpoint
          breakpoint={EBreakpoint.XSMALL}
          toBreakpoint={EBreakpoint.SMALL}
        >
          {children}
        </ContainerBreakpoint>
      )}
      {calcAllExcept(tablet || _in.includes(EBreakpointDevice.TABLET)) && (
        <ContainerBreakpoint
          breakpoint={EBreakpoint.SMALL}
          toBreakpoint={EBreakpoint.MEDIUM}
        >
          {children}
        </ContainerBreakpoint>
      )}
      {calcAllExcept(laptop || _in.includes(EBreakpointDevice.LAPTOP)) && (
        <ContainerBreakpoint
          breakpoint={EBreakpoint.MEDIUM}
          toBreakpoint={EBreakpoint.LARGE}
        >
          {children}
        </ContainerBreakpoint>
      )}
      {calcAllExcept(desktop || _in.includes(EBreakpointDevice.DESKTOP)) && (
        <ContainerBreakpoint
          breakpoint={EBreakpoint.LARGE}
          toBreakpoint={EBreakpoint.XLARGE}
        >
          {children}
        </ContainerBreakpoint>
      )}
      {calcAllExcept(wide || _in.includes(EBreakpointDevice.WIDE)) && (
        <ContainerBreakpoint
          breakpoint={EBreakpoint.XLARGE}
        >
          {children}
        </ContainerBreakpoint>
      )}
    </>
  );

};
