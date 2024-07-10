import {create} from "zustand";
import {User} from "../types/interface";
import {createJSONStorage, persist} from "zustand/middleware";

interface LoginInfo {
    loginUser: User | null,
    setLoginUser: (loginUser: User) => void;
    resetLoginUser: () => void;
}

const useLoginInfoStore = create<LoginInfo>((set) => ({
    loginUser: null,
    setLoginUser: (user) => set({loginUser: user}),
    resetLoginUser: () => set({loginUser: null})
}))

// const persistenceUserLoginStore = persist<LoginInfo>(
//     useLoginInfoStore,
//     {name: "auth-store", storage: createJSONStorage(() => sessionStorage)},);
//



export default useLoginInfoStore;

