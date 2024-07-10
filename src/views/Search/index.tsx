import React, {useEffect, useState} from "react";
import './style.css';
import {useNavigate, useParams} from "react-router-dom";
import BoardComponent from "../../components/BoardListItem";
import {SEARCH_PATH} from "../../constant";
import {getRelationWordListRequest, getSearchBoardListRequest} from "../../apis";
import {GetSearchBoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {ResponseCode} from "../../types/enum";
import {usePagination} from "../../hooks";
import {BoardListItem} from "../../types/interface";
import Pagination from "../../components/Pagination";
import GetRelationListResponseDto from "../../apis/response/search/get-relation-list.response.dto";

// 검색화면
export default function Search() {
    // navigator : 네이게이트 함수
    const navigator = useNavigate();
    // state : searchWord path variable 상태
    const {searchWord} = useParams();
    // state : 이전 검색어 상태.
    const [preSearchWord, setPreSearchWord] = useState<string | null>(null);
    // state : 검색 게시물 갯수 상태.
    const [count, setCount] = useState<number>(0);
    // state : 관련 검색어 리스트 상태.
    const [relationList, setRelationList] = useState<string[]>([]);
    // state : 페이지 네이션 상태.
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

    // function : 검색 게시물 응답 처리 함수.
    const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;

        if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
        if (code !== ResponseCode.SUCCESS) return;

        if (!searchWord) return ; // undifined 해결.

        const {searchList} = responseBody as GetSearchBoardListResponseDto;
        setTotalList(searchList);
        setCount(searchList.length); // 게시물으 전체 갯수.
        setPreSearchWord(searchWord);
    }
    // function : 연관검색어 리스트 응답처리 함수.
    const getRelationWordListResponse = (responseBody:GetRelationListResponseDto | ResponseDto | null)=>{
        if (!responseBody) return;
        const {code} = responseBody;

        if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
        if (code !== ResponseCode.SUCCESS) return;

        const {relativeWordList} = responseBody as GetRelationListResponseDto;
        setRelationList(relativeWordList);
    }

    // eventHandler : 연관 검색어 카드 클릭 이벤트 처리 헨들러
    const onRelationWordCardClickEventHandler = (word: string) => {
        navigator(SEARCH_PATH(word));
    }
    // effect : searchWord 값의 변경시 마다 실행할 함수.
    useEffect(() => {
        if (!searchWord) return;
        getSearchBoardListRequest(searchWord, preSearchWord).then(response => getSearchBoardListResponse(response));
        getRelationWordListRequest(searchWord).then(respnose=> getRelationWordListResponse(respnose));
    }, [searchWord]);
    return (
        <div id="search-wrapper">
            <div className="search-container">
                <div className="search-title-box">
                    <div className="search-title"><span
                        className="search-title-emphasis">{searchWord}{"에 대한 검색 결과입니다."}</span></div>
                    <div className="search-count search-title-emphasis">{count}</div>
                </div>
                <div className="search-contents-box">
                    {
                        count === 0 ? <div className="search-content-nothing">{"검색 결과가 없습니다."}</div> :
                            <div className="search-contents">
                                {viewList.map((boardListItem, index) => <BoardComponent key={index}
                                    boardListItem={boardListItem}/>)}
                            </div>
                    }
                    <div className="search-relation-box">
                        <div className="search-relation-card">
                            <div className="search-relation-card-container">
                                <div className="search-relation-card-title">{"관련검색어"}</div>
                                {
                                    relationList.length === 0 ?
                                        <div className="search-relation-card-content-nothing">{"관련 검색어가 없습니다."}</div> :

                                        <div className="search-relation-card-contents">
                                            {
                                                relationList.map((word, index) =>
                                                    <div className="word-badge" key={index}
                                                         onClick={() => onRelationWordCardClickEventHandler(word)}>{word}</div>)
                                            }
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-pagination-box">
                    {count !==0 &&
                        <Pagination currentPage={currentPage}
                                    currentSection={currentSection}
                                    setCurrentPage={setCurrentPage}
                                    setCurrentSection={setCurrentSection}
                                    viewPageList={viewPageList} totalSection={totalSection}/>
                    }

                </div>
            </div>
        </div>
    )
}