import type {IEvent} from "./IEvent.ts";
import {dbEvents} from "./dbEvents";

export const apiEventGetLoad = async (
  {id}
  : {
    id: string;
  }
): Promise<IEvent|null> => {
  return dbEvents.load().find(e => e.id === id) ?? null;
};
