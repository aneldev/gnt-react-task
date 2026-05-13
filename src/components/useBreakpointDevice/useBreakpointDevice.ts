import {
  useTheme,
  useMediaQuery,
} from "../ThemeProvider";
import {EBreakpoint} from "../ContainerBreakpoint";
import {EBreakpointDevice} from "../ui-types";

/**
 * Resolves the device breakpoint based on screen size.
 *
 * For container-based breakpoints, use ContainerBasedDeviceProvider instead (recommended).
 *
 * **Note:** Instead of this hook, consider to use ContainerBasedDeviceProvider for more responsive content
 */
export const useBreakpointDevice = (): {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isWide: boolean;
  device: EBreakpointDevice;
} => {
  const theme = useTheme();

  const m = useMediaQuery(theme.breakpoints.down(EBreakpoint.SMALL));
  const t = useMediaQuery(theme.breakpoints.down(EBreakpoint.MEDIUM));
  const l = useMediaQuery(theme.breakpoints.down(EBreakpoint.LARGE));
  const d = useMediaQuery(theme.breakpoints.down(EBreakpoint.XLARGE));

  const device = (() => {
    if (m) return EBreakpointDevice.MOBILE;
    if (t) return EBreakpointDevice.TABLET;
    if (l) return EBreakpointDevice.LAPTOP;
    if (d) return EBreakpointDevice.DESKTOP;
    return EBreakpointDevice.WIDE;
  })();

  // 3. Derive exclusive booleans from the result
  return {
    device,
    isMobile: device === EBreakpointDevice.MOBILE,
    isTablet: device === EBreakpointDevice.TABLET,
    isLaptop: device === EBreakpointDevice.LAPTOP,
    isDesktop: device === EBreakpointDevice.DESKTOP,
    isWide: device === EBreakpointDevice.WIDE,
  };
};
