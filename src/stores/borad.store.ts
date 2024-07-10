import {create} from "zustand";

// Board Write Comp 전역상태.
interface BoardStore {
    title: string,
    content: string,
    boardImgFileList: File[],
    setTitle: (title: string) => void,  // setter
    setContent: (content: string) => void,//setter
    setBoardImgFileList: (boardImgFileList: File[]) => void,//setter
    resetBoard: () => void

}


const useBoardStore = create<BoardStore>(setState => ({
    title: "",
    content: "",
    boardImgFileList: [],
    setTitle: title => setState(state => ({...state, title: title})),
    setContent: content => setState(state => ({...state, content: content})),
    setBoardImgFileList: boardImgFileList => setState(state => ({...state, boardImgFileList: boardImgFileList})),
    resetBoard: () => setState(state => ({...state, title: "", content: "", boardImgFileList: []}))
}));

export default useBoardStore;

