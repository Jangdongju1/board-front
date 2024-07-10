import React from "react";
import './style.css';
import defaultProfileImg from '../../assets/image/defaultProfileImg.png'
import {BoardListItem} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../../constant";

interface Props {
    top3ListItem: BoardListItem;
}

export default function Top3Component({top3ListItem}: Props) {
    const {boardNum, title, content, boardTitleImg} = top3ListItem;
    const {favoriteCnt, commentCnt, viewCnt} = top3ListItem;
    const {writeDate, nickname, writeProfileImg} = top3ListItem;

    const navigator = useNavigate();

    const onClickHandler = () => {
        // 역시 클릭하면 백엔드에 요청을 보내야 정상이지..
        //navigator(BOARD_PATH() + "/" + BOARD_DETAIL_PATH(boardNum));
    }

    return (
        <div className="top-3-list-item" style={{backgroundImage: `url(${boardTitleImg})`}} onClick={onClickHandler}>
            <div className="top-3-list-item-main-box">
                <div className="top-3-list-item-top">
                    <div className="top-3-list-item-profile-box">
                        <div
                            className="top-3-list-item-profile-image" style={{backgroundImage : `url(${writeProfileImg ? writeProfileImg : defaultProfileImg})`}}></div>
                    </div>
                    <div className="top-3-list-item-write-box">
                        <div className="top-3-list-item-nickname">{nickname}</div>
                        <div className="top-3-list-item-write-date">{writeDate}</div>
                    </div>
                </div>
                <div className="top-3-list-item-middle">
                    <div className="top-3-list-item-title">{title}</div>
                    <div className="top-3-list-item-content">{content}</div>
                </div>
                <div className="top-3-list-item-bottom">
                    <div className="top-3-list-item-counts">
                        {`댓글 ${commentCnt}  좋아요 ${favoriteCnt}  조회수 ${viewCnt}`}
                    </div>
                </div>
            </div>

        </div>


    )
}