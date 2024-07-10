import React from "react";
import "./style.css";
import {FavoriteListItem} from "../../types/interface";
import defaultProfileImg from  "../../assets/image/defaultProfileImg.png"

interface FavoriteProps{
    favoriteList : FavoriteListItem;
}

export default function FavoriteComponent ({favoriteList}: FavoriteProps){
    const {nickname, profileImg} = favoriteList;
    return (
        <div className="favorite-list-item">
            <div className="favorite-list-item-profile-box">
                <div className="favorite-list-item-profile-image" style={{backgroundImage : `url(${profileImg ? profileImg : defaultProfileImg})`}}></div>
            </div>
            <div className="favorite-list-item-nickname">{nickname}</div>
        </div>
    )

}