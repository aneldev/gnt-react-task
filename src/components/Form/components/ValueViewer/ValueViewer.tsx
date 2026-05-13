import * as React from "react";

interface IValueViewerProps<T> {
  initialValue: T;
  subscribe: (listener: (value: T) => void) => void;
  unsubscribe: (listener: (value: T) => void) => void;
  render: (value: T) => React.ReactNode;
}

interface IValueViewerState<T> {
  value: T;
}

export class ValueViewer<T> extends React.Component<IValueViewerProps<T>, IValueViewerState<T>> {
  constructor(props: IValueViewerProps<T>) {
    super(props);
    this.state = {value: props.initialValue};
  }

  private listener = (value: T) => {
    this.setState({value});
  };

  componentDidMount() {
    this.props.subscribe(this.listener);
  }

  componentWillUnmount() {
    this.props.unsubscribe(this.listener);
  }

  render() {
    return this.props.render(this.state.value);
  }
}
