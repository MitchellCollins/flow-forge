import { NotifyContext } from "@/context/NotifyProvider";
import { useContext } from "react";

export const useNotify = () => useContext(NotifyContext);
