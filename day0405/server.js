var http = require("http");
var fs=require("fs");
var qs=require("querystring");//전송한 직렬화된 데이터에 대한 해석을 담당(문자열로 해석 가능)
var mysql=require("mysql");//외부 모듈 이므로 별도 설치 필요
//npm install mysql
var ejs=require("ejs");//ejs 모듈을 가져오기(외부모듈)
//npm install ejs

var conStr={
    url:"localhost:3306",
    database:"nodejs",
    user:"root",
    password:"1234"
};

var server=http.createServer(function(request, response){

    //서버는 클라이언트의 요청을 구분 할 수 있어야한다.
    //결국 클라이언트카 서버에게 무엇을 원하는지에 대한 정보는 요청 URL로 구분할 수 있다.
    //따라서 요청과 관련된 정보를 가진 객체인 request 객체를 이용하자
    console.log("클라이언트 요청",request.url);

    //도메인 : 포트 번호까지를 루트로 지정
    /*
    회원가입 폼 요청 : /member/form
    회원가입 요청 :  /member/join
    회원 목록 요청 : /member/list
    회원 상세 보기 요청 : /member/detail
    최원 정보 수정 요청 :  /member/edit
    회원 정보 삭제 요청 :  /member/del
    */

    switch(request.url){
        case "/member/form" : registForm(request, response);break;
        case "/member/join" : join(request, response);break;
        case "/member/list" : getList2(request, response);break;
        case "/member/detail" : getDetail(request, response);break;
        case "/member/edit" : edit(request, response);break;
        case "/member/del" : del(request, response);break;
    }
});

server.listen(7979,function(){
    console.log("Server is running at 7979 port...");
});



function registForm(request, response){
    fs.readFile("./regist_form.html","utf8",function(err, data){
    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    response.end(data);
});
}
function join(request, response){
    //클라이언트가 post방식으로 전송했기 때문에 http데이터 구성 중
    //body를 통해서 전송되어온다.
    //post방식의 파라미터를 끄집어 내보자
    var content="";
    request.on("data",function(param){//param에는 body안에 들어가있는 데이터가 서버의 메모리 버퍼로 들어온다
        content+=param;
        
    });//post방식의 데이터를 감지
    request.on("end",function(){
        console.log("데이터 : ",content);
        console.log("파싱한 결과는",qs.parse(content));

        var obj=qs.parse(content);

        var con=mysql.createConnection(conStr);
        //쿼리문을 실행하는 메서드명 : query
        var sql="insert into member(user_id,user_name,user_pass)";
        sql+=" values('"+obj.user_id+"','"+obj.user_name+"','"+obj.user_pass+"')"; //한칸 띄우기
    
    
        con.query(sql,function(err,fields){
            if(err){
                response.writeHead(500,{"Content-Type":"text/html;charset=utf-8"});
                response.end("서버측 오류 발생!!");
            }else{
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end("회원가입 성공<br><a href='/member/list'>회원 목록 바로가기</a>");
            }
            //db작업 송공 여부와 상관없이 연결된 접속은 끊어야 한다.
            con.end();//접속 끊기
        });
    });


    //접속을 시도하는 메서드의 반환값으로, 접속 정보 객체가 반호나되는데, 이 객체를 이용해 쿼리실행 가능
    //현재의 경우 : con
        
    }


    //이 방법은 디자인 마저도 프로그램 코드에서 감당하고 있기 때문에 유지보수성이 낮다
    function getList(request, response){
        var con=mysql.createConnection(conStr);
        var sql="select * from member";
        con.query(sql,function(err, result, fields){
            //2번째 인수 : select문 수행결과 배열
            //3번째 인수 : 메타데이터

            // console.log("쿼리문 수행 후 mysql로 부터 받아온 데이터는 : ", result);
            // console.log("가운데 매개변수 : ",fields );
            // console.log("결과 레코드 수는 : ",result.length );

            var tag="<table width='100%' border='1px'>";
            //배열을 서버의 화면에 표형태로 출력해보자.
            for(var i=0;i<result.length;i++){
                var member=result[i];
                var member_id=result[i].member_id;
                var user_id=member.user_id;
                var user_name=member.user_name;
                var user_pass=member.user_pass;
                var regdate=member.regdate;
                tag+="<tr>";
                tag+="<td>"+member_id+"</td>";
                tag+="<td>"+user_id+"</td>";
                tag+="<td>"+user_name+"</td>";
                tag+="<td>"+user_pass+"</td>";
                tag+="<td>"+regdate+"</td>";
                tag+="</tr>";
            }
            tag+="<tr>";
            tag+="<td colspan='5'><a href='/member/form'>회원등록</a></td>";
            tag+="</tr>";
            tag+="</table>";
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(tag);

            con.end();
        });
    }

    //getList()보다 개선된 방법으로 처리
    function getList2(request, response){
        //클라이언트에게 결과를 보여주기 전에, 이미 DB 연동을 하여 레코드를 가져와야한다.
        var con=mysql.createConnection(conStr);
        var sql="select * from member";
        con.query(sql,function(err, record, fields){
            //rocord변수에는 제이슨 들이 일차원 배열에 탑재되어 있다.
            fs.readFile("./list.ejs", "utf8",function(err, data){//파일을 다 읽으면 익명함수 호출 
                if(err){
                    console.log("list.html fail");
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    //클라이언트에게 list.ejs를 그냥 그대로 보내지 말고, 서버에서 실행을 시킨 후, 그 결과를 클라이언트에게 전송
                    //즉, ejs를 서버에서 렌더링 시켜야 한다.
                    var result=ejs.render(data,{
                        members:record
                    }); //%안에 들어있는 코드가 실행된다.
                    response.end(result);
                }
            });
        });
    }
    function getDetail(request, response){

    }
    function edit(request, response){

    }
    function del(request, response){

    }