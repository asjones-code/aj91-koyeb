// Create a canvas element but do not append it to the DOM
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// Assuming .us-canvas is a <canvas> element
const ucanvas = document.querySelector('.us-canvas');
const footer = document.querySelector('footer');

// Convert the canvas content to a data URL
const canvasBackground = canvas.toDataURL();

// Apply the canvas background to the footer

// Function to resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particleArray = [];
for (let i = 0; i < 100; i++) {
  particleArray.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
    if (particleArray[i].size <= 0.2) {
      particleArray.splice(i, 1);
      i--;
      particleArray.push(new Particle());
    }
  }
  requestAnimationFrame(animate);
}

animate();

UnicornStudio.init().then(scenes => {
  const layer = scenes[0].layers[1];
  layer.getPlane().loadCanvas(canvas, {
    premultipliedAlpha: true,
    sampler: 'uTexture',
  }, tex => {
    layer.preloadedCanvasTexture = tex;
  });
});

window.addEventListener('resize', resizeCanvas);
footer.style.backgroundImage = `url(${canvasBackground})`;

console.log('here')