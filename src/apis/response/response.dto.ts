import ResponseCode from "../../types/enum/ResponseCode";

export default interface ResponseDto{
    code : ResponseCode;
    message : String;

    // typeScrip의 인터페이스 정의
    /*
    * 자바의 인터페이스가 클래스에서 구현할 메서드의 명세를 정의하는 일을 한다면
    * typeScript에서의 인터페이스는 주로 객체의 구조를 정의하는 일을 한다.
    * JS에서 객체란 JSON형식으로 되어있다.
    * */

}