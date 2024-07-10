import React from "react";
import './style.css';
import {CommentListItem} from "../../types/interface";
import defaultProfileImg from "../../assets/image/defaultProfileImg.png"
import dayjs from "dayjs";

interface CommentProps {
    commentListItem: CommentListItem;
}

export default function CommentComponent({commentListItem}: CommentProps) {
    const {nickname, profileImg, writeDate, content} = commentListItem;

    // function : 작성일 경과시간 반환함수.
    const ElapsedTime = () => {
        const now = dayjs().add(9, "hour");
        const writeTime = dayjs(writeDate)
        const gap = now.diff(writeTime,"s");

        if (gap < 60) return `${gap}초 전`;
        if (gap < 3600) return `${Math.floor(gap/60)}분 전`;
        if (gap < 86400) return `${Math.floor(gap/3600)}시간 전`;

        return `${Math.floor(gap/86400)}일 전`;
    }

    return (
        <div className="comment-list-item">
            <div className="comment-list-item-top">
                <div className="comment-list-item-profile-box">
                    <div className="comment-list-item-profile-image"
                         style={{backgroundImage: `url(${profileImg ? profileImg : defaultProfileImg})`}}></div>
                </div>
                <div className="comment-list-item-nickname">{nickname}</div>
                <div className="comment-list-item-divider">{'\|'}</div>
                <div className="comment-list-item-time">{ElapsedTime()}</div>
            </div>
            <div className="comment-list-item-main">
                <div className="comment-list-item-content">{content}</div>
            </div>
        </div>
    )
}