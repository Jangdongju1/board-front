import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import './style.css';
import {BoardListItem} from "../../types/interface";
import defaultProfileImage from "../../assets/image/defaultProfileImg.png";
import {useNavigate, useParams} from "react-router-dom";
import LatestBoardListMock from "../../mocks/latest-board-list.mock";
import BoardComponent from "../../components/BoardListItem";
import {BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH} from "../../constant";
import loginUserStore from "../../stores/login-user.store";
import {
    fileUploadRequest,
    getUserBoardRequest,
    getUserRequest,
    patchProfileImageRequest,
    patchUserNicknameRequest
} from "../../apis";
import {
    GetUserResponseDto,
    PatchUserNicknameResponseDto,
    PatchUserProfileImageResponseDto
} from "../../apis/response/user";
import {ResponseDto} from "../../apis/response";
import {ResponseCode} from "../../types/enum";
import {PatchUserNicknameRequestDto, PatchUserProfileImageRequestDto} from "../../apis/request/user";
import {useCookies} from "react-cookie";
import {usePagination} from "../../hooks";
import {GetUserBoardListResponseDto} from "../../apis/response/board";
import Pagination from "../../components/Pagination";


// 유저정보 컴포넌트
export default function UserPage() {
    // state : email path variable
    const {userEmail} = useParams();
    // state : 마이페이지 여부 상태.
    const [isMyPage, setIsMyPage] = useState<boolean>(false);
    // state : 유저의 로그인 상태.
    const {loginUser} = loginUserStore();
    // state : 쿠키상태.
    const [cookies, setCookies] = useCookies();

    // function : 네비게이트 함수.
    const navigator = useNavigate();

    // component : 유저 정보 화면 상단 컴포넌트
    const UserTop = () => {
        // state : 이미지 파일 input 참조 상태.
        const imageRef = useRef<HTMLInputElement | null>(null);
        // state : 닉네임 변경 여부 상태.
        const [isNicknameChange, setisNicknameChange] = useState<boolean>(false);
        // state : 닉네임 상태.
        const [nickname, setNickname] = useState<string>("");
        // state : 변경된 닉네임 상태.
        const [changeNickname, setChangeNickname] = useState<string>("");
        // state : 프로필 이미지 상태.
        const [profileImg, setProfileImg] = useState<string | null>(null);

        // function : 유저 정보 api 호출 결과 처리함수.
        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다.");
            if (code === ResponseCode.NOT_EXIST_USER) alert("존재하지 않는 유저입니다.");
            if (code !== ResponseCode.SUCCESS) {
                navigator(MAIN_PATH());
                return;
            }
            const {nickname, profileImg} = responseBody as GetUserResponseDto;
            setNickname(nickname);
            setProfileImg(profileImg);

            const isSameUser = (loginUser?.userEmail === userEmail);
            if (isSameUser) setIsMyPage(true);
        }
        // function : 프로필 이미지 수정 api호출에 대한 응답처리.
        const patchProfileImageResponse = (responseBody: PatchUserProfileImageResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.AUTHENTICATION_FAILED) alert("잘못된 접근입니다.");
            if (code === ResponseCode.NOT_EXIST_USER) alert("존재하지 않는 유저입니다.");
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            if (!userEmail) return;
            getUserRequest(userEmail).then(response => getUserResponse(response));

        }

        // function : 닉네임 변경 api호출에 대한 응답처리 함수.
        const patchNicknameResponse = (responseBody: PatchUserNicknameResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.VALIDATION_FAILED) alert("닉네임은 필수입니다.");
            if (code === ResponseCode.DUPLICATE_NICKNAME) alert("닉네임이 중복됩니다.");
            if (code === ResponseCode.NOT_EXIST_USER) alert("존재하지 않는 유저입니다.");
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다");
            if (code === ResponseCode.AUTHENTICATION_FAILED) alert("잘못된 접근입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            if (!userEmail) return;
            getUserRequest(userEmail).then(response => getUserResponse(response));

        }
        // function : 파일 업로드에 대한 응답처리 함수.
        const fileUploadResponse = (profileImg: string | null) => {
            if (!profileImg) return;
            if (!cookies.accessToken) return;
            // 객체화(단축 속성명) 타입에 정의된 속성명과 변수명이 일치할때 key값을 생략 가능함.
            const requestBody: PatchUserProfileImageRequestDto = {profileImg};
            patchProfileImageRequest(requestBody, cookies.accessToken)
                .then(response => patchProfileImageResponse(response));
        }

        // eventHandler : 닉네임 수정 버튼 클릭 이벤트 헨들러.
        const onNicknameEditBtnClickEventHandler = () => {
            if (!isNicknameChange) {
                setChangeNickname(nickname);
                setisNicknameChange(!isNicknameChange);
                return;
            }

            if (!cookies.accessToken) return;

            const requestBody: PatchUserNicknameRequestDto = {nickname: changeNickname};
            patchUserNicknameRequest(requestBody, cookies.accessToken)
                .then(response => patchNicknameResponse(response));
            setisNicknameChange(false);

        }
        // eventHandler : 프로필 박스 클릭 이벤트 헨들러
        const onProfileBoxClickEventHanler = () => {
            const imageInput = imageRef.current;
            if (!imageInput) return;
            imageInput.click();
        }

        // eventHandler : Input Element Change 이벤트 처리 헨들러
        const onProfileImageChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || !e.target.files.length) return
            const file = e.target.files[0];
            const data = new FormData(); // input 객체에 존재하는 파일 리스트.
            data.append("file", file);

            fileUploadRequest(data).then(response => fileUploadResponse(response));
        }

        // eventHandler  : 닉네임 Input 변경 처리 헨들러.
        const onNicknameInputChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setChangeNickname(value);
        }
        // effect : email path variable 상태 변경시 실행할 함수.
        useEffect(() => {
            if (!userEmail) return;
            getUserRequest(userEmail).then(response => getUserResponse(response));
        }, [userEmail]);

        return (
            <div id="user-top-wrapper">
                <div className="user-top-container">
                    {isMyPage ?
                        <div className="user-top-my-profile-image-box" onClick={onProfileBoxClickEventHanler}>
                            {profileImg !== null ?
                                <div className="user-top-my-profile-image"
                                     style={{backgroundImage: `url(${profileImg})`}}></div> :

                                <div className="icon-box-large">
                                    <div className="icon image-box-white-icon"></div>
                                </div>

                            }
                            <input ref={imageRef} type="file" accept="image/*" style={{display: `none`}}
                                   onChange={onProfileImageChangeEventHandler}/>
                        </div> :
                        <div className="user-top-profile-image-box"
                             style={{backgroundImage: profileImg !== null ? `url(${profileImg})` : `url(${defaultProfileImage})`}}></div>
                    }

                    <div className="user-top-info-box">
                        <div className="user-top-info-nickname-box">
                            {isMyPage ?
                                <>
                                    {isNicknameChange ?
                                        <input className="user-top-info-nickname-input" type="text"
                                               size={changeNickname.length + 1} value={changeNickname}
                                               onChange={onNicknameInputChangeEventHandler}/> :
                                        <div className="user-top-my-info-nickname">{nickname}</div>
                                    }

                                    <div className="icon-button" onClick={onNicknameEditBtnClickEventHandler}>
                                        <div className="icon edit-icon"></div>
                                    </div>
                                </> :
                                <div className="user-top-info-nickname">{nickname}</div>
                            }

                        </div>
                        <div className="user-top-info-email">{"jdj881204@naver.com"}</div>
                    </div>
                </div>
            </div>
        )
    }

    // component : 유저 정보 화면 상단 컴포넌트
    const UserBottom = () => {
        // state : 개시물 갯수 상태.
        const [count, setCount] = useState<number>(1);
        // state : 페이지네이션 상태(커스텀 훅)
        const {
            currentPage,
            currentSection,
            setCurrentPage,
            setCurrentSection,
            totalSection,
            viewPageList,
            viewList,
            setTotalList
        } = usePagination<BoardListItem>(5);


        // function : 특정 유저의 게시물 불러오기 api호출 응답처리 함수.
        const getUserBoardListResponse = (responseBody : GetUserBoardListResponseDto | ResponseDto | null)=>{
            if (!responseBody) return;
            const {code} = responseBody;

            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다.");
            if (code === ResponseCode.NOT_EXIST_USER) {
                alert("존재하지 않는 유저입니다.");
                navigator(MAIN_PATH());
                return;
            }
            if (code !== ResponseCode.SUCCESS) return;

            const {userBoardList} = responseBody as GetUserBoardListResponseDto;
            setTotalList(userBoardList);
            setCount(userBoardList.length);
        }

        // eventHandler : side card 클릭 이벤트 헨들러
        const onSideCardClickEventHandler = () => {
            if (isMyPage) navigator(BOARD_PATH() + "/" + BOARD_WRITE_PATH());
            else if (loginUser) navigator(USER_PATH(loginUser.userEmail))
        };

        // effect : userEmail Path Variable변경시 마다 실행할 함수.
        useEffect(() => {
            if (!userEmail) return;
            getUserBoardRequest(userEmail).then(respsone => getUserBoardListResponse(respsone))

        }, [userEmail]);

        return (
            <div id="user-bottom-wrapper">
                <div className="user-bottom-container">
                    <div className="user-bottom-title-box">{isMyPage ? "나의 게시물 " : "게시물"} <span
                        className="emphasis">{count}</span></div>
                    <div className="user-bottom-contents-box">
                        {count === 0 ?
                            <div className="user-bottom-contents-nothing">{"게시물이 없습니다."}</div> :
                            <div className="user-bottom-contents">
                                {viewList.map((boardListItem, index) => <BoardComponent key={index}
                                                                                             boardListItem={boardListItem}/>)}
                            </div>
                        }
                        <div className="user-bottom-side-box">
                            <div className="user-bottom-side-card" onClick={onSideCardClickEventHandler}>
                                <div className="user-bottom-side-container">
                                    {isMyPage ?
                                        <>
                                            <div className="icon-box">
                                                <div className="icon edit-icon"></div>
                                            </div>
                                            <div className="user-bottom-side-text">{"글쓰기"}</div>
                                        </> :
                                        <>
                                            <div className="user-bottom-side-text">{"나의 게시물로 가기"}</div>
                                            <div className="icon-box">
                                                <div className="icon arrow-right-icon"></div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="user-bottom-pagination-box">
                        <Pagination currentPage={currentPage}
                                    currentSection={currentSection}
                                    setCurrentPage={setCurrentPage}
                                    setCurrentSection={setCurrentSection}
                                    viewPageList={viewPageList}
                                    totalSection={totalSection}/>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <UserTop/>
            <UserBottom/>
        </div>
    )
}