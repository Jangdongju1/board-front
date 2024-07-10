export default interface Board {
    boardNum: string,
    title: string,
    content: string,
    boardImgList: string[],
    writeDate : string,
    writerEmail : string,
    writerNickname : string,
    writerProfileImg : string | null
}