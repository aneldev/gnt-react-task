# GNT React Task — Events App

A React application built as a technical assessment. It demonstrates three reusable, production-quality components — **DataGrid**, **Timeline**, and **Form** — wired together in a small events management app.

---

## Installation

> Requires **Node v22** and **pnpm**.

```bash
nvm use 22
git clone https://github.com/aneldev/gnt-react-task.git
cd gnt-react-task
pnpm install
pnpm dev
```

---

## Project Structure

```
src/
├── components/   # Reusable components — DataGrid, Timeline, Form, and others
├── pages/        # Feature page components (ListPage, TimelinePage, WelcomePage)
├── modals/       # App-level modals (EventEditorModal)
└── api/          # Minimalistic Data API layer
```

- **`/components`** — self-contained, framework-agnostic building blocks. Any of them can be dropped into another project.
- **`/pages`** — feature pages that compose components together.
- **`/modals`** — modals shared across pages.

---

## The 3 Reusable Components

### DataGrid

A full-featured data grid built on top of MUI's plain `Table` component and the `@tanstack/react-table` headless hook.

**Why `@tanstack/react-table` over MUI DataGrid?**  
It gives 100% control over the layout while handling the hard parts (sorting state, filtering, pagination) in a headless way. The rendered markup is ours — no opinionated Grid DOM, no surprise style overrides, no paid licence for advanced features.

**Features:**

- Column sorting (multi-state: none → asc → desc)
- Per-column text filtering with inline filter inputs in column headers
- Column visibility toggle via a show/hide menu
- Pagination (top and bottom)
- Custom cell rendering via `cellRender`
- Loading, error, and empty states handled automatically
- Row click handler
- Fully typed with generics — column definitions are tied to the row type

**Dependencies:** `@mui/material`, `@tanstack/react-table`

#### Props

| Prop              | Type                        | Required | Description                           |
|-------------------|-----------------------------|----------|---------------------------------------|
| `columns`         | `IDataGridColumn<TData>[]`  | yes      | Column definitions                    |
| `rows`            | `TData[]`                   | yes      | Row data                              |
| `getRowKey`       | `(row, index) => React.Key` | yes      | Stable row key                        |
| `loading`         | `boolean`                   | —        | Shows a spinner in place of the table |
| `error`           | `string \| null`            | —        | Shows an error alert                  |
| `defaultPageSize` | `number`                    | —        | Default `30`                          |
| `onRowClick`      | `(row: TData) => void`      | —        | Called when a row is clicked          |
| `sx`              | `SxProps`                   | —        | MUI sx passthrough                    |

#### Column definition — `IDataGridColumn<TData>`

| Field                 | Type                        | Description                         |
|-----------------------|-----------------------------|-------------------------------------|
| `fieldName`           | `keyof TData \| string`     | Data field to read                  |
| `headerLabel`         | `string`                    | Column header text                  |
| `sortable`            | `boolean`                   | Enable sorting                      |
| `filterable`          | `boolean`                   | Show inline filter input            |
| `hidden`              | `boolean`                   | Hidden by default (user can toggle) |
| `align`               | `EColumnAlign`              | Cell alignment                      |
| `cellRender`          | `(value, ctx) => ReactNode` | Custom cell renderer                |
| `headerSx` / `cellSx` | `SxProps`                   | MUI sx for header / cell            |

#### Usage example

```tsx
import { DataGrid, IDataGridColumn } from "./components/DataGrid/DataGrid";
import { EColumnAlign } from "./components/Table";

interface IEvent {
  id: string;
  title: string;
  startDate: Date;
}

const columns: IDataGridColumn<IEvent>[] = [
  { fieldName: "title",     headerLabel: "Title",     sortable: true, filterable: true },
  { fieldName: "startDate", headerLabel: "Start",     sortable: true,
    cellRender: (v) => (v as Date).toLocaleDateString() },
  { fieldName: "id",        headerLabel: "",          align: EColumnAlign.CENTER,
    cellRender: (_, { row }) => <DeleteButton id={row.id} /> },
];

<DataGrid
  columns={columns}
  rows={events}
  loading={loading}
  error={error}
  getRowKey={row => row.id}
  onRowClick={row => openEditor(row.id)}
/>
```

---

### Timeline

A vertical timeline that maps a list of events onto a date range. Designed to be lightweight, keyboard-navigable, and screen-reader friendly.

**Design decisions:**

- Vertical layout — simple for the user, no complex graphics.
- No pagination. Instead, a **monthly range view** (max 3 months) keeps the DOM small and the user oriented.
- Fully **keyboard navigable**: `↑`/`↓` move between events, `←`/`→` jump between days, `Enter` opens an event.
- **ARIA live region** announces the selected event to screen readers as focus moves.
- Events that span multiple days appear on every day they cover, with visual indicators for `starts: "before-day"` and `ends: "after-day"` so duration is immediately readable.

**Dependencies:** `@mui/material`

#### Data contract — `ITimelineDataBase`

Every event passed to Timeline must satisfy:

```ts
interface ITimelineDataBase {
  id: string;
  startDate: Date;
  endDate: Date;
}
```

#### Props — `ITimelineProps<TEvent>`

| Prop                        | Type                               | Required | Description                                      |
|-----------------------------|------------------------------------|----------|--------------------------------------------------|
| `events`                    | `TEvent[]`                         | yes      | Event data                                       |
| `viewportStart`             | `TLocalDate`                       | yes      | First day to render (`"YYYY-MM-DD"`)             |
| `viewportEnd`               | `TLocalDate`                       | yes      | Last day to render                               |
| `renderEvent`               | `TRenderEvent<TEvent>`             | yes      | Renders a single event card                      |
| `getAriaLabel`              | `(event: TEvent) => string`        | yes      | Text read by screen readers                      |
| `renderDayHeader`           | `({ day, dayLabel }) => ReactNode` | —        | Customise the day heading                        |
| `disableKeyboardNavigation` | `boolean`                          | —        | Disable KB nav (e.g. while a modal is open)      |
| `onDayClick`                | `(day: TLocalDate) => void`        | —        | Called when a day heading is clicked             |
| `onEventClick`              | `(eventId, day) => void`           | —        | Called when an event is clicked or Enter-pressed |

#### `TRenderEvent` signature

```ts
type TRenderEvent<TEvent> = (args: {
  event: TEvent;
  starts: "before-day" | "within-day"; // event started before this calendar day
  ends:   "within-day" | "after-day";  // event ends after this calendar day
}) => React.ReactNode;
```

#### Usage example

```tsx
import { Timeline, toLocalDate, type TLocalDate } from "./components/Timeline";

<Timeline
  events={events}
  viewportStart="2025-05-01"
  viewportEnd="2025-07-31"
  getAriaLabel={event => event.title}
  renderEvent={({ event, starts, ends }) => (
    <EventLine event={event} starts={starts} ends={ends} />
  )}
  renderDayHeader={({ dayLabel }) => <strong>{dayLabel}</strong>}
  onEventClick={(eventId) => openEditor(eventId)}
/>
```

---

### Form

A reusable, type-safe, high-performance form component. The API is intentionally similar to `react-hook-form` but simpler: pass a `loadData` function, describe your fields with `input()`, wire up validation and API calls — done.

**Design decisions:**

- Implemented as a **class component** so field value updates are stored in a plain instance variable (`this.values`) rather than state. Only UI-relevant state (errors, dirty flag, loading, saving) triggers re-renders. Individual field changes do **not** re-render the whole form.
- **Subscription model** for `watch()`: only the watching node re-renders when the watched value changes — everything else is stable.
- Works for both `create` and `edit` modes.
- When used inside a modal (`isModal={true}`), shows a success screen after save/delete so the user gets clear feedback before the modal closes.
- Built-in **unsaved-changes guard**: Cancel asks for confirmation when the form is dirty.
- Built-in **delete confirmation** dialog.
- Validation runs on blur per-field and on submit for all fields; focus is moved to the first error automatically.

**Dependencies:** `@mui/material`

#### Props — `IFormProps<TData>`

| Prop              | Type                                                    | Required | Description                                                 |
|-------------------|---------------------------------------------------------|----------|-------------------------------------------------------------|
| `mode`            | `"create" \| "edit"`                                    | yes      | Controls which API handler is called on submit              |
| `loadData`        | `() => Promise<TData>`                                  | yes      | Loads initial field values                                  |
| `children`        | `(formApi: IFormApi<TData>) => ReactNode`               | yes      | Render-prop receiving the form API                          |
| `validationRules` | `Partial<Record<keyof TData, (value, data) => string>>` | —        | Per-field validators; return an error string or `""`        |
| `onApiPost`       | `(data: TData) => Promise<TData \| void>`               | —        | Called on submit in `create` mode                           |
| `onApiPut`        | `(data: TData) => Promise<TData \| void>`               | —        | Called on submit in `edit` mode                             |
| `onApiDelete`     | `(data: TData) => Promise<void>`                        | —        | Enables the Delete button                                   |
| `onCancel`        | `() => void`                                            | —        | Called when Cancel is clicked (with dirty guard)            |
| `onClose`         | `() => void`                                            | —        | Called after a successful save in modal mode                |
| `isModal`         | `boolean`                                               | —        | Adapts button layout and shows success screen for modals    |
| `showSuccess`     | `boolean`                                               | —        | Default `true` — show the green checkmark screen after save |
| `restartId`       | `string`                                                | —        | Change this value to reset and reload the form              |

#### `IFormApi<TData>` — the render-prop API

```ts
interface IFormApi<TData> {
  isDirty: boolean;

  // Renders a controlled field without triggering form-wide re-renders
  input<K extends keyof TData>(
    name: K,
    render: (props: IFieldProps<TData, K>) => ReactNode,
  ): ReactNode;

  // Renders a reactive node that updates only when `name` changes
  watch<K extends keyof TData>(
    name: K,
    render: (value: TData[K]) => ReactNode,
  ): ReactNode;
}
```

`IFieldProps` spreads directly onto any MUI input (`value`, `onChange`, `onBlur`, `error`, `helperText`, `disabled`, `required`, `ref`, `name`).

#### Usage example

```tsx
import { Form } from "./components/Form";

interface IEvent {
  id: string;
  title: string;
  startDate: Date;
}

<Form<IEvent>
  mode="edit"
  isModal
  restartId={eventId}
  loadData={() => api.getEvent(eventId)}
  validationRules={{
    title:     (v)       => v ? "" : "Title is required",
    startDate: (v, data) => v < data.endDate ? "" : "Must be before end date",
  }}
  onApiPut={data => api.updateEvent(data)}
  onApiDelete={data => api.deleteEvent(data.id)}
  onClose={onClose}
  onCancel={onClose}
>
  {({ input, watch }) => (
    <>
      <h2>
        Edit Event
        {watch("title", v => v ? ` — ${v}` : "")}
      </h2>

      {input("title", props => (
        <TextField {...props} label="Title" fullWidth />
      ))}

      {input("startDate", props => (
        <InputDateTime {...props} label="Start Date" time />
      ))}
    </>
  )}
</Form>
```

---

## Tech Stack

| Library                 | Version | Purpose                           |
|-------------------------|---------|-----------------------------------|
| React                   | 19      | UI framework                      |
| TypeScript              | 5       | Type safety                       |
| Vite                    | 6       | Dev server & bundler              |
| MUI (`@mui/material`)   | 9       | UI component library              |
| `@tanstack/react-table` | 8       | Headless table logic for DataGrid |
| `@mui/x-date-pickers`   | 9       | Date/time picker inputs           |
