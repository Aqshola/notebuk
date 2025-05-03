import { create } from "zustand";

type globalState = {
  loginEmailGlobal: string;
  setLoginEmailGlobal: (value: string) => void;
};

const useGlobalStore = create<globalState>((set) => ({
  loginEmailGlobal:"",
  setLoginEmailGlobal: (value) => set(() => ({ loginEmailGlobal: value })),
}));

export default useGlobalStore;
