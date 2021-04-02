/*
나의 메모리 영역 뿐만 아니라, human 이라는 객체의 인스턴스 메모리 영역도
내것처럼 쓰겠다. 즉, 확장하겠다.
*/

class BlackHuman extends Human{

    constructor(color){
        //바로 이 시점이 흑인이 태어나는 시점임으러, 다른 어떠한 코드보다도 앞서서 부모를 호출해야한다.

        // this.x=5;
        //에러 발생 : 부모의 초기화 보다 자식의 초기화가 앞설수는 없기 때문에 금지



        super(color);
        // console.log("자식 초기화 완료");
        console.log(color);
    }
    playBasketBall(){
        console.log("농구를한다");
    }
    palyBoxing(){
        console.log("복싱을한다");
    }
}