import {dbEvents} from "./dbEvents";

export const apiEventDelete = async (
  {id}
  : {
    id: string;
  }
): Promise<void> => {
  const events = dbEvents.load();

  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) throw new Error("Not found");
  events.splice(idx, 1);
  dbEvents.save(events);
};
