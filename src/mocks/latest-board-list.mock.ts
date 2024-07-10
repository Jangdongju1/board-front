import {BoardListItem} from "../types/interface";
// What is mocks?
//백엔드가 아직 완성되지 않았거나 테스트 중일 때, 실제 API를 호출하는 대신 미리 정의된 데이터를 반환하여 테스트를 수해함
// 즉, 모의데이터
const latestBoardListMock: BoardListItem[] = [
    {
        boardNum: 1,
        title: "안녕하세요",
        content: "안녕하세요 우린 서커스 매직유랑단 꿈을찾아 떠나간다네",
        writeDate: "2024.05.01",
        nickname: "KSW UDU",
        boardTitleImg: "./testImg.jpg",
        favoriteCnt: 0,
        commentCnt: 0,
        viewCnt: 0,
        writeProfileImg: "./testImg.jpg"
    },
    {
        boardNum: 1,
        title: "안녕하세요",
        content: "안녕하세요 우린 서커스 매직유랑단 꿈을찾아 떠나간다네",
        writeDate: "2024.05.01",
        nickname: "KSW UDU",
        boardTitleImg: "./testImg.jpg",
        favoriteCnt: 0,
        commentCnt: 0,
        viewCnt: 0,
        writeProfileImg: null
    }
];

export default latestBoardListMock;
