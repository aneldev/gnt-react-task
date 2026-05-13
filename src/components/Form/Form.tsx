import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import type {TObject} from "../typescript";
import {
  useConfirm,
  type IConfirmArgs
} from "../useConfirm";
import {InputController} from "./components/InputController";
import {ValueViewer} from "./components/ValueViewer";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export interface IFormProps<TData extends TObject> {
  /** Controls the HTTP verb and button labels. `"create"` calls `onApiPost`; `"edit"` calls `onApiPut` and shows the Delete button. */
  mode:
    | "create"
    | "edit";

  /** Set when the form is rendered inside a modal — shows Close and success-state buttons at the right times. */
  isModal?: boolean;

  /** Field-level validators. Each function receives the field value and full form data; return an error message or an empty string when valid. */
  validationRules?: Partial<Record<keyof TData, (value: TData[keyof TData], data: TData) => string>>;

  /**
   * Show a big green checkmark after a successful save/delete.
   * @default true
   */
  showSuccess?: boolean;

  /** Change this value to reset the form: reloads data and clears all state. */
  restartId?: string;

  /** Called on mount (and on `restartId` change) to load initial form data. */
  loadData: () => Promise<TData>;

  /** Render prop that receives the form API — use it to declare fields and watchers. */
  children: (formApi: IFormApi<TData>) => React.ReactNode;

  /** Called on submit in `"create"` mode. May return updated data to replace the local state. */
  onApiPost?: (data: TData) => Promise<TData | void>;
  /** Called on submit in `"edit"` mode. May return updated data to replace the local state. */
  onApiPut?: (data: TData) => Promise<TData | void>;
  /** Enables the Delete button in `"edit"` mode. Called after the user confirms the deletion dialog. */
  onApiDelete?: (data: TData) => Promise<void>;

  /** Called after the user confirms discarding unsaved changes. Typically closes the form or navigates away. */
  onCancel?: () => void;
  /** Called when the user closes the form without pending changes, e.g. via the Close button in a modal. */
  onClose?: () => void;
}

export interface IFormApi<TData extends TObject> {
  /** `true` when any field value differs from the loaded data. */
  isDirty: boolean;
  /** Registers a controlled field. Spread the received `IFieldProps` onto the MUI input component. */
  input: <K extends keyof TData>(
    name: K,
    render: (props: IFieldProps<TData, K>) => React.ReactNode,
  ) => React.ReactNode;
  /** Subscribes a render function to a field's live value without registering an input. Use for conditional UI that reacts to another field's value. */
  watch: <K extends keyof TData>(
    name: K,
    render: (value: TData[K]) => React.ReactNode,
  ) => React.ReactNode;
}

export interface IFieldProps<TData extends TObject, K extends keyof TData = keyof TData> {
  /** Forwarded to the underlying `<input>` element for programmatic focus management. */
  ref: React.RefObject<HTMLInputElement | null>;
  /** The field key within `TData`. */
  name: K;
  /** The current field value. */
  value: TData[K];
  /** `true` while the form is saving or after a successful save. */
  disabled: boolean;
  /** `true` when a validation rule is defined for this field. */
  required: boolean;
  /** `true` when the field has a validation error. */
  error: boolean;
  /** The current validation error message; empty string when valid. */
  helperText: string;
  /** Accepts a native change event or the new value directly — use the value form for custom inputs such as date pickers. */
  onChange: (
    eventOrValue:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | TData[K],
  ) => void;
  /** Triggers per-field validation. Wire to the input's `onBlur` handler. */
  onBlur: () => void;
}

interface IFormBaseProps<TData extends TObject> extends IFormProps<TData> {
  confirm: (args: IConfirmArgs) => Promise<boolean>;
}

interface IFormState<TData extends TObject> {
  loading: boolean;
  loadError: string | null;
  saving: boolean;
  saved: boolean;
  deleted: boolean;
  saveError: string | null;
  errors: Partial<Record<keyof TData, string>>;
  isDirty: boolean;
}

class FormBase<TData extends TObject> extends React.Component<IFormBaseProps<TData>, IFormState<TData>> {
  private values!: TData;
  private readonly fieldRefs: Partial<Record<keyof TData, React.RefObject<HTMLInputElement | null>>> = {};
  private readonly subscribers: Partial<Record<keyof TData, Set<(value: unknown) => void>>> = {};

  private subscribe = <K extends keyof TData>(name: K, listener: (value: TData[K]) => void) => {
    if (!this.subscribers[name]) this.subscribers[name] = new Set();
    this.subscribers[name]!.add(listener as (value: unknown) => void);
  };

  private unsubscribe = <K extends keyof TData>(name: K, listener: (value: TData[K]) => void) => {
    this.subscribers[name]?.delete(listener as (value: unknown) => void);
  };

  private notify = <K extends keyof TData>(name: K, value: TData[K]) => {
    this.subscribers[name]?.forEach((listener) => listener(value));
  };

  constructor(props: IFormBaseProps<TData>) {
    super(props);
    this.state = {
      loading: true,
      loadError: null,
      saving: false,
      saved: false,
      deleted: false,
      saveError: null,
      errors: {},
      isDirty: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps: IFormBaseProps<TData>) {
    if (prevProps.restartId !== this.props.restartId) {
      this.load();
    }
  }

  private load = () => {
    this.setState({
      loading: true,
      loadError: null,
      saving: false,
      saved: false,
      deleted: false,
      saveError: null,
      errors: {},
      isDirty: false,
    });

    this.props.loadData()
      .then((data) => {
        this.values = data;
        this.setState({loading: false});
      })
      .catch(() => {
        this.setState({loading: false, loadError: "Failed to load data."});
      });
  };

  private getFieldRef = (name: keyof TData): React.RefObject<HTMLInputElement | null> => {
    if (!this.fieldRefs[name]) {
      this.fieldRefs[name] = React.createRef<HTMLInputElement>();
    }
    return this.fieldRefs[name]!;
  };

  private validateAll = (): Partial<Record<keyof TData, string>> => {
    const {validationRules} = this.props;
    if (!validationRules) return {};

    const errors: Partial<Record<keyof TData, string>> = {};
    for (const key of Object.keys(validationRules) as (keyof TData)[]) {
      const rule = validationRules[key];
      if (!rule) continue;
      const error = rule(this.values[key], this.values);
      if (error) errors[key] = error;
    }
    return errors;
  };

  private focusFirstError = (errors: Partial<Record<keyof TData, string>>) => {
    for (const key of Object.keys(errors) as (keyof TData)[]) {
      const ref = this.fieldRefs[key as string];
      if (errors[key] && ref?.current) {
        ref.current.focus();
        return;
      }
    }
  };

  private handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const errors = this.validateAll();
    if (Object.keys(errors).length > 0) {
      this.setState({errors});
      this.focusFirstError(errors);
      return;
    }

    this.setState({saving: true, saveError: null});
    try {
      const {mode, onApiPost, onApiPut} = this.props;
      let result: TData | void = undefined;

      if (mode === "create" && onApiPost) result = await onApiPost(this.values);
      else if (mode === "edit" && onApiPut) result = await onApiPut(this.values);

      if (result) this.values = result;
      this.setState({saving: false, saved: true, isDirty: false});
    }
    catch {
      this.setState({saving: false, saveError: "Failed to save. Please try again."});
    }
  };

  private handleDelete = async () => {
    if (!this.props.onApiDelete) return;

    const ok = await this.props.confirm({
      title: "Delete",
      message: "Are you sure you want to delete this? This cannot be undone.",
      buttonConfirmColor: "error",
    });
    if (!ok) return;

    this.setState({saving: true, saveError: null});
    try {
      await this.props.onApiDelete(this.values);
      this.setState({saving: false, saved: true, deleted: true});
      this.props.onClose?.();
    }
    catch {
      this.setState({saving: false, saveError: "Failed to delete. Please try again."});
    }
  };

  private handleCancel = async () => {
    const {onCancel} = this.props;
    if (!onCancel) return;

    if (this.state.isDirty) {
      const ok = await this.props.confirm({
        title: "Discard changes?",
        message: "You have unsaved changes. They will be lost.",
      });
      if (!ok) return;
    }

    onCancel();
  };

  private input = <K extends keyof TData>(
    name: K,
    renderField: (props: IFieldProps<TData, K>) => React.ReactNode,
  ): React.ReactNode => {
    const {validationRules} = this.props;
    const {saving, saved, loading, errors} = this.state;
    const isDisabled = saving || saved || loading;
    const errorMsg = errors[name] ?? "";

    return (
      <InputController
        key={String(name)}
        fieldRef={this.getFieldRef(name)}
        name={name}
        initialValue={this.values[name]}
        error={!!errorMsg}
        helperText={errorMsg}
        disabled={isDisabled}
        required={!!(validationRules?.[name])}
        onCommit={(value) => {
          this.values = {...this.values, [name]: value} as TData;
          this.notify(name, value);
          if (!this.state.isDirty) this.setState({isDirty: true});
        }}
        onValidate={() => {
          const rule = validationRules?.[name];
          if (!rule) return;
          const error = rule(this.values[name], this.values);
          const current = this.state.errors[name] ?? "";
          if (error !== current) {
            this.setState(prev => ({
              errors: {...prev.errors, [name]: error || undefined},
            }));
          }
        }}
        renderField={renderField}
      />
    );
  };

  private makeFormApi = (isDirty: boolean): IFormApi<TData> => ({
    isDirty,
    input: this.input,
    watch: this.watch,
  });

  private watch = <K extends keyof TData>(
    name: K,
    render: (value: TData[K]) => React.ReactNode,
  ): React.ReactNode => {
    return (
      <ValueViewer<TData[K]>
        key={`watch-${String(name)}`}
        initialValue={this.values[name]}
        subscribe={(listener) => this.subscribe(name, listener)}
        unsubscribe={(listener) => this.unsubscribe(name, listener)}
        render={render}
      />
    );
  };

  render() {
    const {
      mode,
      isModal = false,
      children,
      onCancel,
      onClose,
      onApiDelete,
      showSuccess = true,
    } = this.props;
    const {
      isDirty,
      loading,
      loadError,
      saving,
      saved,
      deleted,
      saveError,
    } = this.state;

    if (loading) {
      return (
        <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
          <CircularProgress/>
        </Box>
      );
    }

    if (loadError) {
      return (
        <Stack spacing={2}>
          <Alert severity="error">{loadError}</Alert>
          {isModal && onClose && (
            <Button
              disabled={saving}
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </Stack>
      );
    }

    if (isModal && saved && showSuccess) {
      return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 2}}>
          <CheckCircleIcon sx={{fontSize: 96, color: "success.main"}}/>
          <Typography variant="h6" color="success.main">
            {
              deleted
                ? "Deleted successfully!"
                : mode === "create"
                  ? "Created successfully!"
                  : "Saved successfully!"
            }
          </Typography>
        </Box>
      );
    }

    const isDisabled = saving || saved;

    return (
      <form onSubmit={this.handleSubmit}>
        <Stack spacing={2}>
          {children(this.makeFormApi(isDirty))}

          {saveError && (
            <Alert severity="error" role="alert">{saveError}</Alert>
          )}

          {saved && !showSuccess && (
            <Alert severity="success" role="status">Saved successfully!</Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              {onApiDelete && mode === "edit" && (
                <Button
                  color="error"
                  disabled={isDisabled || isDirty}
                  onClick={this.handleDelete}
                >
                  Delete
                </Button>
              )}
            </Box>

            <Box sx={{display: "flex", gap: 1}}>
              {isDirty && onCancel && (
                <Button
                  disabled={isDisabled}
                  onClick={this.handleCancel}
                >
                  Cancel
                </Button>
              )}
              {!isDirty && isModal && onClose && (
                <Button
                  disabled={saving}
                  onClick={onClose}
                >
                  Close
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={isDisabled || !isDirty}
                startIcon={saving ? <CircularProgress size={16} color="inherit"/> : undefined}
              >
                {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
              </Button>
            </Box>
          </Box>
        </Stack>
      </form>
    );
  }
}

export function Form<TData extends TObject>(props: IFormProps<TData>): React.ReactElement {
  const {confirm, confirmViewer} = useConfirm();
  return (
    <>
      <FormBase<TData> {...props} confirm={confirm}/>
      {confirmViewer}
    </>
  );
}
