import React from "react";

import {ContainerDeviceBreakpoint} from "../ContainerDeviceBreakpoint";
import {EBreakpointDevice} from "../ui-types";

export interface IBreakpointDeviceRenderProps {
  render: (breakpoint: EBreakpointDevice) => React.ReactNode;
}

export const BreakpointDeviceRender = (props: IBreakpointDeviceRenderProps): React.ReactNode => {
  const {render} = props;

  return (
    <>
      <ContainerDeviceBreakpoint mobile>
        {render(EBreakpointDevice.MOBILE)}
      </ContainerDeviceBreakpoint>
      <ContainerDeviceBreakpoint tablet>
        {render(EBreakpointDevice.TABLET)}
      </ContainerDeviceBreakpoint>
      <ContainerDeviceBreakpoint laptop>
        {render(EBreakpointDevice.LAPTOP)}
      </ContainerDeviceBreakpoint>
      <ContainerDeviceBreakpoint desktop>
        {render(EBreakpointDevice.DESKTOP)}
      </ContainerDeviceBreakpoint>
      <ContainerDeviceBreakpoint wide>
        {render(EBreakpointDevice.WIDE)}
      </ContainerDeviceBreakpoint>
    </>
  );
};
