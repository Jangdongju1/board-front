import React from "react";
import {ChangeEvent, forwardRef, KeyboardEvent} from "react";
import "./style.css";


// 1) ?는 타입스크립트에서 '선택적 속성'을 전달할 때 사용된다 있을 수도 있고 없을 수도 있을때
interface InputProps {
    label: string,
    type: "text" | "password",
    placeholder: string,
    value: string,
    onChange: (e : ChangeEvent<HTMLInputElement>) => void,  //??
    error: boolean,
    icon?: "key-light-on-icon"|"key-light-off-icon"|"navigate-next-icon",
    onButtonClick?: () => void,
    message?: string
    onKeydown?: (event: KeyboardEvent<HTMLInputElement>) => void
}


const InputComponent = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
    const {label, type, placeholder, value, icon, message, error} = props;
    const {onChange, onButtonClick, onKeydown} = props
    // input 값 변경 이벤트작성.


    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!onKeydown) return;
        onKeydown(event);
    }

    return (
        <div className="inputbox">
            <div className="inputbox-label">{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} className="input" type={type} placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDownHandler}/>
                {onButtonClick !== undefined && (
                    <div className="icon-button">
                        {icon !== undefined && (<div className={`icon ${icon}`} onClick={onButtonClick}></div>)}
                    </div>
                )}
            </div>
            {message !== undefined && (<div className="inputbox-message">{message}</div>)}

        </div>
    )
})

export default InputComponent;

