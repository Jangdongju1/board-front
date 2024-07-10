import React, {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import './style.css';
import InputComponent from "../../components/InputBox";
import {SignInRequestDto, SignUpRequestDto} from "../../apis/request/auth";
import {signInRequest, signUpRequest} from "../../apis";
import {SignInResponseDto, SignUpResponseDto} from "../../apis/response/auth";
import {ResponseDto} from "../../apis/response";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../constant";
import {useNavigate} from "react-router-dom";
import {Address, useDaumPostcodePopup} from "react-daum-postcode";
import {ResponseCode} from "../../types/enum";

//component : 인증화면 컴포넌트.
export default function Authentication() {
    // state : 페이지에 대한 상태
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
    // state : 쿠키의 상태
    const [cookie, setCookie] = useCookies();
    // function : 네이게이터 함수
    const navigator = useNavigate();

    // component : SignIn Card
    const SignInCard = () => {
        // state : 이메일 상태.
        const [userEmail, setEmail] = useState("");
        // sate : 패스워드 상태.
        const [password, setPassword] = useState("");

        // state : 패스워드 인풋타입 상태
        const [typeState, setTypeState] = useState<"text" | "password">("password");
        // state : 에러 상태
        const [error, setError] = useState(false);
        // state : 패스 워드 아이콘 상태.
        const [icon, setIcon] = useState<"key-light-on-icon" | "key-light-off-icon" | "navigate-next-icon">("key-light-off-icon");
        // state : 이메일 input 참조 상태.
        const emailRef = useRef<HTMLInputElement | null>(null);
        const passwordRef = useRef<HTMLInputElement | null>(null);

        // function : 이메일 변경 이벤트 처리.
        const onEmailChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = e.target;
            setEmail(value);
        }
        // function :패스워드 변경 이벤트 처리.
        const onPasswordChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = e.target;
            setPassword(value);
        }

        // function : Sign In Response 처리. (응답에 대한 처리.)
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                alert("네트워크 상태를 확인해 주세요")
                return;
            }
            const {code} = responseBody;
            if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.")
            if (code === ResponseCode.SIGN_IN_FAILED || code === ResponseCode.VALIDATION_FAILED) setError(true);
            if (code !== ResponseCode.SUCCESS) return;

            const {token, expireTime} = responseBody as SignInResponseDto;  // 두가지 타입 이상일 경우에, 반드시 한가지 타입을 확정시켜 줘야함.
            const now = new Date().getTime();
            const expires = new Date(now + expireTime * 1000);  // 밀리세컨드 단위.

            setCookie('accessToken', token, {expires, path: MAIN_PATH()});  // 쿠키의 옵션으로 만료시간을 줄 때에 단위는 밀리세컨드임.
            navigator(MAIN_PATH());
        }

        // eventHandler : 로그인 버튼  클릭 처리 이벤트.
        const onSignInBtnClickHandler = () => {
            const requestBody: SignInRequestDto = {userEmail, password};
            signInRequest(requestBody).then(responseBody => {
                signInResponse(responseBody);
            })

        }
        // eventHandler : 회원가입 버튼 클릭 처리 이벤트.
        const onSignUpLinkClickHandler = () => {
            setView("sign-up");

        }


        // eventHandelr : 이메일인풋 엔터키 헨들러
        const onEmailKeydownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            if (!passwordRef.current) return;
            passwordRef.current?.focus();// 엔터입력시 피밀번호로 포커스 이동

        }


        // eventHandler : 패스워드 인풋 엔터키 헨들러
        const onPasswordKeydownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            onSignInBtnClickHandler();
        }

        const onPasswordBtnClickHandelr = () => {
            if (typeState === "password") {
                setTypeState("text");
                setIcon("key-light-off-icon");
            } else {
                setTypeState("password");
                setIcon("key-light-on-icon")
            }

        }

        return (
            <div id="auth-card">
                <div className="auth-card-box">
                    <div className="auth-card-top">
                        <div className="auth-card-title-box">
                            <div className="auth-card-title">{"로그인"}</div>
                        </div>
                        <InputComponent ref={emailRef} label={"이메일 주소"} type={"text"} placeholder={"이메일 주소를 입력해 주세요"}
                                        value={userEmail}
                                        onChange={onEmailChangeEventHandler} error={error}
                                        onKeydown={onEmailKeydownEventHandler}/>
                        <InputComponent ref={passwordRef} label={"패스워드"} type={typeState} placeholder={"비밀번호를 입력해 주세요"}
                                        value={password}
                                        onChange={onPasswordChangeEventHandler} error={error} icon={icon}
                                        onKeydown={onPasswordKeydownEventHandler}
                                        onButtonClick={onPasswordBtnClickHandelr}/>
                    </div>
                    <div className="auth-card-bottom">
                        <div className="auth-sign-in-error-box">
                            {error && (<div
                                className="auth-sign-in-error-message">{"이메일, 주소 또는 비밀번호를 잘못 입력했습니다. \n 입력하신 내용을 다시 확인해 주세요."}</div>)}


                        </div>
                        <div className="black-large-full-button" onClick={onSignInBtnClickHandler}>{"로그인"}</div>
                        <div className="auth-description-box">
                            <div className="auth-description">{"신규 사용자 이신가요?"}<span
                                className="auth-description-link" onClick={onSignUpLinkClickHandler}>{"회원가입"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    // component : SignUp Card
    const SignUpCard = () => {
        // state : 이메일 요소 참조 상태.
        const emailRef = useRef<HTMLInputElement | null>(null);
        // state : 페스워드 요소 참조 상태.
        const passwordRef = useRef<HTMLInputElement | null>(null);
        // state : 패스워드 확인 요소 참조상태.
        const passCheckRef = useRef<HTMLInputElement | null>(null);
        // satae : 닉네임 요소 참조상태.
        const nicknameRef = useRef<HTMLInputElement | null>(null);
        // sate :  휴대폰번호 요소 참조상태
        const telNumRef = useRef<HTMLInputElement | null>(null);
        // sate : 주소 및 상세주소 참조 상태.
        const addressRef = useRef<HTMLInputElement | null>(null);
        const addressDetailRef = useRef<HTMLInputElement | null>(null);

        // state : 로그인 박스 페이지 상태.
        const [page, setPage] = useState<1 | 2>(1);
        // state : 이메일 상태.
        const [userEmail, setUserEmail] = useState<string>("");
        // state : 패스워드 상태.
        const [password, setPassword] = useState<string>("");
        // state : 패스워드 확인 상태.
        const [passCheck, setPassCheck] = useState<string>("");
        // state : 닉네임 상태.
        const [nickname, setNickname] = useState<string>("");
        // state : 휴대폰 번호 상태.
        const [telNumber, setTelNumber] = useState<string>("")
        // state : 주소 상태.
        const [address, setAddress] = useState<string>("");
        // state : 상세주소 상태.
        const [addressDetail, setAddressDetail] = useState<string>("");
        // state : 개인정보 제공 동의 상태.
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);


        // state : 패스워드 요소 아이콘 상태
        const [passIcon, setPassIcon] = useState<"key-light-on-icon" | "key-light-off-icon" | "navigate-next-icon">("key-light-off-icon");
        const [passCheckIcon, setPassCheckIcon] = useState<"key-light-on-icon" | "key-light-off-icon" | "navigate-next-icon">("key-light-off-icon");

        // state : 패스워드 요소 타입 상태.
        const [passType, setPassType] = useState<"text" | "password">("password");
        const [passCheckType, setPassCheckType] = useState<"text" | "password">("password");

        // state : 이메일 에러상태.
        const [emailError, setEmailError] = useState<boolean>(false);
        // state : 패스워드 에러 상태.
        const [passError, setPassError] = useState<boolean>(false);
        // state : 패스워드 확인 에러상태.
        const [passCheckError, setPassCheckError] = useState<boolean>(false);
        // state : 닉네임 에러상태
        const [nicknameError, setNicknameError] = useState<boolean>(false);
        // state : 휴대폰번호 에러상태
        const [telNumError, setTelNumError] = useState<boolean>(false);
        // state : 주소 에러상태
        const [addressError, setAddressError] = useState<boolean>(false);
        // state : 개인정보 동의에 대한 에러상태.
        const [agreedPersonalError, setAgreesPersonalError] = useState<boolean>(false);


        // state : 이메일 에러 메세지 상태 .
        const [emailErrorMsg, setEmailErrorMsg] = useState<string>("");
        // state : 패스워드 에러 메세지 상태 .
        const [passErrorMsg, setPassErrorMsg] = useState<string>("");
        // state : 패스워드 확인 에러 메세지 상태 .
        const [passCheckErrorMsg, setPassCheckErrorMsg] = useState<string>("");
        // state : 닉네임 에러 메세지 상태.
        const [nicknameErrorMsg, setNicknameErrorMsg] = useState<string>("");
        // state : 휴대폰번호 에러 메세지 상태.
        const [telNumErrorMsg, setTelNumErrorMsg] = useState<string>("");
        // state : 주소 에러 메세지 상태.
        const [addressErrorMsg, setAddressErrorMsg] = useState<string>("");

        // function : 다음 주소 검색 팝업 오픈 함수.
        const open = useDaumPostcodePopup();
        // function : 회원가입 요청에 대한 응답값 처리함수.
        const signUpResponse = (responseBody : SignUpResponseDto | ResponseDto | null) =>{
            if (!responseBody){
                alert("네트워크 상태를 확인해주세요.");
                return;
            }
            const {code} = responseBody; // 응답코드 확인.
            if (code === ResponseCode.SUCCESS){
                alert("회원가입이 되었습니다.");
                setView("sign-in");
            }else if(code === ResponseCode.DUPLICATE_NICKNAME){
                setNicknameError(true);
                setNicknameErrorMsg("중복된 닉네임입니다.");
                setPage(1);
            }else if(code === ResponseCode.VALIDATION_FAILED){
                alert("모든 값을 입력해 주세요.")
            }else if(code === ResponseCode.DATABASE_ERROR){
                alert("데이터베이스 오류입니다.")
            }else if(code === ResponseCode.DUPLICATE_TEL_NUMBER){
                setTelNumError(true);
                setTelNumErrorMsg("중복된 전화번호 입니다.");

            }else if(code === ResponseCode.DUPLICATE_EMAIL){
                setEmailError(true);
                setEmailErrorMsg("중복된 이메일 주소입니다.");
                setPage(1);
            }

        }

        // eventHandler : 이메일 입력 요소 변경 이벤트 헨들러
        const onEmailChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setUserEmail(value);
            setEmailError(false);
            setEmailErrorMsg("");
        }
        // eventHandler : 패스워드 입력요소 변경 이벤트 헨들러
        const onPasswordChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setPassword(value);
            setPassError(false);
            setPassErrorMsg("");
        }
        // eventHandler : 패스워드 확인 입력요소 변경 이벤트 헨들러

        const onPasswordCheckChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setPassCheck(value);
            setPassCheckError(false);
            setPassCheckErrorMsg("");
        }

        // eventHandler : 닉네임 입력요소 변경 이벤트 처리 헨들러
        const onNicknameChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setNickname(value);
            setNicknameError(false);
            setNicknameErrorMsg("");
        }
        // eventHandler : 휴대폰 번호 입력요소 변경 이벤트 처리 헨들러
        const onTelNumChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setTelNumber(value);
            setTelNumError(false);
            setTelNumErrorMsg("");
        }
        // eventHandler : 주소 입력요소 변경 이벤트 처리 헨들러
        const onAddressChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setAddress(value);
            setAddressError(false);
            setAddressErrorMsg("");
        }
        // eventHandler : 상세주소 입력요소 변경 이벤트 처리 헨들러
        const onAddressDetailChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setAddressDetail(value);
        }
        //eventHandler : 패스워드 요소 아이콘 버튼 클릭 헨들러
        const onPassIconBtnClickHandler = () => {
            if (passType === "password") {
                setPassType("text");
                setPassIcon("key-light-on-icon");
            } else {
                setPassType("password");
                setPassIcon("key-light-off-icon");
            }
        }

        //eventHandler : 패스워드 확인 요소 아이콘 버튼 클릭 헨들러
        const onPassCheckIconBtnClickHandler = () => {
            if (passCheckType === "password") {
                setPassCheckType("text");
                setPassCheckIcon("key-light-on-icon");
            } else {
                setPassCheckType("password");
                setPassCheckIcon("key-light-off-icon");
            }
        }

        // eventHandler : 주소 검색 버튼 클릭 이벤트 핸들러(npm install react-daum-postcode) // 다음 api사용.
        const onAddressIconBtnClickHandler = () => {
            // 주소 api
            open({onComplete});

        }


        // eventHandler : 다음단계 버튼 클릭 이벤트 헨들러
        const onNextBtnClickHandler = () => {
            const pattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/ // 이메일 체크 정규식
            const isEmailPattern = pattern.test(userEmail);  // 정규식 매치.

            if (!isEmailPattern) {
                setEmailError(true);
                setEmailErrorMsg("이메일 주소 포맷이 맞지 않습니다.");
            }

            const isCheckedPassword = (password.trim().length >= 8 && password.trim().length <= 20);  // 패스워드는 8~20자
            if (!isCheckedPassword) {
                setPassError(true);
                setPassErrorMsg("비밀번호는 8~20자 사이 입니다");
            }

            const isMatchedPassCheck = (password === passCheck);
            if (!isMatchedPassCheck) {
                setPassCheckError(true);
                setPassCheckErrorMsg("입력하신 비밀번호가 일치 하지 않습니다.");
            }


            if (!isEmailPattern || !isCheckedPassword || !isMatchedPassCheck) return;


            setPage(2);

        }
        // eventHandler : 로그인 버튼 클릭 이벤트 헨들러
        const onLoginClickEventHandler = () => {
            setView("sign-in");
        }


        //eventHandler : 회원가입 버튼 클릭 헨들러
        const onSignUpBtnClickHandler = () => {
            // Step 1에 대한 입력값을 한번더 체크함.
            const pattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/ // 이메일 체크 정규식
            const isEmailPattern = pattern.test(userEmail);  // 정규식 매치.\

            if (!isEmailPattern) {
                setEmailError(true);
                setEmailErrorMsg("이메일 주소 포맷이 맞지 않습니다.");
            }

            const isCheckedPassword = (password.trim().length >= 8 && password.trim().length <= 20);  // 패스워드는 8~20자
            if (!isCheckedPassword) {
                setPassError(true);
                setPassErrorMsg("비밀번호는 8~20자 사이 입니다");
            }

            const isMatchedPassCheck = (password === passCheck);
            if (!isMatchedPassCheck) {
                setPassCheckError(true);
                setPassCheckErrorMsg("입력하신 비밀번호가 일치 하지 않습니다.");
            }

            const firstStepCheck = !emailError || !passError || !passCheckError;
            if (!firstStepCheck){
                setPage(1);
            }

            const nicknameCheck = nickname.trim().length > 0;
            if (!nicknameCheck){
                setNicknameError(true);
                setNicknameErrorMsg("닉네임을 입력해 주세요.")
            }

            const telNumPattern = /^[0-9]{11,13}$/;
            const telNumCheck = telNumPattern.test(telNumber);
            if (!telNumCheck){
                setTelNumError(true);
                setTelNumErrorMsg("숫자로만 입력해 주세요.");
            }

            const addressCheck = address.trim().length > 0;

            if (!addressCheck){
                setAddressError(true);
                setAddressErrorMsg("주소를 선택해주세요.");
            }

            if (!agreedPersonal) setAgreedPersonal(true);

            const secondStepCheck  = !nicknameCheck || !telNumCheck || !addressCheck;

            if (secondStepCheck) {
                alert("입력값을 확인해 주세요.");
                return;
            }
            const requestBody : SignUpRequestDto = {  // 객체 선언.
                userEmail, password, nickname, telNumber, address, addressDetail, agreedPersonal
            };
            signUpRequest(requestBody).then(signUpResponse);

        }
        //eventHandler : 개인정보 동의 체크박스 클릭 이벤트.
        const onCheckBoxClickEventHandler = () =>{
            setAgreedPersonal(!agreedPersonal);  // 반대로 바꿔서 넣기.
            setAgreesPersonalError(false);
        }


        // eventHandler :  이메일 엔터키처리 이벤트
        const onEmailKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            if (!passwordRef) return;  // null처리
            passwordRef.current?.focus();
        }

        // eventHandler : 패스워드 엔터키 처리 이벤트
        const onPasswordKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            if (!passCheckRef) return;  // null처리
            passCheckRef.current?.focus();
        }
        const onPassCheckKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            onNextBtnClickHandler();
        }

        // eventHandler : 닉네임 엔터키 처리
        const onNicknameKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            if (!telNumRef) return;
            telNumRef.current?.focus();
        }

        // eventHandler : 휴대폰번호 엔터키 처리
        const onTelNumKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            if (!addressRef) return;
            addressRef.current?.focus();
        }
        // eventHandler : 주소 엔터키 처리
        const onAddressKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            onAddressIconBtnClickHandler();
            // if (!addressDetailRef) return;
            // addressDetailRef.current?.focus();
        }
        // eventHandler : 주소상세 엔터키 처리.
        const onAddressDetailKeyDownEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            onSignUpBtnClickHandler(); // 개인정보 동의에 대해 한번 체크하고, error를 띄워야 함.
        }

        // eventHandler : 다음 주소 검색 완료 이벤트 처리.
        const onComplete = (data : Address) =>{
            const {address} = data;
            setAddress(address);
            setAddressError(false);
            setAddressErrorMsg("");
            if (!addressDetailRef) return;
            addressDetailRef.current?.focus();
        }


        return (
            <div id="auth-card">
                <div className="auth-card-box">
                    <div className="auth-card-top">
                        <div className="auth-card-title-box">
                            <div className="auth-card-title">{"회원가입"}</div>
                            <div className="auth-card-page">{`${page}/2`}</div>
                        </div>
                        {page === 1 && (
                            // 조건부 렌더링시 들어가는 Element 등도 하나의 Fragment혹은 하나의 컴포넌트 단위로..
                            <>
                                <InputComponent ref={emailRef} label={"이메일 주소*"} type={"text"}
                                                placeholder={"이메일 주소를 입력해주세요."}
                                                value={userEmail} error={emailError}
                                                message={emailErrorMsg} onChange={onEmailChangeEventHandler}
                                                onKeydown={onEmailKeyDownEventHandler}/>
                                <InputComponent ref={passwordRef} label={"비밀번호*"} type={passType}
                                                placeholder={"비밀번호를 입력해주세요."}
                                                value={password} error={passError} message={passErrorMsg}
                                                icon={passIcon}
                                                onChange={onPasswordChangeEventHandler}
                                                onButtonClick={onPassIconBtnClickHandler}
                                                onKeydown={onPasswordKeyDownEventHandler}/>
                                <InputComponent ref={passCheckRef} label={"비밀번호 확인*"} type={passCheckType}
                                                placeholder={"비밀번호를 다시 입력해 주세요."} value={passCheck}
                                                error={passCheckError}
                                                message={passCheckErrorMsg} icon={passCheckIcon}
                                                onChange={onPasswordCheckChangeEventHandler}
                                                onButtonClick={onPassCheckIconBtnClickHandler}
                                                onKeydown={onPassCheckKeyDownEventHandler}/>
                            </>
                        )}

                        {page === 2 && (
                            <>
                                <InputComponent ref={nicknameRef} label={"닉네임*"} type={"text"}
                                                placeholder={"닉네임을 입력해주세요."} value={nickname} error={nicknameError}
                                                message={nicknameErrorMsg} onChange={onNicknameChangeEventHandler}
                                                onKeydown={onNicknameKeyDownEventHandler}/>
                                <InputComponent ref={telNumRef} label={"휴대폰번호*"} type={"text"}
                                                placeholder={"휴대폰 번호를 입력해주세요."} value={telNumber} error={telNumError}
                                                message={telNumErrorMsg} onChange={onTelNumChangeEventHandler}
                                                onKeydown={onTelNumKeyDownEventHandler}/>
                                <InputComponent ref={addressRef} label={"주소*"} type={"text"} placeholder={"주소를 선택하세요."}
                                                value={address} error={addressError} icon={"navigate-next-icon"}
                                                onChange={onAddressChangeEventHandler}
                                                onButtonClick={onAddressIconBtnClickHandler}
                                                onKeydown={onAddressKeyDownEventHandler}/>
                                <InputComponent ref={addressDetailRef} label={"상세주소"} type={"text"}
                                                placeholder={"상세주소를 입력해주세요(선택사항)"} value={addressDetail} error={false}
                                                message={addressErrorMsg} onChange={onAddressDetailChangeEventHandler}
                                                onKeydown={onAddressDetailKeyDownEventHandler}/>
                            </>
                        )}

                    </div>
                    <div className="auth-card-bottom">
                        {page === 1 && (
                            <div className="black-large-full-button" onClick={onNextBtnClickHandler}>{"다음단계"}</div>
                        )}

                        {page === 2 && (
                            <>
                                <div className="auth-consent-box">
                                    <div className="auth-consent-checkbox" onClick={onCheckBoxClickEventHandler}>
                                        <div className={`icon ${agreedPersonal ? 'checkbox-checked' : 'checkbox-unchecked'}`}></div>
                                    </div>
                                    <div className={agreedPersonalError ? "auth-consent-title_error" : "auth-consent-title"}>{"개인정보동의"}</div>
                                    <div className="auth-consent-link">{"더보기 >"}</div>
                                </div>
                                <div className="black-large-full-button"
                                     onClick={onSignUpBtnClickHandler}>{"회원가입"}</div>
                            </>

                        )}

                        <div className="auth-description-box">
                            <div className="auth-descriptione">{"이미 계정이 있으신가요?"} <span
                                className="auth-description-link"
                                onClick={onLoginClickEventHandler}>{"로그인"}</span></div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }


    return (
        <div id="auth-wrapper">
            <div className="auth-container">
                <div className="auth-jumbotron-box">
                    <div className="auth-jumbotron-contents">
                        <div className="auth-logo-icon"></div>
                        <div className="auth-jumbotron-text-box">
                            <div className="auth-jumbotron-text">{"환영합니다."}</div>
                            <div className="auth-jumbotron-text">{"BULLETIN BOARD 입니다. "}</div>
                        </div>
                    </div>
                </div>
                <div>
                    {view === "sign-in" && (<SignInCard/>)}
                    {view === "sign-up" && (<SignUpCard/>)}
                </div>
            </div>
        </div>
    )
}