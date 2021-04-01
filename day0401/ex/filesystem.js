/*
<중요>
내장 모듈 중 file system 모듈을 사용해보자
파일 처리와 관련된 기능을 갖는 모듈이다
*/

var fs=require("fs"); //모듈 가져오기

//원하는 파일의 내용을 읽어서, 현재 프로그램으로 가져와보자
var text=fs.readFileSync("./노트정리.html","utf8");//경로, 인코딩방식
//읽어들인 결과를 메모리에 올려서 변수에 담는다.

console.log(text);


//파일 시스템 객체를 이용하여 읽어들인 내용을 비어있는 파일에 출력해보자
fs.writeFile("./empty.txt",text,"utf8",function(){
    console.log("파일 쓰기 완료");
});//경로, 내용, 인코딩 방식 ,완료된 시점에 하고싶은것