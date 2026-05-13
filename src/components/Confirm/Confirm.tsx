import React, {type ComponentType} from "react";

import {
  type ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {useIsMac} from "../useIsMac";

interface IConfirmProps {
  // Dev tip: The `useConfirm` hook simplifies the usage of this component.
  show: boolean;        // We turn it to true when we want to ask the user something
  title: string;
  message?: string;             // Same as the children
  children?: React.ReactNode;   // Same as message
  helperMessage?: string;

/**
   * Hides the cancel button.
   */
  hideCancelButton?: boolean;

  buttonConfirmColor?: ButtonProps['color'];
  buttonConfirmIcon?: ComponentType;
  buttonCancelColor?: ButtonProps['color'];
  buttonCancelIcon?: ComponentType;

  forceUserConfirmation?: boolean; // Set it true to force users to click a button to confirm/cancel

  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: (confirm: boolean) => void;

  messages?: Partial<IConfirmMessages>;
}

export interface IConfirmMessages {
  confirm: string;
  cancel: string;
}

const defaultMessages: IConfirmMessages = {
  confirm: 'Confirm',
  cancel: 'Cancel',
};

export const Confirm = (props: IConfirmProps) => {
  const {
    show,
    title,
    message = "",
    children,
    helperMessage = "",
    forceUserConfirmation = false,
    hideCancelButton = false,
    buttonConfirmColor = "primary",
    buttonConfirmIcon: ConfirmIcon,
    buttonCancelColor = "secondary",
    buttonCancelIcon: CancelIcon,
    onConfirm,
    onCancel,
    onClose,
    messages: userMessages,
  } = props;
  const messages: IConfirmMessages = {
    ...defaultMessages,
    ...userMessages,
  };
  const isMac = useIsMac();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOkClick = (): void => {
    onConfirm?.();
    onClose?.(true);
  };

  const handleCancelClick = (): void => {
    onCancel?.();
    onClose?.(false);
  };

  const primaryButton = (
    <Button
      startIcon={ConfirmIcon ? <ConfirmIcon /> : undefined}
      variant="contained"
      color={buttonConfirmColor}
      size="medium"
      onClick={handleOkClick}
    >
      {messages.confirm}
    </Button>
  );

  return (
    <Dialog
      sx={{zIndex: 3200}}
      open={show}
      onClose={forceUserConfirmation ? handleCancelClick : undefined}
      aria-labelledby={`confirmation-dialog-${title}`}
      fullScreen={fullScreen}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          <strong style={{fontSize: theme.typography.fontSize + 2}}>
            {message}
          </strong>
        </DialogContentText>
        {children}
        <br/>
        <br/>
        <Box
          component="span"
          sx={{
            fontStyle: 'italic',
            fontWeight: 'bold',
            whiteSpace: 'pre',
            marginTop: theme => theme.spacing(1),
          }}
        >
          {helperMessage}
        </Box>
      </DialogContent>
      <DialogActions>
        {!isMac && primaryButton}
        {!hideCancelButton && (
          <Button
            startIcon={CancelIcon ? <CancelIcon /> : undefined}
            variant="contained"
            color={buttonCancelColor}
            size="medium"
            onClick={handleCancelClick}
          >
            {messages.cancel}
          </Button>
        )}
        {isMac && primaryButton}
      </DialogActions>
    </Dialog>
  );
};
