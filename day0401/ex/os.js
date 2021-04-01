/*
node.js에 내장된 여러 모듈 중 os 모듈을 사용해보자!
중요하지는 않지만 단지 모듈을 가져올떄 익숙해지기 위한 연습
*/

var os = require("os");
console.log("호스트의 이름",os.hostname);
console.log("운영체제 버전",os.release);
console.log("운영체제 실행된 시간",os.uptime());

