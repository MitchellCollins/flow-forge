import { capitiliseFirstChar } from "@/utils/capitilise-first-char";
import { CheckOutlined, Close, Warning } from "@mui/icons-material";
import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

export type NotifyType = "alert" | "error" | "undo";

export type NotifyProps = {
  id: string;
  message: string;
  type: NotifyType;
  timeout?: number;
  onUndo?: () => void;
  onTimeout?: () => void;
};

const typeMapper = {
  alert: "success",
  error: "error",
  undo: "success",
};

export function Notification({
  id,
  message,
  type,
  onClose,
  timeout = 2000,
  onUndo = () => {},
  onTimeout = () => {},
}: NotifyProps & { onClose: (id: string) => void }) {
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const status = typeMapper[type];

  const clearCloseTimeout = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  // Called when closed or timeout
  const handleClose = () => {
    clearCloseTimeout();
    onClose(id);
    onTimeout();
  };

  const handleUndo = () => {
    onClose(id);
    onUndo();
  };

  useEffect(() => {
    closeTimeout.current = setTimeout(handleClose, timeout);

    return clearCloseTimeout;
  }, []);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 2,
        bgcolor: `${status}.main`,
        zIndex: 4,
        justifyContent: "space-between",
      }}
      component={Paper}
    >
      {/* Title & Message */}
      <Grid container spacing={1} sx={{ alignItems: "center" }}>
        {/* Icon & Title */}
        <Grid container spacing={1} sx={{ alignItems: "center" }}>
          {status === "error" ? <Warning /> : <CheckOutlined />}
          <Typography variant="h5">{capitiliseFirstChar(status)}</Typography>
        </Grid>

        <Typography>{message}</Typography>
      </Grid>

      {type === "undo" ? (
        // Undo Button
        <Grid>
          <Button variant="contained" onClick={handleUndo}>
            Undo
          </Button>
        </Grid>
      ) : (
        // Close Cross Button
        <Grid>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}
