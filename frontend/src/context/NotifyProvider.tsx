import { Notification, NotifyProps } from "@/components/Notification";
import { Grid } from "@mui/material";
import { createContext, ReactNode, useState } from "react";

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

  const alert = (message: string, timeout = 2000) => {
    setAlerts((prevAlerts) => [...prevAlerts, { message, type: "alert", timeout }]);
  };

  const error = (message: string, timeout = 4000) => {
    setAlerts((prevAlerts) => [...prevAlerts, { message, type: "error", timeout }]);
  };

  const undo = (message: string, timeout = 4000) => {
    return new Promise<boolean>((resolve) => {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          message,
          type: "undo",
          timeout,
          onUndo: () => resolve(true),
          onTimeout: () => resolve(false),
        },
      ]);
    });
  };

  const handleClose = (index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert, i) => i !== index));
  };

  return (
    <NotifyContext value={{ alert, error, undo }}>
      <Grid
        container
        spacing={2}
        sx={{ position: "fixed", zIndex: 1, right: 0, bottom: 0, flexDirection: "column", m: 4 }}
      >
        {alerts.map((alert, index) => (
          <Notification
            key={`notification-${index}`}
            index={index}
            {...alert}
            onClose={handleClose}
          />
        ))}
      </Grid>
      {children}
    </NotifyContext>
  );
}
