import type {IEvent} from "./IEvent.ts";
import {dbEvents} from "./dbEvents";

export const apiEventPut = async (
  {event}
  : {
    event: IEvent;
  }
): Promise<void> => {
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 100));

  const events = dbEvents.load();
  const idx = events.findIndex(e => e.id === event.id);
  if (idx !== -1) {
    events[idx] = event;
    dbEvents.save(events);
  } else {
    throw new Error(`Event with id ${event.id} not found to update`);
  }
};
