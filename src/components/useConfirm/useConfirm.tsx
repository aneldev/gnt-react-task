import React, {
  useState,
  useRef,
} from "react";
import type {ButtonProps} from "@mui/material";

import {
  Confirm,
  type IConfirmMessages,
} from "../Confirm";

export interface IConfirmArgs {
  title: string;
  message?: string;
  children?: React.ReactNode;
  helperMessage?: string;

  /**
   * Hides the cancel button.
   *
   * **Consider using the `useAlert` instead**
   */
  hideCancelButton?: boolean;

  buttonConfirmColor?: ButtonProps['color'];
  buttonCancelColor?: ButtonProps['color'];

  forceUserConfirmation?: boolean;

  messages?: Partial<IConfirmMessages>;
}

/**
 * The `useConfirm` hook returns an object that contains the `confirm` function, which returns a `Promise<boolean>`.
 * Additionally, it returns the `confirmViewer` JSX.Element, which must be rendered **always**!
 * Internally, this hook manages the actual visibility of the confirmation dialog.
 */
export const useConfirm = (): {
  confirm: (confirmArgs: IConfirmArgs) => Promise<boolean>;
  confirmViewer: React.ReactNode;
} => {
  const [show, setShow] = useState<boolean>(false);
  const [args, setArgs] = useState<IConfirmArgs>({title: ''});

  const refPromise = useRef<{ resolve: (confirm: boolean) => void } | null>(null);

  const handleOk = () => {
    setShow(false);
    refPromise.current?.resolve(true);
    refPromise.current = null;
  };

  const handleCancel = () => {
    setShow(false);
    refPromise.current?.resolve(false);
    refPromise.current = null;
  };

  const handleClose = (confirm: boolean) => {
    setShow(false);
    refPromise.current?.resolve(confirm);
    refPromise.current = null;
  };

  return {
    confirm: async confirmArgs => {
      setArgs(confirmArgs);
      setShow(true);
      return new Promise<boolean>(resolve => {
        refPromise.current = {resolve};
      });
    },
    confirmViewer: (
      <Confirm
        {...args}
        show={show}
        onConfirm={handleOk}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    ),
  };
};
