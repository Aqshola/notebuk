import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Button from "./Button";

export function useModalDialog() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
  });

  function showDialog({ title = "", content = "" }) {
    setOpenDialog(true);
    setDialogContent({ title, content });
  }

  function closeDialog() {
    setOpenDialog(false);
    setDialogContent({ title: "", content: "" });
  }

  const ModalDialog = () => (
    <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96 font-comic-neue">
          <Dialog.Title className="text-xl font-bold text-center ">
            {dialogContent.title}
          </Dialog.Title>
          <Dialog.Description className="mt-5">
            {dialogContent.content}
          </Dialog.Description>
          <Dialog.Close asChild className="mt-5 flex  ml-auto">
            <Button size={"sm"} variant={"default"} styleMode="sketch">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return { ModalDialog, showDialog, closeDialog };
}
