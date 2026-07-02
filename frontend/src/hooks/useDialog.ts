import { DialogContext } from "@/context/DialogProvider";
import { useContext } from "react";

export const useDialog = () => useContext(DialogContext);
