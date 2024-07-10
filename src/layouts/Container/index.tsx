import React from "react";
import Header from "../Header";
import Footer from "../footer";
import {Outlet, useLocation} from "react-router-dom";

// conponent : 컨테이너

// state: 현재페이지의 path name의 상태

//1) <Outlet/>을통해  '라우팅된' 컴포넌트들이 렌더링된다.
    export
default

function Container() {
    const {pathname} = useLocation();// pathname을 가져오는 함수 .

    return (
        <>
            <Header/>
            <Outlet/>
            {pathname !== "/auth" && (<Footer/>)}
        </>
    )

}
