import React from "react";
import './style.css'

// eventhandler : 인스타 아이콘 버튼 클릭 이벤트 처리
const onIstaIconButtonClickHandler = () => {
    window.open("https://www.instagram.com");
}

const onNaverBlogIconButtonClickHandler = () => {
    window.open("https://blog.naver.com");
}
// eventhandler : 네이버 블로그 아이콘 버튼 클릭 이벤트 처리
export default function Footer() {
    return (
        <div id="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo-box">
                        <div className="icon-box">
                            <div className="icon logo-board-icon"></div>
                        </div>
                        <div className="footer-logo-text">JBoard</div>
                    </div>
                    <div className="footer-link-box">
                        <div className="footer-email-link">jdj881204@google.com</div>
                        <div className="icon-button" onClick={onIstaIconButtonClickHandler}>
                            <div className="icon insta-icon"></div>
                        </div>
                        <div className="icon-button" onClick={onNaverBlogIconButtonClickHandler}>
                            <div className="icon naver-blog-icon"></div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-copyright">{'Copyright @ 2024 KWS-UDU All Rights Reserved.'}</div>
                </div>
            </div>
        </div>
    )
}




