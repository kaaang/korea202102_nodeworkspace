/*
node.js는 웹브라우저에서 사용되는 js문법을 거의 그대로 사용하기 때문에
자체적인 능력이 한계가 있다. 하지만 모듈을 통해 엄청난 확장성을 가지고 있다.
*/

//기본적인 웹 서버 모듈 가져오기
//http 등의 모듈은 이미 node.js설치시 함께 포함이 된다.
//이러한 모듈을 내장 모듈이라 한다
var http = require("http");

//내가 정의한 나만의 모듈도 가져와보자
var md = require("./mymodule.js");

var server = http.createServer(function(request, response){
    /*
    request : 클라이언트의 요청 정보를 담고 있는 객체
    reponse : 클라이언트에 응답할 정보를 담고 있는객체
    */
   response.end(md.getMsg());


});//서버 객체 생성


//네트워크 프로그램간 식별을 위한 구분 고유값 1~1024 사이의 포트번호는 시스템이
//이미 사용중인 포트이므로, 피해야한다
//ex) 21 : FTP
//또한 상용 프로그램이 이미 사용중인 포트도 피하자
//ex) 1521 : oracle, 3306 : mysql

server.listen(7777, function(){
    console.log("My Server is running at 7777...");
}); //서버 가동