import React, {useEffect} from "react";
import {
  Box,
  Modal as MuiModal,
} from "@mui/material";

import {useBreakpointDevice} from "../useBreakpointDevice";
import {
  type Theme,
  type SxProps,
  alpha,
} from "../ThemeProvider";
import {EBackdrop} from "./types.ts";


export interface IModalProps {
  /**
   * Modal size for different device types.
   *
   * Mobile has always a default setup, the DEFAULT_MODAL_SIZE
   * All the rest cascade upworks (tablet uses mobile if not defined etc..)
   */
  size?: {
    mobile?: IModalSize;
    tablet?: IModalSize;
    laptop?: IModalSize;
    desktop?: IModalSize;
    wide?: IModalSize;
  };
  /**
   * Additional styles for the modal container but overridden be the modalSize!
   *
   * Also, overflow is overridden, to make it scrollable, set `scrollY`
   */
  sx?: SxProps<Theme>;
  /**
   * Controls whether the modal is visible
   *
   * To close the modal, set this to false from the parent
   */
  show: boolean;
  /**
   * Controls whether the modal should scroll vertically
   *
   * `maxHeight` is required, if not defined in the `size` then "90%" is applied ny default
   */
  scrollY?: boolean;
  /**
   * Dims the background behind the modal
   *
   * @default true
   */
  backdrop?: EBackdrop;
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Allows closing the modal by clicking the background
   */
  onBackdropClick?: () => void;
  /**
   * Allows closing the modal by pressing escape
   */
  onEscPress?: () => void;
}

export interface IModalSize {
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
}

const DEFAULT_MODAL_SIZE: IModalSize = {
  minWidth: 320,
  maxWidth: "90%",
  maxHeight: "90%" ,
};
export const Modal = (
  {
    sx: userSx = {},
    size = {},
    show,
    backdrop = EBackdrop.DIMMED_BLUR,
    children,
    scrollY = false,
    onBackdropClick,
    onEscPress,
  }: IModalProps,
): React.ReactNode => {
  const {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isWide,
  } = useBreakpointDevice();

  const mobile = size.mobile || DEFAULT_MODAL_SIZE;
  const tablet = size.tablet || mobile;
  const laptop = size.laptop || tablet;
  const desktop = size.desktop || laptop;
  const wide = size.wide || desktop;

  const sx: SxProps<Theme> = {
    ...(isMobile ? mobile : {}),
    ...(isTablet ? tablet : {}),
    ...(isLaptop ? laptop : {}),
    ...(isDesktop ? desktop : {}),
    ...(isWide ? wide : {}),
    ...userSx,
  };
  const handleClose = (
    _event: unknown,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") onBackdropClick?.();
    if (reason === "escapeKeyDown") onEscPress?.();
  };

  useEffect(() => {
    if (!show || !onEscPress) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscPress();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, onEscPress]);

  return (
    <MuiModal
      open={show}
      onClose={handleClose}
      hideBackdrop // No MUI Backdrop, we render our own Box
      disableAutoFocus
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
      }}
    >
      <Box sx={{display: "contents"}}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            cursor: onBackdropClick ? "pointer" : "default",
            transition: (theme: Theme) =>
              theme.transitions.create(
                ["background-color", "backdrop-filter"],
                {
                  duration: theme.transitions.duration.short,
                  easing: theme.transitions.easing.easeInOut,
                },
              ),
            ...getBackdropSx(backdrop),
          }}
          onClick={() => onBackdropClick?.()}
        />

        <Box
          sx={{
            ...sx,
            position: "relative",
            zIndex: 1, // Above our backdrop Box
            border: "2px solid",
            overflowY: scrollY ? "auto" : undefined,
            borderColor: (theme: Theme) => theme.palette.background.default,
            backgroundColor: (theme: Theme) => theme.palette.background.paper,
            boxShadow: (theme: Theme) => theme.shadows[5],
          }}
        >
          {children}
        </Box>
      </Box>
    </MuiModal>
  );
};

const getBackdropSx = (backdrop: EBackdrop): SxProps<Theme> => {
  if (!backdrop) return {backgroundColor: "transparent"};

  const dimmed = (theme: Theme) => alpha(theme.palette.background.default, 0.66);

  switch (backdrop) {
    case EBackdrop.DIMMED:
      return {
        backgroundColor: dimmed,
        backdropFilter: "none",
      };
    case EBackdrop.BLUR:
      return {
        backgroundColor: "transparent",
        backdropFilter: "blur(4px)",
      };
    case EBackdrop.DIMMED_BLUR:
    default:
      return {
        backgroundColor: dimmed,
        backdropFilter: "blur(4px)",
      };
  }
};
