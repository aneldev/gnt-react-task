import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

import type {IEvent} from "../../../api/IEvent";

export interface IEventLineProps {
  event: IEvent;
  starts: "before-day" | "within-day";
  ends: "within-day" | "after-day";
}

export const EventLine: React.FC<IEventLineProps> = ({event, starts}) => (
  <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 0}}>
    <Box sx={{flex: 1, minWidth: 0}}>
      <Typography
        variant="body2"
        noWrap
        sx={{fontWeight: 'bold', opacity: starts === 'before-day' ? 0.6 : 1}}
      >
        {event.title}
      </Typography>
      {event.description && (
        <Typography variant="body2" color="text.secondary" noWrap>
          {event.description}
        </Typography>
      )}
    </Box>
    {event.color && (
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: event.color,
          flexShrink: 0,
        }}
      />
    )}
  </Box>
);
