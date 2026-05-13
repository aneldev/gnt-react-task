import React from "react";

import {useBreakpointDevice} from "./useBreakpointDevice";

type IUseBreakpointDeviceProps = ReturnType<typeof useBreakpointDevice>;

export type IWithBreakpointDeviceProps<TProps> = TProps & IUseBreakpointDeviceProps;

export function withBreakpointDevice<TProps>(
  Component: React.ComponentType<TProps & IUseBreakpointDeviceProps>,
): React.FC<TProps> {
  return function WithBreakpointDevice(props: TProps) {
    const breakpointDevice = useBreakpointDevice();
    return (
      <Component
        {...props}
        {...breakpointDevice}
      />
    );
  };
}
