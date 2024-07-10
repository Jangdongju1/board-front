import {User} from "../types/interface";
import {create} from "zustand";

interface LoginUserStore{
    loginUser : User | null,
    setLoginUser :   (loginUser: User) => void;
    resetLoginUser : () => void;
}




// global state : 유저의 로그인 상태(전역 상태)
const useLoginUserStore = create<LoginUserStore>((set) => ({
    loginUser: null,
    setLoginUser: (user) => set({loginUser: user}),
    resetLoginUser: () => set({loginUser: null})
}))

export default useLoginUserStore;
