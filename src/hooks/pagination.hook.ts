import {useEffect, useState} from "react";
// custom 훅.
const usePagination = <T>(countPerPage: number) => {
    // state: 전체 객체 리스트(제네릭 타입.)
    const [totalList, setTotalList] = useState<T[]>([]);
    // state: 보여줄 객체 리스트
    const [viewList, setViewList] = useState<T[]>([]);
    // state: 현재 페이지 번호 상태.
    const [currentPage, setCurrentPage] = useState<number>(1);

    // state: 전제 페이지 번호 리스트 상태.
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    // state: 보여줄 페이지 번호 리스트 상태.
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    // state: 현재 페이지의 섹션 상태
    const [currentSection, setCurrentSection] = useState<number>(1);
    // state: 전체 섹션 상태.
    const [totalSection, setTotalSection] = useState<number>(1);

    // function : 보여줄 페이지 리스트 추출 함수
    const setViewPage = () => {
        const START_INDEX = 10 * (currentSection - 1);
        const END_INDEX = (10 * currentSection)  > totalPageList.length ? totalPageList.length : (10 * currentSection);
        const pageList = totalPageList.slice(START_INDEX, END_INDEX);
        setViewPageList(pageList);

    }
    // function : 보여줄 객체 리스트 추출 함수.
    const setView = () => {
        const START_INDEX = countPerPage * (currentPage - 1);
        const END_INDEX = (countPerPage * currentPage)  > totalList.length ? totalList.length : (countPerPage * currentPage);
        const VIEW_LIST = totalList.slice(START_INDEX, END_INDEX);  // 특정 페이지 번호 클릭시 보여줄 리스트.

        setViewList(VIEW_LIST);

    }


    // effect : totalList 변경시 마다 실행할 작업
    useEffect(() => {
        const totalPage = Math.ceil(totalList.length / countPerPage);  // 전체 데이터 갯수 / 페이지당 갯수 올림처리 == 전체 페이지 수
        const totalSection = Math.ceil(totalList.length / (countPerPage * 10)); // 전체 페이지 수 / 10  == 1섹션당 10개의 페이지 번호.
        const totalPageList = [];

        for (let page = 1; page <= totalPage; page++) totalPageList.push(page);  // 전체 페이지를 리스트 제작.
        setTotalPageList(totalPageList);
        setTotalSection(totalSection);

        // 현재페이지 시작점 고정
        setCurrentPage(1);
        setCurrentSection(1);
        // 현재 페이지에 대한 보여줄 데이터 리스트
        setView();
        // 현제 페이지에 대한 보여줄 페이지 번호 리스트
        setViewPage();


    }, [totalList]);

    // effect : 현재 페이지가 변경될 때마다 실행할 작업.
    useEffect(()=>{
        setView();
    },[currentPage]);

    //effect : 현재 페이지 색션이 바뀔때마다 실행할 작업. ㅇ
    useEffect(()=>{
        setViewPage();
    },[currentSection])

    return {
        currentPage,
        currentSection,
        setCurrentPage,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    };
}

export default usePagination;
