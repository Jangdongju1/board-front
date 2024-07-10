import React from "react";
import './style.css';
import {BoardListItem} from "../../types/interface";
import defaultProfileImg from "../../assets/image/defaultProfileImg.png";
import {useNavigate} from "react-router-dom";
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../../constant";


// 보통 Props라는 명칭으로 전달할 타입들을 정의하는데 자세히보면 이 값들은 모두 태그의 properties(속성들)로 들어간다.
interface Props{
    boardListItem : BoardListItem;
}

export default function BoardComponent({boardListItem}: Props){
    // Board List Item >> 각각의 게시글을 나타내는 커다란 틀.
    // 자바스크립트 문법인 비구조화 할당 >> 객체를 분해해서 선언된 변수에 할당한다. 반드시 전달되는 객체의 컬럼명과 일치 하여야만 할당이 가능하다.

    const {boardNum, title, content, boardTitleImg} = boardListItem;
    const {favoriteCnt, commentCnt, viewCnt} = boardListItem;
    const {writeDate, nickname, writeProfileImg} = boardListItem;
    // navigate 함수

    const navigator = useNavigate();

    // event함수
    const onClickHandler = () =>{
        //클릭하면 백엔드에 요청을 보내야지....
      // navigator(BOARD_PATH() + "/"+ BOARD_DETAIL_PATH(boardNum));
    }
    return(
        <div className="board-list-item" onClick={onClickHandler}>
            <div className="board-list-item-main-box">
                <div className="board-list-item-top">
                    <div className="board-list-item-profile-box">
                        <div className="board-list-item-profile-image" style={{backgroundImage: `url(${writeProfileImg ? writeProfileImg : defaultProfileImg})`}}></div>
                    </div>
                    <div className="board-list-item-write-box">
                        <div className="board-list-item-nickname">{nickname}</div>
                        <div className="board-list-item-write-datetime">{writeDate}</div>
                    </div>
                </div>
                <div className="board-list-item-middle">
                    <div className="board-list-item-title">{title}</div>
                    <div className="board-list-item-content">{content}</div>
                </div>
                <div className="board-list-item-bottom">
                    <div className="board-list-item-counts">{`댓글 ${commentCnt} 좋아요 ${favoriteCnt} 조회수 ${viewCnt}`}</div>
                </div>
            </div>
            {
                // 조건부 렌더링
                // JSX문법에서는 if문의 사용이 불가함.
                // 따라서 삼항 연산자 또는 논리 조건 연산자 && , ||를 통해 조건부 렌더링을 구현할 수 있다.
                // ex {condition && <Component />}, {condition || <Component />}

                boardTitleImg != null && (
                    <div className="board-list-item-image-box">
                        <div className="board-list-item-image" style={{backgroundImage: `url(${boardTitleImg})`}}></div>
                    </div>
                )
            }


        </div>
    )
}