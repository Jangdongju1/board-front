import React, {useEffect, useState} from "react";
import './style.css';
import Top3Component from "../../components/Top3Item";
import {BoardListItem} from "../../types/interface";
import BoardComponent from "../../components/BoardListItem";
import {useNavigate} from "react-router-dom";
import {SEARCH_PATH} from "../../constant";
import {getLatestBoardListRequest, getPopularWordListRequest, getTop3BoardListRequest} from "../../apis";
import {GetLatestBoardListResponseDto, GetTop3BoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {ResponseCode} from "../../types/enum";
import {usePagination} from "../../hooks";
import Pagination from "../../components/Pagination";
import {GetPopularListResponseDto} from "../../apis/response/search";

//메인화면 컴포넌트
export default function Main() {
    // function : 네비게이트 함수.
    const navigator = useNavigate();
    // component : 메인 상단 컴포넌트
    const MainTop = () => {
        // state : 주간 top 3 게시물 리스트 상태.
        const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);
        // function : top3 게시물 api요청에 대한 응답처리 함수
        const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            const {top3BoardList} = responseBody as GetTop3BoardListResponseDto;
            setTop3BoardList(top3BoardList);
        }
        // effect : 첫 마운트시 실행될 함수(top3 게시물 불러오기)
        useEffect(() => {
            //setTop3BoardList(Top3BoardListMock);
            getTop3BoardListRequest().then(response => {
                getTop3BoardListResponse(response)
            })

        }, []);
        return (
            <div>
                <div id="main-top-wrapper">
                    <div className="main-top-container">
                        <div className="main-top-intro">{"JBoard 에서 \n 다양한 이야기를 나누어 보세요."}</div>
                        <div className="main-top-contents-box">
                            <div className="main-top-contents-title">{"주간 Top3 게시물"}</div>
                            <div className="main-top-contents">
                                {top3BoardList.map((list, index) => {
                                    return <Top3Component key={index} top3ListItem={list}/>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // component : 메인 하단 컴포넌트
    const MainBottom = () => {
        // state : 페이지네이션 상태.(커스텀 훅을 사용할때에는 반드시 한줄로 표기를해야함.)
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

        // state : 인기 검색어 리스트 상태
        const [popularWordList, setPopularWordList] = useState<string[]>([]);

        // function : 최신게시물 api호출에 대한 응답처리 함수.
        const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;

            const {code} = responseBody
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 에러입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            const {latestBoardList} = responseBody as GetLatestBoardListResponseDto;
            setTotalList(latestBoardList);
        }
        // function : 인기 검색어 관련 api 호출 응답처리 함수.
        const getPopularWordListResponse = (responseBody : GetPopularListResponseDto | ResponseDto | null) =>{
            if (!responseBody) return;

            const {code} = responseBody;
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
            if (code !== ResponseCode.SUCCESS) return;

            const {popularWordList} = responseBody as GetPopularListResponseDto;
            setPopularWordList(popularWordList);

        }

        // eventHandler : 인기 검색어 클릭 이벤트 헨들러
        const onPopularWordClickEventHandler = (word: string) => {
            navigator(SEARCH_PATH(word));
        }

        // effect : 최신 게시물 상태 초기화
        useEffect(() => {
            getLatestBoardListRequest().then(response => {
                getLatestBoardListResponse(response)
            })
            getPopularWordListRequest().then(response =>{getPopularWordListResponse(response)})

        }, []);
        return (
            <div id="main-bottom-wrapper">
                <div className="main-bottom-container">
                    <div className="main-bottom-title">{"최신 게시물"}</div>
                    <div className="main-bottom-contents-box">
                        <div className="main-bottom-latest-contents">
                            {viewList.map((list, index) => {
                                return <BoardComponent key={index} boardListItem={list}/>
                            })}
                        </div>
                        <div className="main-bottom-popular-box">
                            <div className="main-bottom-popular-card">
                                <div className="main-bottom-popular-card-container">
                                    <div className="main-bottom-popular-card-title">{"인기 검색어"}</div>
                                    <div className="main-bottom-popular-card-contents">
                                        {popularWordList.map((word, index) => {
                                            return <div className="word-badge" key={index}
                                                        onClick={() => onPopularWordClickEventHandler(word)}>{word}</div>
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-bottom-pagination-box">
                        <Pagination currentPage={currentPage} currentSection={currentSection}
                                    setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                                    viewPageList={viewPageList} totalSection={totalSection}/>
                    </div>
                </div>
            </div>
        )
    }

    return (

        <div>
            <MainTop/>
            <MainBottom/>
        </div>


    )
}