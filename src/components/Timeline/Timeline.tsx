import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {Box} from "@mui/material";

import {
  type ITimelineDataBase,
  type TLocalDate,
  type TRenderEvent,
  toLocalDate,
} from "./types.ts";

import {Day} from "./components/Day";
import {KbHint} from "./components/KbHint";

export interface ITimelineProps<TEvent extends ITimelineDataBase> {
  /** Events to render. Only events whose date range overlaps the viewport are shown. */
  events: TEvent[];

  /** First day of the visible range, inclusive. Format: `YYYY-MM-DD`. */
  viewportStart: TLocalDate;
  /** Last day of the visible range, inclusive. Format: `YYYY-MM-DD`. */
  viewportEnd: TLocalDate;

  /** Custom renderer for the day header. Receives the local date and a pre-formatted label string. */
  renderDayHeader?: (args: {
    day: TLocalDate;
    dayLabel: string;
  }) => React.ReactNode;

  /** Renders an individual event card. `starts` and `ends` indicate whether the event spans beyond the current day — use them to visually clip card edges. */
  renderEvent: TRenderEvent<TEvent>;
  /** Returns the accessible label announced to screen readers when an event is focused or selected. */
  getAriaLabel: (event: TEvent) => string;

  /** Hides the keyboard hint bar and disables arrow-key navigation. Use in read-only embeds where keyboard focus should not be captured by the timeline. */
  disableKeyboardNavigation?: boolean;

  /** Called when the user clicks a day header. */
  onDayClick?: (day: TLocalDate) => void;
  /** Called when an event is clicked or activated via the Enter key. */
  onEventClick?: (eventId: string, day: TLocalDate) => void;
}

interface IEventElement {
  element: HTMLDivElement;
  eventId: string;
  day: TLocalDate;
  selected: boolean;
}

export const Timeline = <TEvent extends ITimelineDataBase, >(
  {
    events,
    viewportStart,
    viewportEnd,
    renderDayHeader,
    renderEvent,
    getAriaLabel,
    disableKeyboardNavigation = false,
    onDayClick,
    onEventClick,
  }: ITimelineProps<TEvent>,
): React.ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState<TLocalDate>("2000-01-01" as TLocalDate);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [liveText, setLiveText] = useState('');

  const handleEventClick = useCallback((eventId: string, day: TLocalDate): void => {
    setSelectedDay(day);
    setSelectedEventId(eventId);
    onEventClick?.(eventId, day);
  }, [onEventClick]);

  // Handle the keyboard, and focus the proper event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disableKeyboardNavigation) return;

      const NAV_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '];
      if (!NAV_KEYS.includes(e.key)) return;
      e.preventDefault();

      if (!containerRef.current) return;

      // Build the elements array. Fast: ~0.12ms on M1 for 133 DOM elements.
      const allEventElements: IEventElement[] =
        Array
          .from(containerRef.current.querySelectorAll('.js-timeline-event'))
          .map(el => ({
            element: el as HTMLDivElement,
            eventId: el.getAttribute('data-event-id') || "",
            day: (el.getAttribute('data-day') || "") as TLocalDate,
            selected: el.getAttribute('aria-current') === 'true',
          }));
      const firstEventsByDay: IEventElement[] = allEventElements.filter((el, index, array) => {
        const prev = array[index - 1];
        return !prev || prev.day !== el.day;
      });
      if (allEventElements.length === 0) return;

      const selectedElement = allEventElements.find(el => el.selected);

      const selectElement = (element: IEventElement): void => {
        setSelectedDay(element.day);
        setSelectedEventId(element.eventId);
        element.element.scrollIntoView({
          behavior: 'smooth',
          block: "center",
          inline: 'nearest'
        });
        element.element.focus();
      };

      if (!selectedElement) {
        selectElement(allEventElements[0]);
        return;
      }
      const currentDayIdx = firstEventsByDay.findIndex(el => el.day === selectedElement.day);

      const selectedElementIndex = allEventElements.indexOf(selectedElement);
      if (selectedElementIndex === -1) throw new Error("Dev error: selectedElementIndex is -1, this is a developer error!");

      switch (e.key) {
        case 'ArrowUp': {
          const prev = allEventElements[selectedElementIndex - 1];
          if (prev) selectElement(prev);
          break;
        }
        case 'ArrowDown': {
          const next = allEventElements[selectedElementIndex + 1];
          if (next) selectElement(next);
          break;
        }
        case 'ArrowLeft': {
          const element = firstEventsByDay[currentDayIdx - 1] ?? firstEventsByDay[currentDayIdx];
          selectElement(element);
          break;
        }
        case 'ArrowRight': {
          const element = firstEventsByDay[currentDayIdx + 1] ?? firstEventsByDay[currentDayIdx];
          selectElement(element);
          break;
        }
        case 'Enter':
          onEventClick?.(selectedElement.eventId, selectedElement.day);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disableKeyboardNavigation, onEventClick]);

  const dayGroups = useMemo(
    () => buildDayGroups(events, viewportStart, viewportEnd),
    [events, viewportStart, viewportEnd],
  );

  // Build the live text for the selected event
  useEffect(() => {
    if (!selectedEventId) return;
    const dayGroup = dayGroups.find(([, evts]) => evts.some(e => e.id === selectedEventId));
    if (!dayGroup) return;
    const [, dayEvents] = dayGroup;
    const idx = dayEvents.findIndex(e => e.id === selectedEventId);
    setLiveText(`${getAriaLabel(dayEvents[idx])}, ${idx + 1} of ${dayEvents.length}`);
  }, [selectedEventId, dayGroups, getAriaLabel]);

  return (
    <Box
      ref={containerRef}
      tabIndex={0}
      sx={{overflowY: 'auto', py: 2, px: 1, outline: 'none'}}
    >
      <Box
        sx={{
          visibility: disableKeyboardNavigation ? "hidden" : "visible",
          display: 'flex',
          gap: 2,
          mb: 2.5,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
        <KbHint keys={['↑', '↓']} label="events"/>
        <KbHint keys={['←', '→']} label="days"/>
        <KbHint keys={['↵']} label="open"/>
      </Box>

      <Box
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {liveText}
      </Box>

      {dayGroups.map(([day, dayEvents]) => (
        <Day
          key={day}
          day={day}
          dayEvents={dayEvents}
          viewportStart={viewportStart}
          viewportEnd={viewportEnd}
          renderDayHeader={renderDayHeader}
          selectedDay={selectedDay}
          selectedEventId={selectedEventId}
          renderEvent={renderEvent}
          getAriaLabel={getAriaLabel}
          onDayClick={onDayClick}
          onEventClick={handleEventClick}
        />
      ))}
    </Box>
  );
};


const buildDayGroups = <TEvent extends ITimelineDataBase>(
  events: TEvent[],
  viewportStart: TLocalDate,
  viewportEnd: TLocalDate,
): [TLocalDate, TEvent[]][] => {
  const result: [TLocalDate, TEvent[]][] = [];

  const [sy, sm, sd] = viewportStart.split('-').map(Number);
  const [ey, em, ed] = viewportEnd.split('-').map(Number);

  const cursor = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);

  while (cursor <= end) {
    const day = toLocalDate(cursor);

    const dayEvents = events
      .filter(event => {
        const s = toLocalDate(event.startDate);
        const e = toLocalDate(event.endDate);
        return s <= day && day <= e;
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    if (dayEvents.length > 0) result.push([day, dayEvents]);

    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
};
