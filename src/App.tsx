import React, {useEffect} from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Main from "./views/Main";
import Authentication from "./views/Authentication";
import UserPage from "./views/User";
import BoardDetail from "./views/Board/Detail";
import BoardWrite from "./views/Board/Write";
import BoardUpdate from "./views/Board/Update";
import Search from "./views/Search";
import Container from "./layouts/Container";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "./constant";
import {useCookies} from "react-cookie";
import {getSignInUserRequest} from "./apis";
import {GetSignInUserResponseDto} from "./apis/response/user";
import {ResponseDto} from "./apis/response";
import {ResponseCode} from "./types/enum";
import {User} from "./types/interface";
import useLoginUserStore from "./stores/login-user.store";

//component: Application컴포넌트

//render: Application컴포넌트 렌더링
//description : 메인화면 : '/'
//description : 로그인 + 회원가입 -> url - '/auth', compname - Authentication
//description : 검색화면 -> url - /search/:searchWord, compname - Search
//description : 게시물 상세보기 -> url - '/board/detail/:boardNum' ,compname - BoardDetail
//description : 게시물 작성하기 -> url - '/board /write' compname - BoardDetail
//description : 게시물 수정하기 -> url - '/board/update/:boardNum', compname - BoardUpdate
//description : 유저 페이지 -> url '/user/:email' compname - User


function App() {
    // state : 로그인되 유저의 전역상태.
    const {setLoginUser, resetLoginUser} = useLoginUserStore();



    // state : cookie 상태(저장되는 값은 엑세스토큰임)
    const [cookies, setCookies] = useCookies();

    // function : 로그인한 유저에 대한 응담 처리함수.
    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if (code === ResponseCode.AUTHENTICATION_FAILED || code === ResponseCode.NOT_EXIST_USER || code === ResponseCode.DATABASE_ERROR) {
            resetLoginUser();
            return;
        }
        const loginUser: User = {...responseBody as GetSignInUserResponseDto}
        setLoginUser(loginUser);
    }



    // effect : 엑세스 토큰의 값이 변경될 때마다 실행될 함수 .
    useEffect(() => {
        if (!cookies.accessToken) {// 토큰이 없는경우.
            resetLoginUser();
            return;
        }
        // 로그인된 유저인지 확인하는요청..
        getSignInUserRequest(cookies.accessToken).then(responseBody => {
            getSignInUserResponse(responseBody);
        });
    }, [cookies.accessToken]);

    return (
        <Routes>
            <Route element={<Container/>}>
                <Route path={MAIN_PATH()} element={<Main/>}/>
                <Route path={AUTH_PATH()} element={<Authentication/>}/>
                <Route path={SEARCH_PATH(":searchWord")} element={<Search/>}/>
                <Route path={USER_PATH(":userEmail")} element={<UserPage/>}/>
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_WRITE_PATH()} element={<BoardWrite/>}/>
                    <Route path={BOARD_DETAIL_PATH(":boardNum")} element={<BoardDetail/>}/>
                    <Route path={BOARD_UPDATE_PATH(":boardNum")} element={<BoardUpdate/>}/>
                </Route>
                <Route path="*" element={<h1>404 NOT FOUND.</h1>}/>
            </Route>
        </Routes>
    );
}

export default App;
