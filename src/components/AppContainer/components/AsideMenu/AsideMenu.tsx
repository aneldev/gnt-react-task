import type {ReactNode} from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";

import {
  type TMenuItemDivider,
  EOpenMode,
} from "../../types.ts";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const MINIMIZED_WIDTH = 64;

export interface IAsideMenuProps {
  logoSquareImage?: string;
  logoLandscapeImage?: string;
  showAlwaysSquare?: boolean;
  openMode: EOpenMode;
  selectedMenuId?: string;
  asideMenuWidth: number;
  menuItemsTop?: TMenuItemDivider[];
  menuItems: TMenuItemDivider[];
  menuItemsBottom?: TMenuItemDivider[];
  bottomAppInfo?: ReactNode;
  showMinimizedOption?: boolean;
  onLogoClick?: () => void;
  onToggle: () => void;
  onCollapse: () => void;
}

export const AsideMenu = (props: IAsideMenuProps) => {
  const {
    logoSquareImage,
    logoLandscapeImage,
    showAlwaysSquare,
    openMode,
    selectedMenuId,
    asideMenuWidth,
    menuItemsTop = [],
    menuItems,
    menuItemsBottom = [],
    bottomAppInfo,
    showMinimizedOption,
    onLogoClick,
    onToggle,
    onCollapse,
  } = props;

  const theme = useTheme();
  const isExpanded = openMode === EOpenMode.EXPANDED;
  const isMinimized = openMode === EOpenMode.MINIMIZED;
  const showLandscape = isExpanded && !showAlwaysSquare;
  const width = isExpanded ? asideMenuWidth : isMinimized ? MINIMIZED_WIDTH : 0;

  const renderItems = (items: TMenuItemDivider[], level = 0): ReactNode => (
    <List dense disablePadding>
      {items.map((item, i) => {
        if (item === "DIVIDER") return <Divider key={`divider-${i}`}/>;
        if (item.hidden) return null;
        const selected = !!item.menuId && item.menuId === selectedMenuId;
        return (
          <ListItem key={item.menuId ?? item.title} disablePadding>
            <ListItemButton
              selected={selected}
              disabled={item.disabled}
              sx={{pl: 2 + level * 2}}
              onClick={item.onClick}
            >
              <ListItemIcon sx={{minWidth: 36}}>
                {item.icon ?? <FiberManualRecordIcon sx={{fontSize: 12}}/>}
              </ListItemIcon>
              {isExpanded && (
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  slotProps={{primary: {noWrap: true}}}
                />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create("width"),
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Logo + collapse button */}
      <Box sx={{display: "flex", alignItems: "center", minHeight: 56, px: 1}}>
        <Box sx={{flex: 1, cursor: onLogoClick ? "pointer" : undefined, overflow: "hidden"}} onClick={onLogoClick}>
          {(isMinimized || showAlwaysSquare) && (
            <Box component="img" src={logoSquareImage} alt="Logo" sx={{height: 40, display: "block"}}/>
          )}
          {showLandscape && (
            <Box component="img" src={logoLandscapeImage} alt="Logo" sx={{maxWidth: 160, height: 40, display: "block"}}/>
          )}
        </Box>
        <IconButton
          sx={{display: isMinimized ? "none" : undefined}}
          aria-label="Collapse menu"
          size="small"
          onClick={onCollapse}
        >
          {theme.direction === "rtl" ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
        </IconButton>
      </Box>

      <Divider/>

      {/* Fixed top items */}
      {menuItemsTop.length > 0 && (
        <>
          {renderItems(menuItemsTop)}
          <Divider/>
        </>
      )}

      {/* Scrollable main items */}
      <Box sx={{flex: 1, overflowY: "auto"}}>
        {renderItems(menuItems)}
      </Box>

      {/* Fixed bottom items */}
      {menuItemsBottom.length > 0 && (
        <>
          <Divider/>
          {renderItems(menuItemsBottom)}
        </>
      )}

      {/* Minimize toggle */}
      {showMinimizedOption && (
        <>
          <Divider/>
          <List dense disablePadding>
            <ListItem disablePadding>
              <ListItemButton onClick={onToggle}>
                <ListItemIcon sx={{minWidth: 36}}>
                  {isExpanded ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </ListItemIcon>
                {isExpanded && <ListItemText primary={isExpanded ? "Minimize" : "Expand"}/>}
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}

      {/* Bottom app info */}
      {bottomAppInfo && isExpanded && (
        <Box sx={{p: 1}}>{bottomAppInfo}</Box>
      )}
    </Box>
  );
};
