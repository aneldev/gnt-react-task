import React from "react";
import {Box, Typography} from "@mui/material";

export interface IKbHintProps {
  keys: string[];
  label: string;
}

export const KbHint = ({keys, label}: IKbHintProps): React.ReactNode => (
  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
    {keys.map(k => (
      <Box
        key={k}
        component="kbd"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 22,
          height: 22,
          px: 0.75,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          backgroundColor: 'action.hover',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'text.secondary',
          lineHeight: 1,
          boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
        }}
      >
        {k}
      </Box>
    ))}
    <Typography variant="caption" color="text.disabled" sx={{ml: 0.5}}>
      {label}
    </Typography>
  </Box>
);
