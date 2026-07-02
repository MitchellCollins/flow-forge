import { Warning } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogTitle, Grid, Typography } from "@mui/material";
import { createContext, ReactNode, useEffect, useState } from "react";

export type DialogType = "confirmation";
export type DialogProp = {
  type: DialogType;
  text: string;
  onAnswer?: (answer: boolean) => void;
};

export const DialogContext = createContext<{ confirmation: (text: string) => Promise<boolean> }>({
  confirmation: () => Promise.resolve(false),
});

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogProp | null>(null);
  const [queue, setQueue] = useState<DialogProp[]>([]);

  // Deconstructs dialogue props and set default values
  const type = dialog?.type;
  const text = dialog?.text ?? "";
  const onAnswer = dialog?.onAnswer ?? (() => {});

  useEffect(() => {
    if (dialog || queue.length <= 0) return;

    setDialog(queue[0]);
    setQueue((prevQueue) => prevQueue.slice(1, queue.length));
  }, [dialog, queue]);

  const action = (answer: boolean) => {
    onAnswer(answer);
    setDialog(null);
  };

  const confirmation = (text: string) => {
    return new Promise<boolean>((resolve) => {
      setQueue((prevQueue) => [...prevQueue, { type: "confirmation", text, onAnswer: resolve }]);
    });
  };

  return (
    <DialogContext value={{ confirmation }}>
      <Dialog open={!!dialog}>
        <DialogTitle>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            {type === "confirmation" && <Warning color="warning" />}
            <Typography variant="h5">{text}</Typography>
          </Grid>
        </DialogTitle>
        {type === "confirmation" && (
          <DialogActions>
            <Grid container spacing={2}>
              <Button variant="contained" onClick={() => action(true)}>
                Confirm
              </Button>
              <Button variant="outlined" color="error" onClick={() => action(false)}>
                Cancel
              </Button>
            </Grid>
          </DialogActions>
        )}
      </Dialog>
      {children}
    </DialogContext>
  );
}
