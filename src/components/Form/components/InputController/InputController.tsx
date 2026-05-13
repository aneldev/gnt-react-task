import * as React from "react";

import type {TObject} from "../../../typescript";
import type {IFieldProps} from "../../Form.tsx";

interface IInputControllerProps<TData extends TObject, K extends keyof TData> {
  fieldRef: React.RefObject<HTMLInputElement | null>;
  name: K;
  initialValue: TData[K];
  error: boolean;
  helperText: string;
  disabled: boolean;
  required: boolean;
  onCommit: (value: TData[K]) => void;
  onValidate: () => void;
  renderField: (props: IFieldProps<TData, K>) => React.ReactNode;
}

interface IInputControllerState<T> {
  value: T;
}

export class InputController<TData extends TObject, K extends keyof TData>
  extends React.Component<IInputControllerProps<TData, K>, IInputControllerState<TData[K]>> {

  constructor(props: IInputControllerProps<TData, K>) {
    super(props);
    this.state = {value: props.initialValue};
  }

  render() {
    const {
      fieldRef, name, error, helperText,
      disabled, required, onCommit, onValidate, renderField,
    } = this.props;
    const {value} = this.state;

    return renderField({
      ref: fieldRef,
      name,
      value,
      disabled,
      required,
      error,
      helperText,
      onChange: (eventOrValue) => {
        const next = isChangeEvent(eventOrValue)
          ? (eventOrValue.target.value as unknown as TData[K])
          : eventOrValue;
        this.setState({value: next as TData[K]});
        onCommit(next as TData[K]);
      },
      onBlur: () => onValidate(),
    });
  }
}

const isChangeEvent =
  (v: unknown): v is React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> =>
  typeof v === "object" && v !== null && "nativeEvent" in v;
