import React from "react";
import dayjs from "dayjs";
import {
  DateTimePicker,
  DatePicker,
} from "@mui/x-date-pickers";

export interface IInputDateTimeProps {
  name?: string;
  label: string;
  ariaLabel: string;
  readOnly?: boolean;
  disabled?: boolean;
  /**
   * Handles also for time
   */
  time?: boolean;
  value: Date;
  helperText?: string;
  onChange: (value: Date) => void;
}

export const InputDateTime = (
  {
    label,
    ariaLabel,
    readOnly = false,
    disabled = false,
    time = false,
    value,
    helperText = "",
    onChange,
  }: IInputDateTimeProps,
): React.ReactNode => {
  const dayjsValue = value ? dayjs(value) : null;
  const hasError = helperText.length > 0;

  const slotProps = {
    textField: {
      fullWidth: true,
      error: hasError,
      helperText: helperText || undefined,
      inputProps: {"aria-label": ariaLabel},
      InputProps: {readOnly},
    },
  };

  if (time) {
    return (
      <DateTimePicker
        label={label}
        value={dayjsValue}
        disabled={disabled}
        readOnly={readOnly}
        slotProps={slotProps}
        onChange={(dayjsVal) => {
          if (dayjsVal && dayjsVal.isValid()) {
            onChange(dayjsVal.toDate());
          }
        }}
      />
    );
  }

  return (
    <DatePicker
      label={label}
      value={dayjsValue}
      disabled={disabled}
      readOnly={readOnly}
      slotProps={slotProps}
      onChange={(dayjsVal) => {
        if (dayjsVal && dayjsVal.isValid()) {
          onChange(dayjsVal.toDate());
        }
      }}
    />
  );
};
