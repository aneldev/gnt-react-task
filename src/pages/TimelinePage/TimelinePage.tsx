import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Box,
  Button,
  Link,
  Alert,
} from "@mui/material";

import {
  type TLocalDate,
  Timeline,
  toLocalDate,
} from "../../components/Timeline";
import {EventEditorModal} from "../../modals/EventEditorModal";
import type {IEvent} from "../../api/IEvent";
import {apiEventGetLoadAll} from "../../api/apiEventGetLoadAll";
import {
  FlexItemMin,
  FlexItemMax,
  FlexContainer,
  EFlexContainerOrientation,
} from "../../components/FlexContainer";
import {InputSelectMonth} from "../../components/InputSelectMonth";
import {useBreakpointDevice} from "../../components/useBreakpointDevice";

import {EventLine} from "./EventLine";

import AddIcon from "@mui/icons-material/Add";

interface IFilter {
  startRange: Date;
  endRange: Date;
}

export const TimelinePage: React.FC = () => {
  const [startRange, setStartRange] = useState<TLocalDate>(VIEWPORT_START);
  const [endRange, setEndRange] = useState<TLocalDate>(VIEWPORT_END);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [editorEventId, setEditorEventId] = useState<string | undefined>(undefined);
  const [newDefaults, setNewDefaults] = useState<Partial<Omit<IEvent, "id">> | undefined>(undefined);
  const [adjustmentHint, setAdjustmentHint] = useState<string | null>(null);

  const {isMobile} = useBreakpointDevice();

  const handleStartRangeChange = useCallback((val: TLocalDate) => {
    setStartRange(val);
    if (endRange < val || endRange > addMonths(val, 2)) {
      setEndRange(addMonths(val, 2));
      setAdjustmentHint("End date was adjusted to keep the range within 3 months.");
    } else {
      setAdjustmentHint(null);
    }
  }, [endRange]);

  const handleEndRangeChange = useCallback((val: TLocalDate) => {
    setEndRange(val);
    if (startRange > val || startRange < addMonths(val, -2)) {
      setStartRange(addMonths(val, -2));
      setAdjustmentHint("Start date was adjusted to keep the range within 3 months.");
    } else {
      setAdjustmentHint(null);
    }
  }, [startRange]);

  useEffect(() => {
    apiEventGetLoadAll().then(setEvents);
  }, []);

  const handleEventClick = useCallback((eventId: string) => {
    setEditorEventId(eventId);
  }, []);

  const handleEditorClose = useCallback((
    {
      updatedEvent,
      deletedEvent,
    }
    : {
      updatedEvent?: IEvent;
      deletedEvent?: IEvent;
    }
  ) => {
    if (updatedEvent) {
      setEvents(prev => {
        const idx = prev.findIndex(e => e.id === updatedEvent.id);
        return idx !== -1
          ? prev.map((e, i) => (i === idx ? updatedEvent : e))
          : [...prev, updatedEvent];
      });
    }
    if (deletedEvent) {
      setEvents(prev => prev.filter(e => e.id !== deletedEvent.id));
    }
    setNewDefaults(undefined);
    setEditorEventId(undefined);
  }, []);

  const renderEvent = useCallback(({event, starts, ends}: {event: IEvent; starts: "before-day" | "within-day"; ends: "within-day" | "after-day"}) => (
    <EventLine event={event} starts={starts} ends={ends} />
  ), []);

  const renderDayHeader = useCallback(({day, dayLabel}: { day: TLocalDate; dayLabel: string }) => {
    const handleAddClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const [y, m, d] = day.split('-').map(Number);
      const now = new Date();
      const startDate = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), 0, 0);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      setNewDefaults({startDate, endDate});
      setEditorEventId("");
    };

    return (
      <>
        {dayLabel}
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={handleAddClick}
          sx={{ml: 1}}
        >
          Add
        </Link>
      </>
    );
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 920,
        margin: "auto",
      }}
    >
      <FlexContainer
        spacing={1}
        orientation={isMobile ? EFlexContainerOrientation.VERTICAL : EFlexContainerOrientation.HORIZONTAL}
        justifyCenter
      >
        <FlexItemMax>
          <InputSelectMonth<IFilter>
            name="startRange"
            label="Start range"
            disableKbdInput
            value={startRange}
            onChange={handleStartRangeChange}
          />
        </FlexItemMax>
        <FlexItemMax>
          <InputSelectMonth<IFilter>
            name="endRange"
            label="End range"
            disableKbdInput
            value={endRange}
            onChange={handleEndRangeChange}
          />
        </FlexItemMax>
        <FlexItemMin>
          <Button
            sx={{whiteSpace: 'nowrap'}}
            variant="contained"
            startIcon={<AddIcon/>}
            onClick={() => setEditorEventId("")}
          >
            Add Event
          </Button>

        </FlexItemMin>
      </FlexContainer>

      {adjustmentHint && (
        <Alert severity="info" sx={{mt: 1}}>
          {adjustmentHint}
        </Alert>
      )}

      <Timeline
        events={events}
        viewportStart={startRange}
        viewportEnd={toLocalDate(new Date(Number(endRange.slice(0, 4)), Number(endRange.slice(5, 7)), 0))}
        getAriaLabel={getAriaLabel}
        renderDayHeader={renderDayHeader}
        renderEvent={renderEvent}
        disableKeyboardNavigation={editorEventId !== undefined}
        onEventClick={handleEventClick}
      />

      <EventEditorModal
        editEventId={editorEventId}
        newDefaults={newDefaults}
        onClose={handleEditorClose}
      />
    </Box>
  );
};

const _now = new Date();
const VIEWPORT_START = toLocalDate(new Date(_now.getFullYear(), _now.getMonth(), 1));
const VIEWPORT_END = toLocalDate(new Date(_now.getFullYear(), _now.getMonth() + 1, 0));

const getAriaLabel = (event: IEvent): string => event.title;

const addMonths = (date: TLocalDate, months: number): TLocalDate => {
  const [y, m] = date.split('-').map(Number);
  return toLocalDate(new Date(y, m - 1 + months, 1));
};
