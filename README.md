# Bulletin Board FrontEnd 
##### 📺 개발환경
* <img src="https://img.shields.io/badge/Language-%23121011?style=plastic"/>
     <div>
         <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=float-square&logo=JavaScript&logoColor=white"><img src="https://img.shields.io/badge/ES6-515151?style=float-square">, <img/ src="https://img.shields.io/badge/TypeScript-3178C6?style=float-square&logo=TypeScript&logoColor=white">
     </div>

* <img src="https://img.shields.io/badge/Library%20&%20Framwork-%23121011?style=plastic"/>
     <div>
          <img src="https://img.shields.io/badge/React.js-61DAFB?style=float-square&logo=React&logoColor=white"/><img src="https://img.shields.io/badge/18-515151?style=float-square">, <img src="https://img.shields.io/badge/Axios-5A29E4?style=float-square&logo=Axios&logoColor=white"/><img src="https://img.shields.io/badge/1.6.8-515151?style=float-square">, <img src="https://img.shields.io/badge/Zustand 4.5.2-515151?style=float-square">
     </div>

* <img src="https://img.shields.io/badge/ETC.-%23121011?style=plastic"/>
     <div>
          <img src="https://img.shields.io/badge/HTML5-E34F26?style=float-square&logo=HTML5&logoColor=white"/>, <img src ="https://img.shields.io/badge/CSS3-1572B6?style=float-square&logo=CSS3&logoColor=white"/>
     </div>

#### :bookmark_tabs: BackEnd Details > https://github.com/Jangdongju1/board-back/blob/main/README.md
-------------------------
### Project Overview

![프로젝트 구조도(간략)](https://github.com/user-attachments/assets/87970ba4-d052-4898-af8f-9e189ef63986)


본 프로젝트는 간단한 게시판을 구현한 프로젝트입니다. 기본적인 CRUD에 관련된 RestAPI를 BackEnd에 구현하였고, Fornt 단에서 Axios라이브러리를 활용한 HTTP통신으로 서버와 데이터를 주고 받도록 하였습니다. API에 대한 명세는 상단의 BackEnd Detatils의 링크에서 확인 하실 수 있습니다. 

### Learning Objectives(학습목표)
- 'RestAPI에 대한 설계'를 깨우치는 것
- 'HTTP통신'에 대한 이해.
- 'JS, TS'에 대한 이해.

 가장 우선시 하였던 목표는 'RestAPI'에 대한 설계방식을 이해하는 것입니다. 백엔드 개발자로써 실무에서 API설계에 관한 경험은 가지고 있으며 책무를 완수하였지만 처음에는 누구나 그렇듯 미숙했다는 생각이 머릿속을 맴돌았습니다. 프로젝트의 주제인 '게시판'은 비록 가장 기본적이고, 기초적인 프로젝트일 수 있으나, 그렇기 때문에 '더욱 직관적이며, 기본에 충실한 설계가 가능하겠다!'라는 생각이 들어 진행하게 된 것입니다.

또한 HTTP 통신에 대해 이해하는 것이 두번째 목표였습니다. 1) HTTP통신이 무엇인가?, 2) HTTP통신의 대표적인 특징(Connectionless, Stateless), 3) HttpMethod 에 대해 한번 더 학습하고 나아가 HTTP의 특징인 Connectionless & Stateless로 인해 발생하는 'Session 의 관리 문제'에 대하여 어떻게 하는 것이 더욱 효율적인가를 많이 고민하고 학습하였습니다.

마지막으로 JS 및 TS에 대한 기초적인 이해를 가져가는 것이 세번재 목표였습니다. 원래의 희망 분야가 BackEnd였고 그에 따라 BackEnd개발자로써의 경력을 가지고 있습니다. 저는 'Front단의 로직을 몰라도 된다' 라는 생각을 제일 경계합니다. 향후 Front담당자와의 원활한 협업을 위해서라도 해당 분야에 사용되는 로직이 어떻게 구성되어있고, 어떻게 돌아가는지는 조금이라도 알아야 한다고 생각합니다. 따라서 JS, TS의 기본적이 문법체계에 대해서 학습하였습니다.

### Supplimentary Matters(보완사항)
- [Backend] 토큰 만료에 따른 Refresh Token 발급 로직.
- [Backend] 예외에 대해서 전역 예외처리 로직.
