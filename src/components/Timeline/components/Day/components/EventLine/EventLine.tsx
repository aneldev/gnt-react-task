import * as React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

import {
  type ITimelineDataBase,
  type TLocalDate,
  type TRenderEvent,
  toLocalDate,
} from "../../../../types.ts";

export interface IEventLineProps<TEvent extends ITimelineDataBase> {
  day: TLocalDate;
  event: TEvent;

  viewportStart: TLocalDate;
  viewportEnd: TLocalDate;

  isSelected: boolean;
  getAriaLabel: (event: TEvent) => string;

  renderEvent: TRenderEvent<TEvent>;

  onEventClick?: (eventId: string, day: TLocalDate) => void;
}

function EventLineImpl<TEvent extends ITimelineDataBase>(
  {
    day,
    event,
    isSelected,
    getAriaLabel,
    renderEvent,
    onEventClick,
  }: IEventLineProps<TEvent>,
): React.ReactNode {
  const starts: "before-day" | "within-day" =
    toLocalDate(event.startDate) < day ? "before-day" : "within-day";

  const ends: "within-day" | "after-day" =
    toLocalDate(event.endDate) > day ? "after-day" : "within-day";

  const isFilled  = starts === "within-day";
  const isEndRole = starts === "before-day" && ends === "within-day";

  const handleClick = () => onEventClick?.(event.id, day);

  return (
    <Box
      component="li"
      className="js-timeline-event"
      data-day={day}
      data-event-id={event.id}
      tabIndex={isSelected ? 0 : -1}
      aria-current={isSelected || undefined}
      aria-label={getAriaLabel(event)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 0.75,
        px: 1,
        borderRadius: 1,
        cursor: 'pointer',
        outline: 'none',
        listStyle: 'none',
        backgroundColor: isSelected ? 'action.selected' : 'transparent',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '-2px',
        },
      }}
      onClick={handleClick}
    >
      {/* Dot */}
      <Box
        aria-hidden
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          flexShrink: 0,
          alignSelf: 'flex-start',
          mt: '4px',
          ...(isFilled
            ? {backgroundColor: 'primary.main'}
            : {
                border: '2px solid',
                borderColor: isEndRole ? 'primary.main' : 'text.disabled',
                backgroundColor: 'background.paper',
              }
          ),
        }}
      />

      {/* Consumer content (title, badge, etc.) */}
      <Box sx={{flex: 1, minWidth: 0}}>
        {renderEvent({event, starts, ends})}
      </Box>

      {/* Temporal info — role-driven, owned by EventLine */}
      <Box sx={{flexShrink: 0}}>
        {starts === 'within-day' && ends === 'within-day' && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatTime(event.startDate)} – {formatTime(event.endDate)}
          </Typography>
        )}

        {starts === 'within-day' && ends === 'after-day' && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatTime(event.startDate)} – {formatDateRange(event.startDate, event.endDate)}
            {' · ⏱ '}{durationDays(event.startDate, event.endDate)} days
          </Typography>
        )}

        {starts === 'before-day' && ends === 'after-day' && (
          <Typography variant="body2" color="text.disabled" sx={{fontStyle: 'italic'}}>
            continuing...
          </Typography>
        )}

        {starts === 'before-day' && ends === 'within-day' && (
          <Typography variant="body2" color="text.disabled" sx={{fontStyle: 'italic'}}>
            ends today · {formatTime(event.endDate)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export const EventLine = React.memo(EventLineImpl) as typeof EventLineImpl;

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});

const formatDateRange = (start: Date, end: Date): string => {
  const s = start.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  const e = end.getMonth() === start.getMonth()
    ? String(end.getDate())
    : end.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  return `${s}–${e}`;
};

const durationDays = (start: Date, end: Date): number => {
  const s = toLocalDate(start).split('-').map(Number);
  const e = toLocalDate(end).split('-').map(Number);
  return Math.round(
    (new Date(e[0], e[1] - 1, e[2]).getTime() - new Date(s[0], s[1] - 1, s[2]).getTime()) / 86400000,
  ) + 1;
};
