export default interface BoardListItem{
    boardNum : number,
    title : String,
    content : String,
    writeDate : String,
    nickname : String,
    boardTitleImg : String | null,
    favoriteCnt : number,
    commentCnt : number,
    viewCnt : number,
    writeProfileImg: String | null
}

