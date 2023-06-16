let heighestZ= 1;


class Paper {

    holdingPaper = false;
    prevMouseX = 0;
    PrevMouseY = 0;

    mouseX = 0;
    mouseY = 0;

    velocityX = 0;
    velocityY = 0;

    currentPaperX = 0;
    currentPaperY = 0;

    init(paper) {
        paper.addEventListener('mousedown', (e) => {
            
            this.holdingPaper= true;

            paper.style.zIndex = heighestZ;
            heighestZ+=1;

            if(e.button === 0){ /* 0->left button*/
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
                console.log(this.prevMouseX);
                console.log(this.PrevMouseY);

            }


        });

        document.addEventListener('mousemove', (e) => {
            //console.log('Mouse is moving');
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.velocityX = this.mouseX - this.prevMouseX;
            this.velocityY = this.mouseY - this.prevMouseY;

            if(this.holdingPaper==true){

                this.currentPaperX+=this.velocityX;
                this.currentPaperY+=this.velocityY;

                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px)`;


            }

        });

        window.addEventListener('mouseup' , (e)=>{
            //console.log('mouse button is released');
            this.holdingPaper= false;

        });
    }

}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper(paper);
    p.init(paper);
});
