// 서버 구축
var http = require("http");
var fs = require("fs");//fs모듈 가져오기 > 파일을 다룰때 사용되는 모듈
//mysql을 연동하기 위한 모듈 가져오기
var mysql = require("mysql"); //외부 모듈이기 때문에 따라서 개발시 추가 설치해야 한다.
//npm이라는 툴을 이용하면, 노드 js 개발시 모듈 설치와 관련된 많은 기능을 지원한다.
//npm : node.js Package Manager
//추가 설치 명령어 : cmd > npm install 모듈명

var server=http.createServer(function(request, response){
    //클라이언트에 응답하기
    //클라이언트에게 보여줄 html 문거를 이루고 있는 코드를 읽어들여서
    //응답정보로 보내야 한다.
    //매개변수 순서지키면 들어감

    //클라이언트가 브라우저의 URL에 어떤 주솔들 입력했는지를 조사해보자
    //그 조사 결과에 따라서 아래 코드 중 어떤 코드가 실행될지를 결정짓자
    //request객체란 클라이언트의 요청 정보를 가진 객체이기 때문에 클라이언트가 입력한 url
    //정보도 이 객체를 통해 얻어낼 수 있다.

    var url = request.url;
    // console.log("클라이언트가 요청시 입력한 주소는 : ",url);

    // localhost:8888/form : 회원가입 디자인 폼 요청으로 간주
    // localhost:8888/regist : 회원가입 요청으로 간주
    // localhost:8888/result : 회원가입 완료로 간주

    if(url=="/member/form"){
        fs.readFile("./regist_form.html", "utf8", function(error,data){
            //파일의 내용을 모두 읽어들인 순간 이 익명함수가 동작함.
            response.end(data);
        });
    }else if(url=="/member/regist"){//등록을 원하면
        //쿼리문 수행 전에, node.js가 mysql에 접속을 성공해야 한다!
        var con = mysql.createConnection({
            url:"localhost:3306",
            database:"nodejs", //사용중인 db명
            user:"root",
            password:"1234"
        });
        // console.log("접속 결과 객체",con);

        // console.log("DB에 등록을 원하는군요");
        var sql="insert into member(user_id,user_pass,user_name)";
        sql+=" values('superman', '0000', '수퍼맨')";//스페이스바 하나 있어야함

        con.query(sql, function(err,fields){
            if(err){
                console.log("쿼리문 수행중 에러 발생 : ",err);
            }else{
                console.log("등록 성공");
            }
        });//쿼리문 수행

    }else if(url=="/member/result"){
        fs.readFile("./result.html", "utf8", function(error,data){
            //파일의 내용을 모두 읽어들인 순간 이 익명함수가 동작함.
            response.end(data);
        });
    }


});

server.listen(8888,function(){
    console.log("Server is running at 8888...");
});