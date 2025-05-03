import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useRef, useState } from "react";
import Button from "./Button"; // your custom button

type PopupType = "info" | "warning" | "success" | "error";

interface ShowDialogParams {
  title: string;
  message: string;
  type?: PopupType;
  showOkButton?: boolean;
}

export function useModalDialog() {
  const [open, setOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<{
    title: string;
    message: string;
    type: PopupType;
    showOkButton: boolean;
  }>({
    title: "",
    message: "",
    type: "info",
    showOkButton: false,
  });

  const resolveRef = useRef<(result: boolean) => void>();

  const showDialog = useCallback(
    ({
      title,
      message,
      type = "info",
      showOkButton = false,
    }: ShowDialogParams): Promise<boolean> => {
      setPopupContent({ title, message, type, showOkButton });
      setOpen(true); // 🔒 safe to open now
      return new Promise((resolve) => {
        resolveRef.current = resolve; // ✅ set resolve first
      });
    },
    []
  );

  const closeDialog = useCallback((result: boolean) => {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = undefined;
  }, []);

  const ModalDialog = () => (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeDialog(true); // default to `true` when dismissed by backdrop or Escape
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96 font-comic-neue shadow-lg">
          <Dialog.Title className="text-xl font-bold text-center mb-2">
            {popupContent.title}
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-center">
            {popupContent.message}
          </Dialog.Description>
          <div className="flex justify-end space-x-2">
            {popupContent.showOkButton && (
              <Button
                size="sm"
                variant="default"
                styleMode="sketch"
                onClick={() => closeDialog(true)}
              >
                OK
              </Button>
            )}
            <Dialog.Close asChild>
              <Button
                size="sm"
                variant="default"
                styleMode="sketch"
                onClick={() => closeDialog(true)}
              >
                Close
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return { ModalDialog, showDialog };
}
