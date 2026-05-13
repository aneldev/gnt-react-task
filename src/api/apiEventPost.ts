import type {IEvent} from "./IEvent.ts";
import {dbEvents} from "./dbEvents";

export const apiEventPost = async (
  {event}
  : {
    event: Omit<IEvent, "id">
  }
): Promise<IEvent> => {
  await new Promise(r => setTimeout(r, 150 + Math.random() * 100));

  const newEvent: IEvent = {
    ...event,
    id: crypto.randomUUID(),
  };
  const events = dbEvents.load();
  events.push(newEvent);
  events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  dbEvents.save(events);
  return newEvent;
};
