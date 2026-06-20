import { capitiliseFirstChar } from "@/utils/capitilise-first-char";
import { Close, Warning } from "@mui/icons-material";
import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

export type NotifyType = "alert" | "error" | "confirm" | "undo";

export type NotifyProps = {
  message: string;
  type: NotifyType;
  timeout?: number;
  onAnswer?: (value: boolean) => void;
  onUndo?: () => void;
  onTimeout?: () => void;
};

export function Notification({
  index,
  message,
  type,
  onClose,
  timeout = 2000,
  onAnswer = () => {},
  onUndo = () => {},
  onTimeout = () => {},
}: NotifyProps & { index: number; onClose: (index: number) => void }) {
  const typeMapper = {
    alert: "success",
    error: "error",
    confirm: "warning",
    undo: "success",
  };

  const status = typeMapper[type];

  // Called when closed or timeout
  const handleClose = () => {
    onClose(index);
    onTimeout();
  };

  // Called when answer action is clicked
  const handleAnswer = (answer: boolean) => {
    onClose(index);
    onAnswer(answer);
  };

  const handleUndo = () => {
    onClose(index);
    onUndo();
  };

  useEffect(() => {
    const closeTimeout = setTimeout(handleClose, timeout);

    return () => clearTimeout(closeTimeout);
  }, []);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 2,
        bgcolor: `${status}.main`,
        color: `${status}.contrastText`,
        zIndex: 4,
        justifyContent: "space-between",
      }}
      component={Paper}
    >
      <Grid container spacing={2} sx={{ flexDirection: "column" }}>
        {/* Title & Message */}
        <Grid container spacing={2} sx={{ flexDirection: "column" }}>
          {/* Icon & Title */}
          <Grid container spacing={1}>
            <Grid>
              <Warning />
            </Grid>
            <Grid>
              <Typography variant="h5">{capitiliseFirstChar(status)}</Typography>
            </Grid>
          </Grid>

          <Grid>
            <Typography>{message}</Typography>
          </Grid>
        </Grid>

        {/* Actions */}
        {type === "confirm" && (
          <Grid container spacing={2}>
            {/* Confirm | Cancel */}
            <Button variant="contained" onClick={() => handleAnswer(true)}>
              Confirm
            </Button>
            <Button color="error" variant="contained" onClick={() => handleAnswer(false)}>
              Cancel
            </Button>
          </Grid>
        )}

        {type === "undo" && (
          <Grid>
            <Button variant="contained" onClick={handleUndo}>
              Undo
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Close Icon */}
      <Grid>
        <IconButton onClick={handleClose} sx={{ color: `${status}.contrastText` }}>
          <Close />
        </IconButton>
      </Grid>
    </Grid>
  );
}
