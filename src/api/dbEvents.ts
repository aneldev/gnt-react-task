import {faker} from "@faker-js/faker";

import type {IEvent} from "./IEvent.ts";

faker.seed(42);

const now = new Date();
const rangeStart = new Date(now);
rangeStart.setDate(rangeStart.getDate() - 7);
const rangeEnd = new Date(now);
rangeEnd.setDate(rangeEnd.getDate() + 30);

const COLORS = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
];

function randomEvent(): IEvent {
  const startDate = faker.date.between({from: rangeStart, to: rangeEnd});
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + faker.number.int({min: 1, max: 8}));

  return {
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      faker.company.catchPhrase(),
      faker.hacker.phrase(),
      faker.lorem.words({min: 2, max: 4}),
    ]),
    description: faker.datatype.boolean(0.7) ? faker.lorem.sentence() : undefined,
    startDate,
    endDate,
    color: faker.helpers.arrayElement(COLORS),
  };
}


const LS_KEY = 'builtEvents';

class DBEvents {
  private events: IEvent[] | null = null;

  public load(): IEvent[] {
    if (this.events) return this.events;
    const lsRaw = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as IEvent[];
    if (lsRaw.length === 0) {
      // Build them
      this.events =
        Array
          .from({length: 500}, randomEvent)
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    else {
      // Is from LS, hydrate
      this.events = lsRaw.map(e => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
      }));
    }
    return this.events;
  }

  public save(events: IEvent[]): void {
    this.events = events;
    setTimeout(
      // Don't block the thread with this
      () => localStorage.setItem(LS_KEY, JSON.stringify(events)),
      1000,
    );
  }
}

export const dbEvents = new DBEvents();
