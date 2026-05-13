import type {ReactNode} from "react";

import {
  Box,
  IconButton,
  useTheme,
} from "@mui/material";

import {
  type INotificationIcon,
  type IProfileOption,
  EOpenMode,
} from "../../types.ts";

import {AppNotificationIcons} from "./components/AppNotificationIcons";

import MenuIcon from "@mui/icons-material/Menu";

export interface IAppHeaderProps {
  logoSquareImage?: string;
  appTitle?: string;
  appTitleHelper?: string;
  appTitleContent?: ReactNode;
  openMode: EOpenMode;
  notificationIcons?: INotificationIcon[];
  profileUserName?: string;
  profileIcon?: ReactNode;
  profileOptions?: IProfileOption[];
  onLogoClick?: () => void;
  onMenuClick: () => void;
}

export const AppHeader = (props: IAppHeaderProps) => {
  const {
    logoSquareImage,
    appTitle,
    appTitleHelper,
    appTitleContent,
    openMode,
    notificationIcons,
    profileUserName,
    profileIcon,
    profileOptions,
    onLogoClick,
    onMenuClick,
  } = props;

  const theme = useTheme();
  const isCollapsed = openMode === EOpenMode.COLLAPSED;

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1,
        minHeight: 56,
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        gap: 1,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      {isCollapsed && logoSquareImage && (
        <Box
          component="img"
          src={logoSquareImage}
          alt="App logo"
          sx={{height: 32, cursor: onLogoClick ? "pointer" : undefined}}
          onClick={onLogoClick}
        />
      )}

      {isCollapsed && (
        <IconButton aria-label="Open menu" sx={{color: "inherit"}} onClick={onMenuClick}>
          <MenuIcon/>
        </IconButton>
      )}

      <Box sx={{flex: 1, minWidth: 0}}>
        {appTitleContent ?? (
          <Box sx={{ml: isCollapsed ? 0 : 2}}>
            <Box sx={{fontWeight: "bold", fontSize: theme.typography.fontSize * 1.2}}>
              {appTitle}
            </Box>
            {appTitleHelper && (
              <Box sx={{fontSize: theme.typography.fontSize, display: {xs: "none", sm: "block"}}}>
                {appTitleHelper}
              </Box>
            )}
          </Box>
        )}
      </Box>

      <AppNotificationIcons
        notificationIcons={notificationIcons}
        profileUserName={profileUserName}
        profileIcon={profileIcon}
        profileOptions={profileOptions}
      />
    </Box>
  );
};
