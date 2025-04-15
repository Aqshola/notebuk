import { create } from "zustand";

type TransitionState = {
  complete: boolean;
  setComplete: (value: boolean) => void;
};

const useTransitionStore = create<TransitionState>((set) => ({
  complete: false,
  setComplete: (value) => set(() => ({ complete: value })),
}));

export default useTransitionStore;
