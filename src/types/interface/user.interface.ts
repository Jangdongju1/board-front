export default interface User {
  //  1)사용자 정보 변경시, 2) 로그인 유저 정보
    userEmail : string,
    nickname : string,
    profileImg : string | null;
}