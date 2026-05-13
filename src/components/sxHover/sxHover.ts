import type {
  SxProps,
  Theme,
} from "../ThemeProvider";
import {
  type TCSSAttr,
  sxTransition,
  ECSSDuration,
} from "../sxTransition";

export const sxHover = (
  {
    hover = true,
    pointer = false,
    additionalTransformCssAttrs = [],
  }: {
    hover?: boolean;
    pointer?: boolean;
    additionalTransformCssAttrs?: TCSSAttr[];
  } = {},
): SxProps<Theme> => ({
  transition: theme =>
    sxTransition(
      theme,
      [
        'background-color',
        ...additionalTransformCssAttrs,
      ],
      ECSSDuration.SHORT,
    ),
  ':hover': {
    backgroundColor: theme => hover ? theme.palette.background.paper : undefined,
    cursor: pointer ? 'pointer' : undefined,
  },
});
