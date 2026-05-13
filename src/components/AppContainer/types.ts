import type {ReactNode} from "react";

export enum EOpenMode {
  EXPANDED = "EXPANDED",
  MINIMIZED = "MINIMIZED",
  COLLAPSED = "COLLAPSED",
}

export interface IAppContainerProps {
  logoSquareWhite: string;
  logoSquareBlack: string;
  logoLandscapeWhite: string;   // max width: 200px height: 56px
  logoLandscapeBlack: string;

  showAlwaysSquare?: boolean;

  appTitle?: string;
  appTitleHelper?: string;
  appTitleContent?: ReactNode;

  initialOpenMode?: EOpenMode | "LAST";
  showMinimizedOption?: boolean;

  asideMenuWidth?: number;

  selectedMenuId?: string;
  menuItemsTop?: TMenuItemDivider[];
  menuItems: TMenuItemDivider[];
  menuItemsBottom?: TMenuItemDivider[];
  bottomAppInfo?: ReactNode;

  profileIcon?: ReactNode;
  profileUserName?: string;
  profileOptions?: IProfileOption[];

  notificationIcons?: INotificationIcon[];

  children: ReactNode;

  onLogoClick?: () => void;
  onExpand?: () => void;
  onMinimize?: () => void;
  onCollapse?: () => void;
}

export type TMenuItemDivider = IMenuItem | "DIVIDER";

export interface IMenuItem {
  menuId?: string;
  icon?: ReactNode;
  hidden?: boolean;
  disabled?: boolean;
  title: string;
  description?: string;
  children?: TMenuItemDivider[];
  onClick?: () => void;
}

export interface INotificationIcon {
  show?: boolean;
  icon: ReactNode;
  label: string;
  counter?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export interface IProfileOption {
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
}
