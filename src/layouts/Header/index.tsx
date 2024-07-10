import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import './style.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, MAIN_PATH, SEARCH_PATH, StartPath, USER_PATH} from "../../constant";
import {useCookies} from "react-cookie";
import {useBoardStore, useLogInUserStore} from "../../stores";
import {fileUploadRequest, patchBoardRequest, postBoardRequest} from "../../apis";
import {PatchBoardRequestDto, PostBoardRequestDto} from "../../apis/request/board";
import {PostBoardResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {ResponseCode} from "../../types/enum";


//component : 헤더 레이아웃
export default function Header() {
    //function : 네비게이트 함수
    const navigator = useNavigate();  // 네비게이트 함수는 아마도 href속성을 대신한 함수일 것.
    // state : 유저의 로그인 상태.
    const {loginUser, setLoginUser, resetLoginUser} = useLogInUserStore();
    // cookie
    const [cookies, setCookies, removeCookies] = useCookies();
    // state : 로그인 상태 확인.
    const [isLogIn, setLogIn] = useState(false);

    // state : path상태
    const {pathname} = useLocation();
    // state : 게시물 번호 pathVariable 상태.
    const {boardNum} = useParams();
    // state :  pathname에 따른 조건부 버튼 활성화를 위한 상태
    const [isUser, setUser] = useState(false);
    const [isAuth, setAuth] = useState(false);
    const [isMain, setMain] = useState(false);
    const [isSearch, setSearch] = useState(false);
    const [isBoardDetail, setBoardDetail] = useState(false);
    const [isBoardWrite, setBoardWrite] = useState(false);
    const [isBoardUpdate, setBoardUpdate] = useState(false);


    // 로고 클릭 헨들러  == 클릭시 메인으로.
    const onLogoClickHandler = () => {
        navigator(MAIN_PATH());
    }

    // component : 검색버튼 컴포넌트 랜더링
    const SearchBtn = () => {
        // 해당 "컴포넌트"의 상태 .
        const [status, setStatus] = useState(false);
        const [word, setWord] = useState("");
        const searchBtnRef = useRef<HTMLDivElement | null>(null);  //  HTML요소 참조.
        const {searchWord} = useParams();

        // event handler : 검색창 변화 이벤트 감지.
        const onSearchWordChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setWord(value);
        }

        //  event handler : 검색 버튼 클릭
        const onSearchBtnClickHandler = () => {
            // 버튼 클릭시 true를 반환하게 만듬.
            if (!status) {
                setStatus(true);
                return;
            }

            navigator(SEARCH_PATH(word));
        }

        // event handler : 검색창 엔터기 입력처리
        const onSearchBtnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            // 엔터 입력시  검색버튼 클릭 효과
            if (e.key !== "Enter") return;
            if (!searchBtnRef.current) return; // 버튼이 없는경우 처리.
            searchBtnRef.current.click();  // 엔터키를  치는 경우에 버튼 클릭 효과.
        }

        // effect : 검색어 path variable이 변경 될 때마다 실행될 함수.
        useEffect(() => {
            // 검색어가 입력되어서 검색이 되었을때 1) 검색창 유지 및 url유지.
            if (searchWord === undefined) {
                return;
            }
            setWord(searchWord);
            setStatus(true);
            return;
        }, [searchWord]);

        if (!status)
            return <div className="icon-button" onClick={onSearchBtnClickHandler}>
                <div className="icon search-light-icon"></div>
            </div>

        return (
            <div className="header-search-input-box">
                <input className="header-search-input" type="text" placeholder="검색어를 입력해 주세요." value={word}
                       onChange={onSearchWordChangeEventHandler} onKeyDown={onSearchBtnKeyDownHandler}/>
                <div ref={searchBtnRef} className="icon-button" onClick={onSearchBtnClickHandler}>
                    <div className="icon search-light-icon"></div>
                </div>
            </div>
        )
    }

    // Component : 마이페이지 버튼.
    const MyPageBtn = () => {
        // state : 유저 이메일  path variable 상태
        //   const {userEmail} = useParams();


        // event Handler : 마이페이지 버튼 클릭 헨들러
        const onMyPageBtnClickHandler = () => {
            if (!loginUser) return;
            const {userEmail} = loginUser;
            navigator(USER_PATH(userEmail))  // 매개변수 == userEmail
        }
        // event Handler : 로그인 버튼 클릭 헨들러
        const onSignUpBtnClickHandler = () => {
            navigator(AUTH_PATH())
        }
        const onSignOutBtnClickHandler = () => {
            resetLoginUser();
            setCookies("accessToken", "", {path: MAIN_PATH(), expires: new Date()}); // 쿠키 초기화 .
            navigator(MAIN_PATH());
        }

        if (isLogIn) {
            return (
                <>
                    <div className="white-button" onClick={onSignOutBtnClickHandler}>{"로그아웃"}</div>
                    <div className="white-button" onClick={onMyPageBtnClickHandler}>{"마이페이지"}</div>
                </>
            )
        }

        return <div className="black-button" onClick={onSignUpBtnClickHandler}>{"로그인"}</div>
    }
    // component : 업로드 버튼 컴포넌트
    const UploadBtn = () => {
        // state : 게시물 상태  // 커스텀 훅
        const {title, content, boardImgFileList, resetBoard} = useBoardStore();
        // state : 업로드 버튼 이름 상태 (업로드 | 수정하기)
        const [submitBtnName, setSubmitBtnName] = useState<"업로드" | "수정하기">("업로드");

        // function : 게시글 수정 후 결고 처리 함수.
        const patchBoardResponse = (responseBody : PostBoardResponseDto | ResponseDto | null) =>{
            if (!responseBody) return;
            const {code} = responseBody;
            const noAuth = (code === ResponseCode.AUTHENTICATION_FAILED || code === ResponseCode.NOT_EXIST_BOARD ||
                code === ResponseCode.NOT_EXIST_USER || code === ResponseCode.NO_PERMISSION);
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
            if (noAuth) navigator(AUTH_PATH());
            if (code === ResponseCode.VALIDATION_FAILED) alert("제목과 내용은 필수입니다.");
            if (code !== ResponseCode.SUCCESS) return;


            if (!boardNum) return;
            navigator(BOARD_PATH()+ "/"+ BOARD_DETAIL_PATH(boardNum));
        }

        // function : 게시글 작성 후 결과 처리 함수.
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;

            if (code === ResponseCode.AUTHENTICATION_FAILED || code === ResponseCode.NOT_EXIST_USER) {
                alert("로그인이 필요합니다.")
                navigator(AUTH_PATH())
            }
            if (code === ResponseCode.DATABASE_ERROR) alert("서버오류입니다.")
            if (code === ResponseCode.VALIDATION_FAILED) alert("제목과 내용은 필수 입니다");
            if (code === ResponseCode.SUCCESS) return;

            resetBoard();

            if (!loginUser) return;
            const {userEmail} = loginUser;
            navigator(USER_PATH(userEmail));

        }
        //eventHandler : 업로드 버튼 클릭 이벤트 헨틀러. async 를 통한 비동기 함수저리.
        const onUploadBtnClickEventHandler = async () => {
            const accessToken = cookies.accessToken;
            if (!accessToken) return;

            const boardImgList: string[] = [];

            for (const file of boardImgFileList) {  // 이 표현은 자바의 개선된 for문과 일치함.
                const data = new FormData();
                data.append("file", file);

                const url = await fileUploadRequest(data);
                if (url) boardImgList.push(url);
            }

            const requestBody: PostBoardRequestDto = {title, content, boardImgList}

            if (isBoardUpdate){
                if (!boardNum) return;
                const requestBody : PatchBoardRequestDto = {title, content, boardImgList};
                patchBoardRequest(boardNum,requestBody, accessToken).then(response => patchBoardResponse(response));
                return
            }
            postBoardRequest(requestBody, accessToken).then(responseBody => postBoardResponse(responseBody));
            // 게시물 보기로 이동 추가예정.
        }

        useEffect(() => {
            if (isBoardUpdate) setSubmitBtnName("수정하기");
        }, [submitBtnName]);



        if (title && content)
            return <div className="black-button" onClick={onUploadBtnClickEventHandler}>{submitBtnName}</div>

        return <div className="disable-button">{submitBtnName}</div>

    }

    // effect : pathname이 변경될 때마다 실행될 함수.
    useEffect(() => {
        const isUser = pathname.startsWith(StartPath.USER_PATH);
        const isAuth = pathname === StartPath.AUTH_PATH;
        const isMain = pathname === StartPath.MAIN;
        const isSearch = pathname.startsWith(StartPath.SEARCH_PATH);
        const isBoardDetail = pathname.startsWith(StartPath.BOARD_DETAIL_PATH);
        const isBoardWrite = pathname === StartPath.BOARD_WRITE_PATH;
        const isBoardUpdate = pathname.startsWith(StartPath.BOARD_UPDATE_PATH);


        setUser(isUser);
        setAuth(isAuth);
        setMain(isMain);
        setSearch(isSearch);
        setBoardDetail(isBoardDetail);
        setBoardWrite(isBoardWrite);
        setBoardUpdate(isBoardUpdate);

    }, [pathname]);

    // effect : 전역상태인 로그인 유저의 값이 변경될때마다 실행될 함수
    useEffect(() => {
        setLogIn(loginUser !== null);
    }, [loginUser]);
    return (
        <div id="header">
            <div className="header-container">
                <div className="header-left-box" onClick={onLogoClickHandler}>
                    <div className="icon-box">
                        <div className="icon logo-dark-icon"></div>
                    </div>
                    <div className="header-logo">{'Bulletin Board'}</div>
                </div>
                <div className="header-right-box">
                    {(isAuth || isMain || isSearch || isBoardDetail) && (<SearchBtn/>)}
                    {(isMain || isSearch || isBoardDetail || isUser) && (<MyPageBtn/>)}
                    {(isBoardWrite || isBoardUpdate) && (<UploadBtn/>)}
                </div>

            </div>
        </div>
    )
}
