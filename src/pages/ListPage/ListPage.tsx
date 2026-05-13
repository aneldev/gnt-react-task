import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  IconButton,
} from "@mui/material";

import {
  type IDataGridColumn,
  DataGrid,
} from "../../components/DataGrid/DataGrid";
import {EColumnAlign} from "../../components/Table";
import {EventEditorModal} from "../../modals/EventEditorModal";
import type {IEvent} from "../../api/IEvent";
import {apiEventGetLoadAll} from "../../api/apiEventGetLoadAll";
import {apiEventDelete} from "../../api/apiEventDelete";
import {useConfirm} from "../../components/useConfirm";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export const ListPage: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorEventId, setEditorEventId] = useState<string | undefined>(undefined); // undefined = hidden, "" = create new, non-empty string = edit by id
  const {confirm, confirmViewer} = useConfirm();

  const loadEvents = useCallback(() => {
    setLoading(true);
    apiEventGetLoadAll()
      .then(setEvents)
      .catch(error => setError(`Error loading events: ${error.message || 'Unknown error'}`))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete event',
      message: 'Are you sure you want to delete this event?',
      buttonConfirmColor: 'error',
    });
    if (!confirmed) return;
    apiEventDelete({id})
      .then(loadEvents)
      .catch(error => setError(`Error deleting event: ${error.message || 'Unknown error'}`));
  }, [loadEvents, confirm]);

  const columns: IDataGridColumn<IEvent>[] = [
    {
      fieldName: 'color',
      headerLabel: 'Color',
      align: EColumnAlign.CENTER,
      cellRender: (value) => value
        ? (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: value as string,
              display: 'inline-block',
            }}
          />
        )
        : null,
    },
    {
      fieldName: 'title',
      headerLabel: 'Title',
      sortable: true,
      filterable: true,
    },
    {
      fieldName: 'description',
      headerLabel: 'Description',
      filterable: true,
      hidden: true,
    },
    {
      fieldName: 'startDate',
      headerLabel: 'Start',
      sortable: true,
      cellRender: (value) => (
        <Box sx={{textAlign: "right"}}>
          <div>{(value as Date).toLocaleDateString()}</div>
          <div>{(value as Date).toLocaleTimeString()}</div>
        </Box>
      ),
    },
    {
      fieldName: 'endDate',
      headerLabel: 'End',
      sortable: true,
      cellRender: (value) => (
        <Box sx={{textAlign: "right"}}>
          <div>{(value as Date).toLocaleDateString()}</div>
          <div>{(value as Date).toLocaleTimeString()}</div>
        </Box>
      ),
    },
    {
      fieldName: 'id',
      headerLabel: '',
      align: EColumnAlign.CENTER,
      cellRender: (_value, {row}) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.id);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleEditorClose = (
    {
      updatedEvent,
      deletedEvent,
    }
    : {
      updatedEvent?: IEvent;
      deletedEvent?: IEvent;
    }
  ) => {
    if (updatedEvent) {
      setEvents(prev => {
        const idx = prev.findIndex(e => e.id === updatedEvent.id);
        return idx !== -1
          ? prev.map((e, i) => (i === idx ? updatedEvent : e))
          : [...prev, updatedEvent];
      });
    }
    if (deletedEvent) {
      setEvents(prev => prev.filter(e => e.id !== deletedEvent.id));
    }
    setEditorEventId(undefined);
  };

  return (
    <Box sx={{p: 3}}>

      <Box sx={{textAlign: 'right'}}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEditorEventId("")}
        >
          Add Event
        </Button>
      </Box>

      <DataGrid
        columns={columns}
        rows={events}
        loading={loading}
        error={error}
        getRowKey={row => row.id}
        onRowClick={row => setEditorEventId(row.id)}
      />

      <EventEditorModal
        editEventId={editorEventId}
        onClose={handleEditorClose}
      />

      {confirmViewer}

    </Box>
  );
};
