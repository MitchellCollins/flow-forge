import { StorageContext } from "@/context/StorageProvider";
import { useContext } from "react";

export const useStorage = () => useContext(StorageContext);
