/**
Node.js자체적으로 지원하는 전역변수임

__filename (언더바 두개)
    지금 실행중이 js파일의 경로를 담고 있는 변수

__dirname (언더바 두개)
    지금 실행중인 디렉토리의 경로를 담고 있는 변수

 */

console.log("지금 실행중인 js 파일", __filename);
console.log("지금 실행중인 js 파일의 디렉토리는", __dirname);