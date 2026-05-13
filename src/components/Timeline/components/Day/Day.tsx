import React from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import type {
  ITimelineDataBase,
  TLocalDate,
  TRenderEvent,
} from "../../types.ts";

import {EventLine} from "./components/EventLine";

export interface IDayProps<TEvent extends ITimelineDataBase> {
  day: TLocalDate;
  /**
   * Events that start on, or span through, this day.
   */
  dayEvents: TEvent[];

  viewportStart: TLocalDate;
  viewportEnd: TLocalDate;

  renderDayHeader?: (args: {
    day: TLocalDate;
    dayLabel: string;
  }) => React.ReactNode;

  selectedDay: TLocalDate;
  selectedEventId: string;

  renderEvent: TRenderEvent<TEvent>;
  getAriaLabel: (event: TEvent) => string;

  onDayClick?: (day: TLocalDate) => void;
  onEventClick?: (eventId: string, day: TLocalDate) => void;
}

function DayImpl<TEvent extends ITimelineDataBase>(
  {
    day,
    dayEvents,
    viewportStart,
    viewportEnd,
    renderDayHeader,
    selectedDay,
    selectedEventId,
    renderEvent,
    getAriaLabel,
    onDayClick,
    onEventClick,
  }: IDayProps<TEvent>,
): React.ReactNode {
  const dayLabel = formatDayLabel(day);

  return (
    <Box
      component="section"
      aria-label={`${dayLabel}, ${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''}`}
      sx={{mb: 3}}
    >
      {/* ── Day header ────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1,
          cursor: 'pointer',
        }}
        onClick={() => onDayClick?.(day)}
      >
        <Box sx={{width: 12, height: '1px', backgroundColor: 'divider', flexShrink: 0}}/>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {renderDayHeader
            ? renderDayHeader({day, dayLabel})
            : dayLabel}
        </Typography>
        <Box sx={{flex: 1, height: '1px', backgroundColor: 'divider'}}/>
      </Box>

      {/* ── Events with vertical connector ────────────── */}
      <Box
        component="ul"
        aria-label={`Events on ${dayLabel}`}
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          ml: 2.5,
          pl: 1.5,
          borderLeft: '2px solid',
          borderColor: 'divider',
        }}
      >
        {dayEvents.map(event => (
          <EventLine
            key={event.id}
            day={day}
            event={event}
            viewportStart={viewportStart}
            viewportEnd={viewportEnd}
            isSelected={selectedDay === day && selectedEventId === event.id}
            renderEvent={renderEvent}
            getAriaLabel={getAriaLabel}
            onEventClick={onEventClick}
          />
        ))}
      </Box>
    </Box>
  );
}

export const Day = React.memo(DayImpl, (prev, next) => {
  if (
    prev.day !== next.day ||
    prev.dayEvents !== next.dayEvents ||
    prev.viewportStart !== next.viewportStart ||
    prev.viewportEnd !== next.viewportEnd ||
    prev.selectedDay !== next.selectedDay ||
    prev.renderEvent !== next.renderEvent ||
    prev.getAriaLabel !== next.getAriaLabel ||
    prev.onDayClick !== next.onDayClick ||
    prev.onEventClick !== next.onEventClick
  ) return false;

  if (prev.selectedEventId === next.selectedEventId) return true;

  // selectedEventId changed — skip re-render if neither selection touches this day
  const prevInDay = prev.dayEvents.some(e => e.id === prev.selectedEventId);
  const nextInDay = next.dayEvents.some(e => e.id === next.selectedEventId);
  return !prevInDay && !nextInDay;
}) as typeof DayImpl;

const formatDayLabel = (day: TLocalDate): string => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
