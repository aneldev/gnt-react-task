import React from "react";
import {
  Box,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import {
  EBackdrop,
  Modal,
} from "../../components/Modal";
import {Form} from "../../components/Form";
import {InputDateTime} from "../../components/InputDateTime";

import type {IEvent} from "../../api/IEvent";
import {apiEventGetLoad} from "../../api/apiEventGetLoad";
import {apiEventPost} from "../../api/apiEventPost";
import {apiEventPut} from "../../api/apiEventPut";
import {apiEventDelete} from '../../api/apiEventDelete.ts';

export interface IEventEditorModalProps {
  /**
   * Load event id
   *
   * - non empty string = edit event
   * - empty string = new event
   * - undefined = hide modal
   */
  editEventId?: string;

  /**
   * For new only events, prefilled values
   */
  newDefaults?: Partial<Omit<IEvent, "id">>;

  /**
   * If the event was updated, it will be passed to the callback.
   *
   * Otherwise it is consider as cancel
   */
  onClose: (result: {
    updatedEvent?: IEvent;
    deletedEvent?: IEvent;
  }) => void;
}

export const EventEditorModal: React.FC<IEventEditorModalProps> = (
  {
    editEventId,
    newDefaults,
    onClose,
  },
) => {
  return (
    <Modal
      show={editEventId !== undefined}
      scrollY
      size={{
        mobile: {width: "90%", maxWidth: 520},
        laptop: {width: 520},
      }}
      backdrop={EBackdrop.DIMMED}
    >
      <Box sx={{p: 3}}>
        {editEventId !== undefined && (
          <Form<IEvent>
            isModal
            mode={editEventId ? "edit" : "create"}
            restartId={editEventId}
            loadData={async () => {
              if (!editEventId) {
                return {
                  id: "",
                  title: "",
                  description: "",
                  startDate: new Date(),
                  endDate: new Date(Date.now() + 60 * 60 * 1000),
                  color: "#1976d2",
                  ...newDefaults,
                } as IEvent;
              }
              const event = await apiEventGetLoad({id: editEventId});
              if (!event) throw new Error("Event not found.");
              return event;
            }}
            validationRules={{
              title: (v) => (v ? "" : "Title is required"),
              startDate: (v) => {
                const d = v as Date;
                return d instanceof Date && !isNaN(d.getTime()) ? "" : "Start date is invalid";
              },
              endDate: (v, data) => {
                const d = v as Date;
                if (!(d instanceof Date) || isNaN(d.getTime())) return "End date is invalid";
                if (d <= data.startDate) return "End date must be after start date";
                return "";
              },
            }}
            onApiPost={async (data) => {
              const saved = await apiEventPost({event: data});
              setTimeout(() => onClose({updatedEvent: saved}), 1500);
              return saved;
            }}
            onApiPut={async (data) => {
              await apiEventPut({event: data});
              setTimeout(() => onClose({updatedEvent: data}), 1500);
            }}
            onApiDelete={async (event) => {
              await apiEventDelete({id: event.id!});
              setTimeout(() => onClose({deletedEvent: event}), 1500);
            }}
            onCancel={() => onClose({})}
            onClose={() => onClose({})}
          >
            {({input, watch}) => (
              <>
                <Typography variant="h5" sx={{mb: 2}}>
                  {editEventId ? "Edit Event" : "New Event"}
                  {watch("title", v => v ? ` - ${v}` : null)}
                </Typography>

                <Divider sx={{mb: 2}}/>

                {input("title", (props) => (
                  <TextField
                    {...props}
                    label="Title"
                    fullWidth
                    autoFocus
                  />
                ))}

                {input("description", (props) => (
                  <TextField
                    {...props}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                  />
                ))}

                {input("startDate", (props) => (
                  <InputDateTime
                    {...props}
                    label="Start Date"
                    ariaLabel="Event start date and time"
                    time
                  />
                ))}

                {input("endDate", (props) => (
                  <InputDateTime
                    {...props}
                    label="End Date"
                    ariaLabel="Event end date and time"
                    time
                  />
                ))}

                {input("color", (props) => (
                  <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                    <Box
                      {...props}
                      sx={{
                        width: 40,
                        height: 40,
                        border: "none",
                        borderRadius: 1,
                        cursor: props.disabled ? "not-allowed" : "pointer",
                        p: 0,
                        backgroundColor: "transparent",
                      }}
                      component="input"
                      type="color"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Event color
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Form>
        )}
      </Box>
    </Modal>
  );
};
