class Hero extends GameObject{
    constructor(container, src, width, height, x, y, velX, velY){
        super(container, src, width, height, x, y, velX, velY);
        this.g=0.5;//중력 가속도 효과를 위한 변수
        this.jump=false;
    }
    //히어로는 움직임이 있다, 따라서 메서드 정의가 요구된다.
    //그렇지만 부모에게 물려받은 메서드가, 현재 나의 상황에 맞지 않을경우
    //업그레이드 할 필요가 있다. 이러한 재정의 기법을 가리켜 오버라이딩 이라고 한다.

    tick(){
        this.velY += this.g;
        this.y=this.y+this.velY;
        this.x=this.x+this.velX;

        //블럭과 주인공이 닿았는지 체크
        for(var i=0;i<blockArray.length;i++){
            var onBlock=collisionCheck(this.img,blockArray[i].img);
            if(onBlock && this.jump==false){
                this.velY=0;
                this.y=blockArray[i].y-this.height;
            }
            //주인공이 점프한 이후, 다시 하강하는 순간을 포착하여 벽돌위에 서 일을 수 있는
            //핵심 변수인 this.jump를 다시 false로 돌리놓자
            if(this.velY>0){
                this.jump=false;
            }
        }
        

    }
    render(){
        this.img.style.top=this.y+"px";
        this.img.style.left=this.x+"px";
    }
}