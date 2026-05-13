import React from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs, {type Dayjs} from "dayjs";

import type {
  TObject,
  TLocalDate,
} from "../typescript";

export interface IInputSelectMonthProps<TData extends TObject> {
  name: keyof TData;
  label: string;

  minDate?: TLocalDate;
  maxDate?: TLocalDate;

  disableKbdInput?: boolean;

  /**
   * As value uses the 1st day of the month of the local date
   */
  value: TLocalDate;
  /**
   * As result returns the 1st day of the month of the local date
   */
  onChange: (value: TLocalDate, name: keyof TData) => void;
}

export interface ISelectMonthValue {
  year: number;
  month: number;
}

/**
 * Select month and year
 *
 * Returns TLocalDate that is ISO local date if the 1st day of the select month/year
 */
export const InputSelectMonth = <TData extends TObject, >(
  {
    name,
    label,
    minDate,
    maxDate,
    disableKbdInput= false,
    value,
    onChange,
  }: IInputSelectMonthProps<TData>,
): React.ReactNode => {
  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    onChange(newValue.startOf('month').format('YYYY-MM-DD') as TLocalDate, name);
  };

  return (
    <DatePicker
      views={['year', 'month']}
      openTo="month"
      label={label}
      minDate={minDate ? dayjs(minDate) : undefined}
      maxDate={maxDate ? dayjs(maxDate) : undefined}
      slotProps={{
        textField: { readOnly: disableKbdInput }
      }}
      value={dayjs(value)}
      onChange={handleChange}
    />
  );
};
