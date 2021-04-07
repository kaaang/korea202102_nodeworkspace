var http = require("http");
var fs=require("fs");
var qs=require("querystring");//전송한 직렬화된 데이터에 대한 해석을 담당(문자열로 해석 가능)
var url=require("url");
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

    // console.log("파싱결과",url.parse(request.url));
    var requestUrl=url.parse(request.url).pathname;
    switch(requestUrl){
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
                // response.redirect("/member/list");
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
        //한 사람에 대한 정보 가져오기
        //mysql에 접속을 먼저 해야한다.
        var con = mysql.createConnection(conStr);

        //get방식은 body를 통해 넘겨지는 post방식에 비해 header를 타고 전송되어오므로
        //추출하기가 편하다.(마치 봉투의 겉면)
        //쿼리문에서 사용되는 pk값은, 클라이언트가 전송한 값으로 대체해버리자
        // console.log("url : ",request.url);
        //쿼리스트링 : 포스트방식의 파라미터 추출
        //url : get방식의 파라미터 추출

        // console.log("url을 분석 및 파싱한 결과",url.parse(request.url));
        // console.log("추출 : ",url.parse(request.url,true).query);
        var param=url.parse(request.url,true).query;
        var member_id=param.member_id;//곧 클라이언트가 넘긴 값으로 대체
        // console.log("id : ",member_id);
        // console.log("클라이언트가 전송한 member_id 파라미터 : ",member_id);
        var sql = "select * from member where member_id="+member_id;
        // response.end("test");
        con.query(sql,function(err,result,fields){
            // console.log(result);
            fs.readFile("./detail.ejs","utf8",function(err,data){
                if(err){
                    console.log(err);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        record:result[0] //한건이라 할지라도, select문의 결과는 배열이기 때문에 0번째를 추출
                    }));
                }
                con.end();
            });
        });
        
        // response.end("상세보기를 원하는군요");
    }
    function edit(request, response){
        //쿼리문에 사용될 4개의 파라미터값을 받아서 변수에 담아보자
        //글 수정은 클라이언트로부터 post 방식으로 서버에 전송되기 때문에,
        //그 데이터가 bodt에 들어있다
        //body에 들어있는 파라미터를 추출하기 위한 모듈이 쿼리스트링
        
        //post방식의 데이터는 버퍼에 담겨오기 때문에, 이 따로따로 직렬화되어 분산되 데이터를
        //일단 문자열로 모아서 처리해야 한다.
        
        var content="";
        request.on("data",function(data){
            // console.log(data);
            content+=data;//쪼개진 데이터 모으기
        });
        request.on("end",function(){
            //이 시점이 파라미터가 하나의 문자열로 복원된 시점
            var obj=qs.parse(content);
            console.log(obj);
            var sql="update member set user_id='"+obj.user_id+"', user_pass='";
            sql+=obj.user_pass+"', user_name='"+obj.user_name+"'";
            sql+=" where member_id="+obj.member_id;

            var con=mysql.createConnection(conStr);
            con.query(sql, function(err,field){
                if(err){
                    console.log(err);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end("<script>alert('수정되었습니다.');location.herf='/member/detail?member_id="+obj.member_id+"';</script>");
                }
            });

        });
        
    }
    function del(request, response){
        var param=url.parse(request.url, true).query;
        console.log("클라이언트가 전송한 파라미터틑",param);
        var sql="delete from member where member_id="+param.member_id;
        
        //쿼리문 구성이 끝났으므로 mysql에 접속하여 해상 쿼리를 실행
        var con = mysql.createConnection(conStr);//접속 및 커넥션 객체 반환

        //select문의 경우엔 결과를 가져와야 하기 때문에 가운데 인수, rewult인수가 필요하지만
        //delete, update, insert DML은 가져올 레코드가 없기 때문에 인수가 2개면 충분함
        con.query(sql,function(err, fields){
            if(err){
                console.log(err);
            }else{
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end("<script>alert('삭제완료');location.href='/member/list';</script>");
            }
            con.end();//mysql 접속 끊기
        });

    }