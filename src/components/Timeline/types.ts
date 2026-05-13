import React from 'react';

export interface ITimelineDataBase {
  id: string;
  startDate: Date;
  endDate: Date;
}

import type {TLocalDate} from "../typescript"
export type {TLocalDate}

export const toLocalDate = (date: Date): TLocalDate => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}` as TLocalDate;
};

export type TRenderEvent<TEvent extends ITimelineDataBase> = (
  args: {
    event: TEvent;
    starts: "before-day" | "within-day";
    ends:  "within-day" | "after-day";
  }
) => React.ReactNode;
