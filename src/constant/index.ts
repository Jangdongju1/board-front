export const MAIN_PATH = () => '/';
export const AUTH_PATH = () => '/auth';
export const SEARCH_PATH = (searchWord : string) => `/search/${searchWord}`;
export const USER_PATH = (userEmail: string) => `/user/${userEmail}`;
export const BOARD_PATH = () => '/board';
export const BOARD_DETAIL_PATH = (boardNum: string | number) => `detail/${boardNum}`;
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_UPDATE_PATH = (boardNum: string) => `update/${boardNum}`;


export enum StartPath{
    MAIN = "/",
    AUTH_PATH = "/auth",
    SEARCH_PATH = "/search",
    USER_PATH = "/user/",
    BOARD_PATH = "/board",
    BOARD_DETAIL_PATH = "/board/detail",
    BOARD_WRITE_PATH = "/board/write",
    BOARD_UPDATE_PATH = "/board/update"
}

