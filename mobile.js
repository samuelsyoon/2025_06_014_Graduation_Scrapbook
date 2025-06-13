let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    paper.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener("touchstart", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });
    paper.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch screens
    paper.addEventListener("gesturestart", (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener("gestureend", () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

let selectedPaper = null;

// Click to select a paper
papers.forEach((paper) => {
  paper.addEventListener("mousedown", (e) => {
    selectedPaper = paper;
    paper.style.zIndex = highestZ;
    highestZ += 1;
  });
  // For touch devices, select on touchstart as well
  paper.addEventListener("touchstart", (e) => {
    selectedPaper = paper;
    paper.style.zIndex = highestZ;
    highestZ += 1;
  });
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!selectedPaper) return;

  // Find the Paper instance for the selected element
  const paperIndex = papers.indexOf(selectedPaper);
  if (paperIndex === -1) return;
  const paperObj = papersObjs[paperIndex];

  const moveAmount = 10;
  const rotateAmount = 5;

  if (e.shiftKey) {
    // Rotate with Shift + Left/Right
    if (e.key === "ArrowLeft") {
      paperObj.rotation -= rotateAmount;
    } else if (e.key === "ArrowRight") {
      paperObj.rotation += rotateAmount;
    }
  } else {
    // Move with arrows
    if (e.key === "ArrowLeft") {
      paperObj.currentPaperX -= moveAmount;
    } else if (e.key === "ArrowRight") {
      paperObj.currentPaperX += moveAmount;
    } else if (e.key === "ArrowUp") {
      paperObj.currentPaperY -= moveAmount;
    } else if (e.key === "ArrowDown") {
      paperObj.currentPaperY += moveAmount;
    }
  }

  selectedPaper.style.transform = `translateX(${paperObj.currentPaperX}px) translateY(${paperObj.currentPaperY}px) rotateZ(${paperObj.rotation}deg)`;
});

// Keep track of Paper instances
const papersObjs = [];
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
  papersObjs.push(p);
});
