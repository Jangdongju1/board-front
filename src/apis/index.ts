import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import {SignInResponseDto, SignUpResponseDto} from "./response/auth";
import {ResponseDto} from "./response";
import {getSignInUserResponseDto} from "./response/user";
import {PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto} from "./request/board";
import {
    DeleteBoardResponseDto,
    FavoriteResponseDto, GetBoardFavoriteListResponseDto,
    GetBoardResponseDto, GetLatestBoardListResponseDto, GetSearchBoardListResponseDto, GetTop3BoardListResponseDto,
    IncreaseViewCountResponseDto,
    PostBoardResponseDto
} from "./response/board";
import PostBoardCommentResponseDto from "./response/board/post-board-comment.response.dto";
import GetBoardCommentListResponseDto from "./response/board/get-board-comment-list.response.dto";
import {GetPopularListResponseDto} from "./response/search";
import GetRelationListResponseDto from "./response/search/get-relation-list.response.dto";

const DOMAIN = "http://localhost:4000";
const API_DOMAIN = `${DOMAIN}/api/v1`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_POPULAR_WORD_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;
const POST_COMMENT_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}/comment`;
const GET_COMMENT_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}/comment-list`;
const GET_BOARD_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}`;
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord} ${preSearchWord ? `/${preSearchWord}` : ``}`;
const GET_RELATION_WORD_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/${searchWord}/relation-list`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const FILE_DOMAIN = () => `${DOMAIN}/file`;//
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN()}/upload`;
const GET_INCREASE_VIEW_COUNT_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}/increase-view-count`;
const PUT_FAVORITE_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}/favorite`;
const GET_FAVORITE_LIST_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}/favorite-list`;
const DELETE_BOARD_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}`;
const PATCH_BOARD_URL = (boardNum: string | number) => `${API_DOMAIN}/board/${boardNum}`;
// 엑세스 토큰을 헤더에 세팅하고 요청을 보냄.
const authorization = (token: string) => {
    return {headers: {Authorization: `Bearer ${token}`}};
}
// 헤더의 멀티파트(파일업로드)옵션.
const MULTI_PART_OPTION = () => {
    return {headers: {"Content-Type": "multipart/form-data"}}
}

// auth 관련 요청.
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignInResponseDto = response.data;
            return responseBody
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody
        })
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(reponse => {
            const responseBody: SignUpResponseDto = reponse.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

// 로그인된 유저를 확인하는 요청.(엑세스 토큰의 유효여부를 확인함.)
export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(resoponse => {
            const responseBody: getSignInUserResponseDto = resoponse.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

// 게시글 관련 api호출 부분.
export const getBoardRequest = async (boardNum: string | number) => {
    const result = await axios.get(GET_BOARD_URL(boardNum))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody = error.response.data;
            return responseBody;
        });
    return result;
}
// 최신 게시물 관련 api호출
export const getLatestBoardListRequest = async () => {
    const reuslt = await axios.get(GET_LATEST_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetLatestBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return reuslt;
}

// top3 게시물 api 호출
export const getTop3BoardListRequest = async () => {
    const result = await axios.get(GET_TOP3_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetTop3BoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

// 검색 게시물 api호출
export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        .then(response =>{
            const responseBody : GetSearchBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
// 연관 검색어 api호출
export const getRelationWordListRequest = async (searchWord : string)=>{
    const reuslt = await axios.get(GET_RELATION_WORD_LIST_URL(searchWord))
        .then(response =>{
            const responseBody : GetRelationListResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return reuslt;
}
export const getPopularWordListRequest = async () => {
    const reuslt = await axios.get(GET_POPULAR_WORD_LIST_URL())
        .then(response => {
            const respsoneBody: GetPopularListResponseDto = response.data;
            return respsoneBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return reuslt;
}
// 조회수 +1
export const increaseViewCountRequest = async (boardNum: string | number) => {
    const reuslt = await axios.get(GET_INCREASE_VIEW_COUNT_URL(boardNum))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody = error.response.data;
            return responseBody;
        });

    return reuslt;
}
// 게시물 게시 api 호출
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


// Request : 파일 업로드 요청.
export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, MULTI_PART_OPTION())
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
}
// 댓글 리스트 요청
export const postCommentRequest = async (boardNum: string | number, accessToken: string, requestBody: PostCommentRequestDto) => {
    const result = await axios.post(POST_COMMENT_URL(boardNum), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardCommentResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;

}
export const getCommentListRequest = async (boardNum: string | number) => {
    const result = await axios.get(GET_COMMENT_URL(boardNum))
        .then(response => {
            const responseBody: GetBoardCommentListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

// 좋아요 요청.
export const putFavoriteRequest = async (boardNum: string | number, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardNum), {}, authorization(accessToken))
        .then(response => {
            const responseBody: FavoriteResponseDto = response.data;
            return responseBody
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const getFavoriteListRequest = async (boardNum: string | number) => {
    const reuslt = await axios.get(GET_FAVORITE_LIST_URL(boardNum))
        .then(response => {
            const responseBody: GetBoardFavoriteListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return reuslt;
}

// 게시글 삭제 api 1)게시글 정보 2) 댓글 3) 좋아요리스트?

export const deleteBoardRequest = async (boardNum: string | number, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardNum), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

// 게시글 수정 api

export const patchBoardRequest = async (boardNum: number | string, patchRequest: PatchBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNum), patchRequest, authorization(accessToken))
        .then(response => {
            const responseBody = response.data;
            return responseBody;
        })
        .catch(error => {
            // 상태코드가 200이 아닐때..
            if (!error.response.data) return null;
            const responseBody = error.response.data;
            return responseBody;
        });

    return result;
}


