import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import './style.css';
import {useBoardStore} from "../../../stores";
import {useNavigate, useParams} from "react-router-dom";
import loginUserStore from "../../../stores/login-user.store";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../../constant";
import {getBoardRequest} from "../../../apis";
import {GetBoardResponseDto} from "../../../apis/response/board";
import {ResponseDto} from "../../../apis/response";
import {ResponseCode} from "../../../types/enum";
import {convertUrlsToFile} from "../../../utills";
// 게시물 작성 컴포넌트
export default function BoardUpdate() {
    // state : 유저의 로그인 상태 (전역상태)
    const {loginUser} = loginUserStore();
    // state : 게시물 번호 pathVariable
    const {boardNum} = useParams();
    // state ; 제목 영역 요소 참조 상태.
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    // state : 본문 영역 요소 참조 상태.
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    // state : 이미지 입력 요소 참조 상태.
    const imageRef = useRef<HTMLInputElement | null>(null);
    // state : 제목, 내용, 업로드 파일에 대한 전역상태.
    const {title, setTitle} = useBoardStore();
    const {content, setContent} = useBoardStore();
    const {boardImgFileList, setBoardImgFileList} = useBoardStore();
    const {resetBoard} = useBoardStore();
    // state : 게시물 이미지 미리보기 url상태.
    const [imageUrls, setImageUrls] = useState<String[]>([]);
    const [cookies, setCookies] = useCookies();

    // function : navigate 함수.
    const navigator = useNavigate();
    // function : 게시물 데이터 요청에 대한 응답 처리함수.
    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody as ResponseDto;
        if (code === ResponseCode.NOT_EXIST_BOARD) alert("존재하지 않는 게시물입니다.");
        if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
        if (code !== ResponseCode.SUCCESS) {
            navigator(MAIN_PATH());
            return;
        }
        const {title, content, boardImgList, writerEmail} = responseBody as GetBoardResponseDto;

        if (!loginUser) {
            navigator(MAIN_PATH());
            return;
        }
        setTitle(title);
        setContent(content);
        setImageUrls(boardImgList);
        convertUrlsToFile(boardImgList).then(fileList => setBoardImgFileList(fileList));
    }

    // eventHandler : 게시물 제목 입력 핸들러
    const onTitleChangeEventHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = e.target;
        const titleEle = titleRef.current;
        setTitle(value);

        if (!titleEle) return;
        titleEle.style.height = `auto`;
        titleEle.style.height = `${titleEle.scrollHeight}px`;
    }

    // eventHandler : 게시물 내용 입력 이벤트 핸들러.
    const onContentChangeEventHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = e.target;
        const contentEle = contentRef.current;
        setContent(value);

        // 내용입력시 자동으로 나오던 스크롤을 없앰.
        if (!contentEle) return;
        contentEle.style.height = `auto`;
        contentEle.style.height = `${contentEle.scrollHeight}px`;
    }
    // eventHandler : 이미지 입력 버튼 클릭처리 이벤트
    const onImageBtnClickEventHandler = () => {
        const imageEle = imageRef.current;
        if (!imageEle) return;
        imageEle.click();
    }
    // eventHandler : 업로드 이미지 변경이벤트 처리.
    const onImageChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) return;
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);  // 이미지 Url을 추출.
        const newImageUrls = imageUrls.map(item => item);// 배열의 깊은 복사.

        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        // 백엔드에 보낼 전역파일 데이터 데이터 세팅
        const newBoardImageFileList = boardImgFileList.map(item => item);
        newBoardImageFileList.push(file);
        setBoardImgFileList(newBoardImageFileList);

        // 중복된 사진이 업로드가 가능하도록 값을 초기화.
        const imageEle = imageRef.current;
        if (!imageEle) return;
        imageEle.value = '';
    }
    // eventHandler : 이미지 닫기 버튼 클릭 헨들러.
    const onCloseBtnClickEventHandler = (deleteIndex: number) => {
        const imageEle = imageRef.current;
        if (!imageEle) return;
        imageEle.value = '';

        // filter함수는 조건에 맞는 새로운 배열을 반환해주는 함수이다.
        // 닫기버튼이 클릭된  이미지url을 배열에서 제거하기 위하여 사용하였다.
        const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex)
        setImageUrls(newImageUrls);

        // 백엔드로 보낼 파일데이터 또한 똑같이 적용해주어야함.
        const newBoardImageFileList = boardImgFileList.filter((file, index) => index !== deleteIndex);
        setBoardImgFileList(newBoardImageFileList);

    }


    // effect : 마운트시 실행할 함수.
    useEffect(() => {
        const accessToken = cookies.accessToken
        if (!accessToken) {
            alert("로그인 후 이용 가능합니다.")
            navigator(MAIN_PATH());
        }
        if (!boardNum) return;
        getBoardRequest(boardNum).then(response => getBoardResponse(response));


    }, [boardNum]);

    return (
        <div id="board-update-wrapper">
            <div className="board-update-container">
                <div className="board-update-box">
                    <div className="board-update-title-box">
                        <textarea ref={titleRef} className="board-update-title-textarea" rows={1}
                                  placeholder={"제목을 작성해주세요."} value={title} onChange={onTitleChangeEventHandler}/>
                    </div>
                    <div className="divider"></div>
                    <div className="board-update-content-box">
                        <textarea ref={contentRef} className="board-update-content-textarea" placeholder={"본문을 작성해주세요."}
                                  value={content} onChange={onContentChangeEventHandler}/>
                        <div className="icon-button" onClick={onImageBtnClickEventHandler}>
                            <div className="icon upload-icon"></div>
                        </div>
                        <input ref={imageRef} type={"file"} accept={"image/*"} style={{display: "none"}}
                               onChange={onImageChangeEventHandler}/>
                    </div>
                    <div className="board-update-iamges-box">
                        {imageUrls.map((imageUrl, index) => (
                            // map 함수의 첫번재 매개변수는 배열의 요소이고 두번째 매개변수는 배열의 인덱스임.
                            // Warning: Each child in a list should have a unique "key" prop 에러는 map을 사용한 반복 엘리먼트 출력시 발생하는 에러로.
                            // 배열의 길이만큼 출력되는 형제 노드 간에 고유한 key값이 존재하여야 함을 의미한다. 따라서 아래처럼 출력되는 요소에 key 속성으로 배열의 인덱스를 전달하였다.
                            <div key={index} className="board-update-image-box">
                                <img className="board-update-image"
                                     src={`${imageUrl}`}/>
                                <div className="icon-button image-close"
                                     onClick={() => onCloseBtnClickEventHandler(index)}>
                                    <div className="icon icon-close"></div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}