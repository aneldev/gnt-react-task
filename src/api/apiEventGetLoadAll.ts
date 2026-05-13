import type {IEvent} from "./IEvent.ts";
import {dbEvents} from "./dbEvents";

export const apiEventGetLoadAll = async (): Promise<IEvent[]> => {
  // Enable the below like to demonstrate a data load error
  // if (Math.random() < 1) throw new Error('Artificial error, please refresh the page');
  // Enable the below like to demonstrate no data available
  // if (Math.random() < 1) return [];
  return [...dbEvents.load()];
};
