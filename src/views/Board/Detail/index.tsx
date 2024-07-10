import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import './style.css';
import FavoriteComponent from "../../../components/FavoriteItem";
import {Board, CommentListItem, FavoriteListItem} from "../../../types/interface";
import CommentComponent from "../../../components/CommentListItem";
import defaultProfileImg from "../../../assets/image/defaultProfileImg.png";
import useLoginUserStore from "../../../stores/login-user.store";
import {useNavigate, useParams} from "react-router-dom";
import {AUTH_PATH, BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH} from "../../../constant";
import {
    deleteBoardRequest,
    getBoardRequest,
    getCommentListRequest,
    getFavoriteListRequest,
    increaseViewCountRequest,
    postCommentRequest,
    putFavoriteRequest
} from "../../../apis";
import {
    DeleteBoardResponseDto,
    FavoriteResponseDto,
    GetBoardFavoriteListResponseDto,
    GetBoardResponseDto,
    IncreaseViewCountResponseDto
} from "../../../apis/response/board";
import {ResponseDto} from "../../../apis/response";
import {ResponseCode} from "../../../types/enum";
import dayjs from "dayjs";
import {PostCommentRequestDto} from "../../../apis/request/board";
import {useCookies} from "react-cookie";
import GetBoardCommentListResponseDto from "../../../apis/response/board/get-board-comment-list.response.dto";
import PostBoardCommentResponseDto from "../../../apis/response/board/post-board-comment.response.dto";
import Pagination from "../../../components/Pagination";
import {usePagination} from "../../../hooks";


// 게시물 상세화면 컴포넌트
export default function BoardDetail() {
    // state : 게시물 번호의 상태(path variable).
    const {boardNum} = useParams();
    // state : 유저의 로그인 상태(전역상태)
    const {loginUser} = useLoginUserStore();
    // function : 네비게이터 함수
    const navigator = useNavigate();
    // state : 쿠키 상태.
    const [cookies, setCookies] = useCookies();

    // function : increaseViewCountResponse 처리
    const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody as IncreaseViewCountResponseDto;
        if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
        if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    };

    // component : detail 페이지 상단 컴포넌트
    const BoardDetailTop = () => {
        //state : more버튼 상태
        const [showMore, setShowMore] = useState<boolean>(false);
        // state : 게시물 상세 페지이 게시글 정보 상태.
        const [board, setBoard] = useState<Board | null>(null);
        // state : 작성자 상태
        const [isWriter, setWriter] = useState<boolean>(false);


        // function : 삭제 api 에 대하 결과 처리함수.
        const deleteBoardResponse = (responseBody: DeleteBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.VALIDATION_FAILED) alert("잘못된 접근입니다.");
            if (code === ResponseCode.NOT_EXIST_USER) alert("존재하지 않는 유저입니다.");
            if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
            if (code === ResponseCode.AUTHENTICATION_FAILED) alert("인증에 실패하였습니다.");
            if (code === ResponseCode.NO_PERMISSION) alert("권한이 없습니다.");
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            navigator(MAIN_PATH());

        }
        // function : 날짜 포멧 처리함수.
        const getFormattedDate = () => {
            if (!board) return;
            return dayjs(board.writeDate).format("YYYY. MM. DD.");
        }
        // function : getBoardRequest 처리
        const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody as ResponseDto;
            if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
            if (code !== ResponseCode.SUCCESS) {
                navigator(MAIN_PATH());
                return;
            }
            const board: Board = {...responseBody as GetBoardResponseDto};
            setBoard(board);
            // 로그인 여부 확인.
            if (!loginUser) {
                setWriter(false);
                return;
            }
            const isWriter = loginUser.userEmail === board.writerEmail;
            setWriter(isWriter);
        }

        //eventHandler : more 버튼 클릭 이벤트 헨들러
        const onMoreBtnClickEventHandler = () => {
            setShowMore(!showMore);// 현재 상태의 반대로.
        }
        // eventHandler : 닉네임 버튼 클릭 이벤트 헨들러.
        const onNicknameBtnClickEventHandler = () => {
            if (!board) return;
            navigator(USER_PATH(board.writerEmail));
        }
        // eventHandler : 수정버튼 클릭 이벤트 헨들러
        const onUpdateBtnClickEventHandler = () => {
            if (!board || !loginUser) return;
            if (loginUser.userEmail !== board.writerEmail) return;
            navigator(BOARD_PATH() + "/" + BOARD_UPDATE_PATH(board.boardNum));
        }
        // eventHandler : 삭제버튼 클릭 헨들러
        const onDeleteBtnClickEventHandler = () => {
            const accessToken = cookies.accessToken;

            if (!board || !loginUser || !accessToken) return;
            if (loginUser.userEmail !== board.writerEmail) return;

            if (boardNum === undefined) return;
            if (!boardNum) return;
            deleteBoardRequest(boardNum, accessToken).then(response => deleteBoardResponse(response));
        }
        // effect : path variable이  바뀔대마다 컴포넌트 재 랜더링. path variable == boardNum
        useEffect(() => {
            if (!boardNum) {
                navigator(MAIN_PATH());
                return;
            }
            getBoardRequest(boardNum).then(response => getBoardResponse(response));
        }, [boardNum]);

        if (!board) return <></>; //상세 데이터가 존재하지 않는경우.
        return (
            <div className="board-detail-top">
                <div className="board-detail-top-header">
                    <div className="board-detail-title">{board.title}</div>
                    <div className="board-detail-top-sub-box">
                        <div className="board-detail-writer-info-box">
                            <div className="board-detail-writer-profile-image"
                                 style={{backgroundImage: `url(${board.writerProfileImg ? board.writerProfileImg : defaultProfileImg})`}}></div>
                            <div className="board-detail-writer-nickname"
                                 onClick={onNicknameBtnClickEventHandler}>{board.writerNickname}</div>
                            <div className="board-detail-info-divider">{"|"}</div>
                            <div className="board-detail-write-date">{getFormattedDate()}</div>
                        </div>
                        {(loginUser?.userEmail === board.writerEmail) && (
                            <div className="icon-button" onClick={onMoreBtnClickEventHandler}>
                                <div className="icon more-icon"></div>
                            </div>)}
                        {showMore && (
                            <div className="board-detail-more-box">
                                <div className="board-detail-update-button"
                                     onClick={onUpdateBtnClickEventHandler}>{"수정"}</div>
                                <div className="divider"></div>
                                <div className="board-detail-delete-button"
                                     onClick={onDeleteBtnClickEventHandler}>{"삭제"}</div>
                            </div>
                        )}

                    </div>
                </div>
                <div className="divider"></div>
                <div className="board-detail-top-main">
                    <div className="board-detail-main-text">{board.content}</div>
                    {board.boardImgList.map((image, index) => {
                        return <img src={image} key={index}/>;
                    })}
                </div>
            </div>
        )
    }

    // component : detail 페이지 하단 컴포넌트
    const BoardDetailBottom = () => {
        // state : pagination 관련 상태.
        const {
            currentPage,
            currentSection,
            setCurrentPage,
            setCurrentSection,
            viewList,
            viewPageList,
            totalSection,
            setTotalList
        } = usePagination<CommentListItem>(3);
        // state : 좋아요 리스트 상태.
        const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
        // state : 댓글 리스트 상태.
        //const [commentList, setCommentList] = useState<CommentListItem[]>([]);
        // state : 좋아요 상태.
        const [isFavorite, setFavorite] = useState<boolean>(false);
        // state : 좋아요 view 상태.
        const [showFavorite, setShowFavorite] = useState<boolean>(false);
        // state : 댓글 view 상태.
        const [showComment, setShowComment] = useState<boolean>(false);
        // state : 댓글 전체 리스트 갯수 상태.
        const [totalCommentListCnt,setTotalCommentListCnt] = useState<number>(0);
        // state : 댓글 상태.
        const [comment, setComment] = useState<string>("");
        // state : 댓글 입력창 참조상태
        const commentRef = useRef<HTMLTextAreaElement | null>(null);


        // function : 좋아요 리스트 요청에 대한 응답처리 함수
        const getFavoriteListResponse = (responseBody: GetBoardCommentListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다.");
            if (code !== ResponseCode.SUCCESS) {
                navigator(BOARD_PATH());
                return;
            }
            const ResponseBody: GetBoardFavoriteListResponseDto = {...responseBody as GetBoardFavoriteListResponseDto};
            const {favoriteList} = ResponseBody;

            setFavoriteList(favoriteList);

            if (!loginUser) {
                setFavorite(false);
                return;
            }

            favoriteList.find(list => {
                const {userEmail} = list;
                if (userEmail === loginUser?.userEmail) {
                    setFavorite(true);
                }
            })
        }
        // function : 좋아요 요청에 대한 응답 처리함수.
        const getFavoriteResponse = (responseBody: FavoriteResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.VALIDATION_FAILED) alert("잘못된 접근입니다.");
            if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
            if (code === ResponseCode.NOT_EXIST_USER) alert("존재하지 않는 사용자입니다.");
            if (code === ResponseCode.AUTHENTICATION_FAILED) alert("인증에 실패하였습니다.")
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다.");

            if (boardNum === undefined) return;
            if (!boardNum) return;
            getFavoriteListRequest(boardNum).then(response => getFavoriteListResponse(response));
            // if (code !== ResponseCode.SUCCESS) {
            //     navigator(BOARD_PATH());
            //     return;
            // }

        }
        // function : 댓글 작성 응답 처리함수
        const postCommentResponse = (responseBody: PostBoardCommentResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.VALIDATION_FAILED) alert("잘못된 접근입니다.");
            if (code === ResponseCode.NOT_EXIST_USER) alert("존재하지 않는 유저입니다.");
            if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
            if (code === ResponseCode.AUTHENTICATION_FAILED) alert("인증에 실패하였습니다.");
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            if (!boardNum) return;
            getCommentListRequest(boardNum).then(response => getCommentListResponse(response));
            setComment("");
        }
        // function : 댓글 리스트 요청에 대한 응답처리 함수.
        const getCommentListResponse = (response: GetBoardCommentListResponseDto | ResponseDto | null) => {
            if (!response) return;
            const {code} = response;
            if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시글입니다.");
            if (code !== ResponseCode.SUCCESS) {
                navigator(BOARD_PATH());
                return
            }
            const responseBody: GetBoardCommentListResponseDto = {...response as GetBoardCommentListResponseDto}
            const {commentList} = responseBody;

            //setCommentList(commentList);
            setTotalList(commentList);
            setTotalCommentListCnt(commentList.length);
        }

        // eventHandler : 좋아요 버튼 클릭 이벤트 헨들러
        const onFavoriteClickEventHandler = () => {
            setFavorite(!isFavorite);
            const accessToken = cookies.accessToken;
            if (boardNum === undefined) return;
            if (!loginUser || !accessToken) {
                navigator(AUTH_PATH());
            }
            putFavoriteRequest(boardNum, accessToken).then(response => getFavoriteResponse(response));

        }
        // eventHandler : 좋아요 상자 보기 버튼 클릭 이벤트 헨들러
        const onFavoriteViewBtnClickEventHandler = () => {
            setShowFavorite(!showFavorite);
        }
        // eventHandler : 댓글 상자 보기 버튼 클릭 이벤트 헨들러
        const onCommentViewBtnClickEventHandler = () => {
            setShowComment(!showComment);
        }
        // eventHandler : 댓글 입력창 입력상태.
        const onCommentInputChangeEventHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const {value} = e.target;
            setComment(value);

            // 입력된 글자의 변화에 맞추춰서 textarea의 크기를 조정.
            const commentInputEle = commentRef.current
            if (!commentInputEle) return;
            commentInputEle.style.height = "auto";
            commentInputEle.style.height = `${commentInputEle.scrollHeight}px`;
        }
        // eventHandler : 댓글 작성 버튼 클릭 이벤트 헨들러
        const onCommentSubmitBtnClickEventHandler = () => {
            const accessToken = cookies.accessToken;
            if (!comment) return;
            if (boardNum === undefined) return;
            if (!loginUser || !accessToken || !boardNum) {
                alert("로그인 후 이용해 주세요.");
                navigator(AUTH_PATH());
                return;
            }
            const requestBody: PostCommentRequestDto = {comment: comment};
            postCommentRequest(boardNum, accessToken, requestBody).then(response => postCommentResponse(response));

        }
        // effect  : 게시물번호 (path variable) 변경시마다 좋아요 및 댓글리스트 불러오기.
        useEffect(() => {
            if (!boardNum) {
                navigator(MAIN_PATH());
                return;
            }
            getCommentListRequest(boardNum).then(response => getCommentListResponse(response));
            getFavoriteListRequest(boardNum).then(response => getFavoriteListResponse(response));

        }, [boardNum]);
        return (
            <div id="board-detail-bottom">
                <div className="board-detail-bottom-button-box">
                    <div className="board-detail-bottom-button-group">
                        <div className="icon-button" onClick={onFavoriteClickEventHandler}>
                            <div className={`${isFavorite ? "icon favorite-fill-icon" : "icon favorite-icon"}`}></div>
                        </div>
                        <div className="board-detail-bottom-button-text">{`좋아요 ${favoriteList.length}`}</div>

                        <div className="icon-button" onClick={onFavoriteViewBtnClickEventHandler}>
                            <div className={showFavorite ? "icon up-light-icon" : "icon down-light-icon"}></div>
                        </div>
                    </div>
                    <div className="board-detail-bottom-button-group">
                        <div className="icon-button">
                            <div className="icon comment-icon"></div>
                        </div>
                        <div className="board-detail-bottom-button-text">{`댓글 ${totalCommentListCnt}`}</div>

                        <div className="icon-button" onClick={onCommentViewBtnClickEventHandler}>
                            <div className={showComment ? "icon up-light-icon" : "icon down-light-icon"}></div>
                        </div>
                    </div>
                </div>
                {showFavorite && (
                    <div className="board-detail-bottom-favorite-box">
                        <div className="board-detail-bottom-favorite-container">
                            <div className="board-detail-bottom-favorite-title">{"좋아요"} <span
                                className="emphasis">{favoriteList.length}</span></div>
                            <div className="board-detail-bottom-favorite-contents">
                                {favoriteList.map((item, index) => {
                                    return (
                                        <FavoriteComponent key={index} favoriteList={item}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {showComment && (
                    <div className="board-detail-bottom-comment-box">
                        <div className="board-detail-bottom-comment-container">
                            <div className="board-detail-bottom-comment-title">{"댓글"} <span>{totalCommentListCnt}</span>
                            </div>
                            <div className="board-list-bottom-comment-list-container">
                                {viewList.map((item, index) => {
                                    return (
                                        <CommentComponent key={index} commentListItem={item}/>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="board-detail-bottom-comment-pagination-box">
                            {/*페이지네이션 컴포넌트*/}
                            <Pagination currentPage={currentPage}
                                        currentSection={currentSection}
                                        totalSection={totalSection}
                                        setCurrentPage={setCurrentPage}
                                        setCurrentSection={setCurrentSection}
                                        viewPageList={viewPageList}/>
                        </div>
                        {loginUser && (
                            <div className="board-detail-bottom-input-box">
                                <div className="board-detail-bottom-input-container">
                              <textarea ref={commentRef} className="board-detail-bottom-comment-textarea"
                                        placeholder={"댓글을 작성해 주세요."} value={comment}
                                        onChange={onCommentInputChangeEventHandler}></textarea>

                                    <div className="board-detail-bottom-comment-button-box">
                                        <div className={comment.trim() === "" ? "disable-button" : "black-button"}
                                             onClick={onCommentSubmitBtnClickEventHandler}>{"댓글 달기"}</div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                )}


            </div>
        )
    }
    let effectFlag: boolean = false;
    useEffect(() => {
        if (!boardNum) return;
        if (!effectFlag) {
            effectFlag = true;
            return;
        }
        increaseViewCountRequest(boardNum).then(response => increaseViewCountResponse(response));
    }, [boardNum]);

    return (
        <div id="board-detail-wrapper">
            <div className="board-detail-container">
                <BoardDetailTop/>
                <BoardDetailBottom/>
            </div>
        </div>
    )
}