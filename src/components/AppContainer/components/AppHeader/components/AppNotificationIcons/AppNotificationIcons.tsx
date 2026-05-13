import {
  type MouseEvent,
  type ReactNode,
  useState,
} from "react";

import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import type {
  INotificationIcon,
  IProfileOption,
} from "../../../../types.ts";

import MoreVertIcon from "@mui/icons-material/MoreVert";

export interface IAppNotificationIconsProps {
  notificationIcons?: INotificationIcon[];
  profileUserName?: string;
  profileIcon?: ReactNode;
  profileOptions?: IProfileOption[];
}

export const AppNotificationIcons = (props: IAppNotificationIconsProps) => {
  const {
    notificationIcons = [],
    profileUserName,
    profileIcon,
    profileOptions = [],
  } = props;

  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [mobileAnchor, setMobileAnchor] = useState<HTMLElement | null>(null);

  const visibleIcons = notificationIcons.filter(n => n.show !== false);

  const handleProfileOpen = (e: MouseEvent<HTMLElement>) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleMobileOpen = (e: MouseEvent<HTMLElement>) => setMobileAnchor(e.currentTarget);
  const handleMobileClose = () => setMobileAnchor(null);

  const handleProfileOption = (onClick?: () => void) => {
    onClick?.();
    handleProfileClose();
  };

  return (
    <Box sx={{display: "flex", alignItems: "center"}}>
      {/* Desktop notification icons */}
      <Box sx={{display: {xs: "none", sm: "flex"}, alignItems: "center"}}>
        {visibleIcons.map(({icon, label, counter, disabled, onClick}) => (
          <IconButton
            key={label}
            aria-label={label}
            disabled={disabled}
            sx={{color: "inherit"}}
            onClick={() => !disabled && onClick?.()}
          >
            <Badge badgeContent={counter} color="secondary">
              {icon}
            </Badge>
          </IconButton>
        ))}
      </Box>

      {/* Profile */}
      {profileIcon && (
        <Box sx={{display: "flex", alignItems: "center"}}>
          {profileUserName && (
            <Box sx={{display: {xs: "none", md: "block"}, whiteSpace: "nowrap", mr: 1}}>
              {profileUserName}
            </Box>
          )}
          <IconButton
            aria-label="User profile"
            aria-controls="profile-menu"
            aria-haspopup="true"
            sx={{color: "inherit", "& img": {height: 36, borderRadius: "50%"}}}
            onClick={handleProfileOpen}
          >
            {profileIcon}
          </IconButton>
        </Box>
      )}

      {/* Mobile overflow icon */}
      {visibleIcons.length > 0 && (
        <Box sx={{display: {xs: "flex", sm: "none"}}}>
          <IconButton aria-label="Show more" sx={{color: "inherit"}} onClick={handleMobileOpen}>
            <MoreVertIcon/>
          </IconButton>
        </Box>
      )}

      {/* Profile menu */}
      <Menu
        id="profile-menu"
        anchorEl={profileAnchor}
        open={!!profileAnchor}
        onClose={handleProfileClose}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
      >
        {profileOptions.filter(o => !o.hidden).map(({label, icon, disabled, onClick}) => (
          <MenuItem key={label} disabled={disabled} onClick={() => handleProfileOption(onClick)}>
            {icon && <Box sx={{mr: 1, display: "flex"}}>{icon}</Box>}
            {label}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile menu */}
      <Menu
        anchorEl={mobileAnchor}
        open={!!mobileAnchor}
        onClose={handleMobileClose}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
      >
        {visibleIcons.map(({icon, label, counter, disabled, onClick}) => (
          <MenuItem key={label} disabled={disabled} onClick={() => { if (!disabled) onClick?.(); handleMobileClose(); }}>
            <Badge badgeContent={counter} color="secondary" sx={{mr: 1}}>
              {icon}
            </Badge>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
