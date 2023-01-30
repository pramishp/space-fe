import {create} from "zustand";
import {UIStates} from "../constants/constants";

export const useUIStore = create((set, get) => ({
    currentState: UIStates.Editor,
    setEditor: () => {
        set({currentState: UIStates.Editor})
    },
    setAnimation: () => {
        set({currentState: UIStates.Animation})
    },
    setPreview: () => {
        set({currentState: UIStates.Preview})
    }
}))