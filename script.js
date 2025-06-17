const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

// Create Particle class
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    // this.speedX = (Math.random() * 0.4 - 0.2) * 2;
    // this.speedY = (Math.random() * 0.4 - 0.2) * 2;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fill();
  }

  // Check particle position, check mouse position, move the particle, draw the particle
  
  update() {
    //check if particle is still within canvas
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // check collision detection - mouse position / particle position
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size) {
            this.x += 5;
            this.directionX = -this.directionX;
        }
        if (mouse.x > this.x && this.x > this.size) {
            this.x -= 5;
            this.directionX = -this.directionX;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size) {
            this.y += 5;
            this.directionY = -this.directionY;
        }
        if (mouse.y > this.y && this.y > this.size) {
            this.y -= 5;
            this.directionY = -this.directionY;
        }
    }
    // move the particle
        this.x += this.directionX;
        this.y += this.directionY;
    // draw the particle
    this.draw();
  }
}
  
function initParticles() {
    particlesArray = [];
    numberOfParticles = (canvas.height * canvas.width) / 2000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 5 + 1;
      let x = Math.random() * (innerWidth - size * 2) ;
      let y = Math.random() * (innerHeight - size * 2) ;
      let directionX = (Math.random() * 0.4 - 0.2) * 10;
      let directionY = (Math.random() * 0.4 - 0.2) * 10;
      let color = '#8C5523';
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  requestAnimationFrame(animateParticles);
  connectParticles();
}

// Check if particles are close enough to draw a line between them
function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        opacityValue = 1 - distance / 10000;
        if (distance < Math.sqrt((canvas.width / 7) * (canvas.height / 7))) {
            ctx.strokeStyle = 'rgba(140, 85, 35, ' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
        }
        }
    }
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.width / 80);
    initParticles();
});





initParticles();
animateParticles();

// setInterval(connectParticles, 1000 / 60); // Call connectParticles at 60 FPS

