import { Notification, NotifyProps } from "@/components/Notification";
import { Grid } from "@mui/material";
import { createContext, ReactNode, useCallback, useState } from "react";

export const NotifyContext = createContext<{
  alert: (message: string) => void;
  error: (message: string) => void;
  undo: (message: string) => Promise<boolean>;
}>({
  alert: () => {},
  error: () => {},
  undo: () => Promise.resolve(false),
});

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<NotifyProps[]>([]);

  const alert = useCallback((message: string, timeout = 2000) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { id: crypto.randomUUID(), message, type: "alert", timeout },
    ]);
  }, []);

  const error = useCallback((message: string, timeout = 4000) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { id: crypto.randomUUID(), message, type: "error", timeout },
    ]);
  }, []);

  const undo = useCallback((message: string, timeout = 4000) => {
    return new Promise<boolean>((resolve) => {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          id: crypto.randomUUID(),
          message,
          type: "undo",
          timeout,
          onUndo: () => resolve(true),
          onTimeout: () => resolve(false),
        },
      ]);
    });
  }, []);

  const handleClose = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <NotifyContext value={{ alert, error, undo }}>
      <Grid
        container
        spacing={2}
        sx={{
          position: "fixed",
          zIndex: 1,
          right: 0,
          bottom: 0,
          flexDirection: "column",
          alignItems: "flex-end",
          m: 4,
        }}
      >
        {alerts.map((alert) => (
          <Notification key={`notification-${alert.id}`} {...alert} onClose={handleClose} />
        ))}
      </Grid>
      {children}
    </NotifyContext>
  );
}
