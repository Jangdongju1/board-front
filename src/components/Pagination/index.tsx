import React, {Dispatch, SetStateAction} from "react";
import "./style.css";

// interface : 페이지네이션 컴포넌트 Properties
interface Props {
    currentPage: number,
    currentSection: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    setCurrentSection: Dispatch<SetStateAction<number>>,
    viewPageList: number[],
    totalSection: number
}

// component : 페이지네이션 컴포넌트
export default function Pagination(props: Props) {
    // state : properties
    const {currentPage, currentSection, viewPageList, totalSection} = props;
    // state : properties
    const {setCurrentPage, setCurrentSection} = props

    // eventHandler : 페이지 번호 클릭 처리 이벤트 헨들러
    const onPageClickEventHandler = (pageNum: number) => {
        setCurrentPage(pageNum);
    }
    // eventHandler : 이전 버튼 클릭 이벤트 헨들러
    const onPreviousBtnClickHandler = () => {
        if (currentSection === 1) return;  // 현재 섹션이 1인경우 무반응.
        setCurrentPage(10*(currentSection - 1));
        setCurrentSection(currentSection - 1);
    }
    // eventHandler : 다음 버튼 클릭 이벤트 헨들러
    const onNextBtnClickHandler = () => {
        if (currentSection ===1) return;
        setCurrentPage((currentSection * 10) + 1); // 11, 21, 31
        setCurrentSection(currentSection + 1);
    }


    return (
        <div id="pagination-wrapper">
            <div className="pagination-change-link-box">
                <div className="icon-box-small">
                    <div className="icon expand-left-light-icon"></div>
                </div>
                <div className="pagination-change-link-text" onClick={onPreviousBtnClickHandler}>{"이전"}</div>
            </div>

            <div className="pagination-divider">{"|"}</div>
            {viewPageList.map((page, index) =>
                page === currentPage ? <div key={index} className="pagination-text-active">{page}</div> :
                    <div key={index} className="pagination-text"
                         onClick={() => onPageClickEventHandler(page)}>{page}</div>)}


            <div className="pagination-divider">{"|"}</div>

            <div className="pagination-change-link-box">
                <div className="pagination-change-link-text" onClick={onNextBtnClickHandler}>{"다음"}</div>
                <div className="icon-box-small">
                    <div className="icon expand-right-light-icon"></div>
                </div>
            </div>
        </div>
    )
}