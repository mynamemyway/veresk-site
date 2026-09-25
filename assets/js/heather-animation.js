const canvas = document.getElementById('heatherFieldCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = 60;

let mouseX = -1000;
let scrollWind = 0;
let scrollTimeout;

// Отслеживаем мышку
window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

window.addEventListener('mouseleave', () => {
  mouseX = -1000;
});

// Отслеживаем скролл (усиливаем ветер при прокрутке)
window.addEventListener('scroll', () => {
  scrollWind = 15; // Сила наклона при скролле
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    scrollWind = 0;
  }, 150); // Как только скролл затих, ветер уходит
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = 60;
  initHeatherField();
});

class HeatherBush {
  constructor(x) {
    this.x = x;
    this.height = 25 + Math.random() * 20; // Сделал чуть выше для заметности
    this.speed = 0.01 + Math.random() * 0.01; 
    this.offset = Math.random() * Math.PI * 2;
    
    // Сделал цвета НАМНОГО ярче (opacity 0.8 - 1.0 вместо 0.5)
    const rand = Math.random();
    if (rand < 0.5) {
      this.flowerColor = `rgba(142, 110, 207, ${0.8 + Math.random() * 0.2})`; // Лиловый
    } else if (rand < 0.8) {
      this.flowerColor = `rgba(172, 134, 230, ${0.8 + Math.random() * 0.2})`; // Розово-лиловый
    } else {
      this.flowerColor = `rgba(46, 196, 182, ${0.7 + Math.random() * 0.3})`;  // Мятный
    }
    this.stemColor = 'rgba(120, 135, 130, 0.4)';

    // Генерируем фиксированные смещения для цветочков ОДИН РАЗ, чтобы они не мерцали
    this.flowers = [];
    for (let i = 0; i < 6; i++) {
      this.flowers.push({
        t: 0.3 + (i / 8), // Положение на стебле
        offsetX: (Math.random() - 0.5) * 3,
        offsetY: (Math.random() - 0.5) * 2,
        size: 1.5 + Math.random() * 1.5
      });
    }
  }

  draw(time) {
    // Базовый очень медленный фоновый ветер
    let wind = Math.sin(time * this.speed + this.offset) * 2;
    
    // Эффект от скролла (наклоняет всё поле)
    wind += scrollWind * Math.sin(time * 0.05 + this.offset * 0.1);

    // Эффект от мышки (трава отгибается от курсора в радиусе 80px)
    const distToMouse = Math.abs(this.x - mouseX);
    if (distToMouse < 80) {
      const force = (80 - distToMouse) / 80;
      const direction = this.x > mouseX ? 1 : -1;
      wind += direction * force * 12; // Сила отталкивания от мыши
    }
    
    // Отрисовка стебля
    ctx.beginPath();
    ctx.moveTo(this.x, height);
    const cpX = this.x + wind * 0.4;
    const cpY = height - this.height * 0.4;
    const endX = this.x + wind;
    const endY = height - this.height;
    
    ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    ctx.strokeStyle = this.stemColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Отрисовка статичных (не мерцающих) цветов
    this.flowers.forEach(f => {
      const fx = (1 - f.t) * (1 - f.t) * this.x + 2 * (1 - f.t) * f.t * cpX + f.t * f.t * endX + f.offsetX;
      const fy = (1 - f.t) * (1 - f.t) * height + 2 * (1 - f.t) * f.t * cpY + f.t * f.t * endY + f.offsetY;
      
      ctx.beginPath();
      ctx.arc(fx, fy, f.size, 0, Math.PI * 2);
      ctx.fillStyle = this.flowerColor;
      ctx.fill();
    });
  }
}

let bushes = [];
function initHeatherField() {
  bushes = [];
  // Кустики каждые 3 пикселя для красивой плотности
  for (let x = 0; x < width; x += 3) {
    bushes.push(new HeatherBush(x));
  }
}

let animTime = 0;
function renderField() {
  ctx.clearRect(0, 0, width, height);
  animTime++;
  
  bushes.forEach(bush => bush.draw(animTime * 0.5));
  requestAnimationFrame(renderField);
}

initHeatherField();
renderField();
