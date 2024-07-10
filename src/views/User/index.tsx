import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import './style.css';
import {User} from "../../types/interface";
import defaultProfileImage from "../../assets/image/defaultProfileImg.png";
import {useParams} from "react-router-dom";


// 유저정보 컴포넌트
export default function UserPage() {
    // state : email path variable
    const {userEmail} = useParams();

    // component : 유저 정보 화면 상단 컴포넌트
    const UserTop = () => {
        // state : 이미지 파일 input 참조 상태.
        const imageRef = useRef<HTMLInputElement | null>(null);
        // state : 마이페이지 여부 상태.
        const [isMyPage, setIsMyPage] = useState<boolean>(true);
        // state : 닉네임 변경 여부 상태.
        const [isNicknameChange, setisNicknameChange] = useState<boolean>(false);
        // state : 닉네임 상태.
        const [nickname, setNickname] = useState<string>("");
        // state : 변경된 닉네임 상태.
        const [changeNickname, setChangeNickname] = useState<string>("");
        // state : 프로필 이미지 상태.
        const [profileImg, setProfileImg] = useState<string | null>(null);

        // eventHandler : 닉네임 수정 버튼 클릭 이벤트 헨들러.
        const onNicknameEditBtnClickEventHandler = () => {
            setChangeNickname(nickname);
            setisNicknameChange(!isNicknameChange);
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
            const data = new FormData();
            data.append("file", file);
        }

        // eventHandler  : 닉네임 변겨 이벤트 헨들러
        const onNicknameInputChangeEventHandler  = (e:ChangeEvent<HTMLInputElement>)=>{
            const {value} = e.target;
            setChangeNickname(value);
        }
        // effect : email path variable 상태 변경시 실행할 함수.
        useEffect(() => {
            // 테스트용 데이터 세팅
            setNickname("타노스");
            setProfileImg("https://img.khan.co.kr/news/2023/05/12/news-p.v1.20230512.e5fffd99806f4dcabd8426d52788f51a_P1.webp");
        }, []);

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
                                               size={changeNickname.length + 1} value={changeNickname} onChange={onNicknameInputChangeEventHandler}/> :
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
        return (
            <div>
                {"하단컴포넌트"}
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