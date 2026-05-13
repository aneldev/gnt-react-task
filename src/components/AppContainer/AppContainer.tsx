import {useState} from "react";
import {
  Box,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  type IAppContainerProps,
  EOpenMode,
} from "./types.ts";

import {AppHeader} from "./components/AppHeader";
import {AsideMenu} from "./components/AsideMenu";

export type {IAppContainerProps};

const LS_KEY = "AppContainer-open-mode";
const DEFAULT_ASIDE_WIDTH = 256;
const MINIMIZED_WIDTH = 64;

export const AppContainer = (props: IAppContainerProps) => {
  const {
    logoSquareWhite,
    logoSquareBlack,
    logoLandscapeWhite,
    logoLandscapeBlack,
    showAlwaysSquare,
    appTitle,
    appTitleHelper,
    appTitleContent,
    initialOpenMode = EOpenMode.COLLAPSED,
    showMinimizedOption,
    asideMenuWidth = DEFAULT_ASIDE_WIDTH,
    selectedMenuId,
    menuItemsTop,
    menuItems,
    menuItemsBottom,
    bottomAppInfo,
    profileIcon,
    profileUserName,
    profileOptions,
    notificationIcons,
    children,
    onLogoClick,
    onExpand,
    onMinimize,
    onCollapse,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  const [openMode, setOpenModeState] = useState<EOpenMode>(() => {
    if (initialOpenMode === "LAST") {
      return (localStorage.getItem(LS_KEY) as EOpenMode) || EOpenMode.COLLAPSED;
    }
    return initialOpenMode;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const effectiveOpenMode =
    isMobile
      ? (mobileOpen
        ? EOpenMode.EXPANDED
        : EOpenMode.COLLAPSED)
      : openMode;

  const setOpenMode = (mode: EOpenMode) => {
    setOpenModeState(mode);
    localStorage.setItem(LS_KEY, mode);
  };

  const handleExpand = () => {
    if (isMobile) {
      setMobileOpen(true);
    }
    else {
      setOpenMode(EOpenMode.EXPANDED);
    }
    onExpand?.();
  };
  const handleMinimize = () => {
    setOpenMode(EOpenMode.MINIMIZED);
    onMinimize?.();
  };
  const handleCollapse = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
    else {
      setOpenMode(EOpenMode.COLLAPSED);
    }
    onCollapse?.();
  };

  const handleToggle = () => {
    if (effectiveOpenMode === EOpenMode.EXPANDED) {
      if (isMobile) handleCollapse(); else handleMinimize();
    }
    else {
      handleExpand();
    }
  };

  const logoSquare = isDark ? logoSquareWhite : logoSquareBlack;
  const logoLandscape = isDark ? logoLandscapeWhite : logoLandscapeBlack;

  const desktopDrawerWidth =
    effectiveOpenMode === EOpenMode.EXPANDED ? asideMenuWidth
      : effectiveOpenMode === EOpenMode.MINIMIZED ? MINIMIZED_WIDTH
        : 0;

  const drawerContent = (
    <AsideMenu
      logoSquareImage={logoSquare}
      logoLandscapeImage={logoLandscape}
      showAlwaysSquare={showAlwaysSquare}
      openMode={effectiveOpenMode}
      selectedMenuId={selectedMenuId}
      asideMenuWidth={asideMenuWidth}
      menuItemsTop={menuItemsTop}
      menuItems={menuItems}
      menuItemsBottom={menuItemsBottom}
      bottomAppInfo={bottomAppInfo}
      showMinimizedOption={showMinimizedOption}
      onLogoClick={onLogoClick}
      onToggle={handleToggle}
      onCollapse={handleCollapse}
    />
  );

  return (
    <Box sx={{display: "flex"}}>
      {/* Mobile: temporary drawer overlays content */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={effectiveOpenMode === EOpenMode.EXPANDED}
          onClose={handleCollapse}
          ModalProps={{keepMounted: true}}
          sx={{"& .MuiDrawer-paper": {width: asideMenuWidth, boxSizing: "border-box"}}}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop: permanent drawer pushes content */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: desktopDrawerWidth,
            flexShrink: 0,
            transition: theme.transitions.create("width"),
            "& .MuiDrawer-paper": {
              width: desktopDrawerWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: theme.transitions.create("width"),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column"}}>
        <AppHeader
          logoSquareImage={logoSquare}
          appTitle={appTitle}
          appTitleHelper={appTitleHelper}
          appTitleContent={appTitleContent}
          openMode={effectiveOpenMode}
          notificationIcons={notificationIcons}
          profileUserName={profileUserName}
          profileIcon={profileIcon}
          profileOptions={profileOptions}
          onLogoClick={onLogoClick}
          onMenuClick={handleExpand}
        />
        <Box component="main" sx={{flex: 1, p: 3}}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
