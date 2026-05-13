import type {Theme} from "../ThemeProvider";
import {
  ECSSDuration,
  ECSSEasing,
} from "../ui-types";
// See the fault value at: https://mui.com/customization/default-theme/

export type TCSSAttr =
  | "opacity"
  | "color"
  | "border-color"
  | "background"
  | "background-color"
  | "padding"
  | "padding-left"
  | "padding-right"
  | "padding-top"
  | "padding-bottom"
  | "margin"
  | "margin-left"
  | "margin-right"
  | "margin-top"
  | "margin-bottom"
  | "width"
  | "height"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "transform"
  | "backdrop-filter"
  ;

export const sxTransition = (
  theme_: Theme,
  cssAttrs: TCSSAttr | TCSSAttr[],
  duration: ECSSDuration | number,
  easing: ECSSEasing = ECSSEasing.IN_OUT,
): string => {
  const theme: Theme = theme_;
  const applyDuration: number =
    typeof duration === "string"
      ? theme.transitions.duration[duration]
      : duration;
  return (
    (Array.isArray(cssAttrs)
      ? cssAttrs
      : [cssAttrs]
    )
      .map((cssAttr: string) =>
        theme.transitions.create(
          cssAttr,
          {
            easing: theme.transitions.easing[easing],
            duration: applyDuration,
          },
        ),
      )
      .join(', ')
  );
};

export const sxTransitionShowHide = (
  theme: Theme,
  attr: TCSSAttr | TCSSAttr[],
  currentShowValue: boolean,
): string =>
  currentShowValue
    ? sxTransition(theme, attr, ECSSDuration.LEAVING, ECSSEasing.IN_OUT)
    : sxTransition(theme, attr, ECSSDuration.ENTERING, ECSSEasing.SHARP);
