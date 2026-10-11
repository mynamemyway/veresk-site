const canvas = document.getElementById('heatherFieldCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = 60;

// ==== НАСТРОЙКА ГУСТОТЫ ПОЛЯ ВЕРЕСКА ====
const HEATHER_DENSITY_STEP = 3;   // шаг между кустиками, px (меньше — плотнее)
const BUSH_HEIGHT_MIN = 25;       // мин. высота кустика, px
const BUSH_HEIGHT_SPREAD = 20;    // случайный разброс высоты, px
const FLOWERS_PER_BUSH = 5;       // цветков на кустике
const MOUSE_RADIUS = 80;          // радиус расступания травы от курсора, px

// Разделили мышь на реальную (target) и плавную (smoothed) для эффекта задержки
let targetMouseX = -1000;
let smoothedMouseX = -1000;

let scrollWind = 0;
let scrollTimeout;

// Отслеживаем мышку
window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  targetMouseX = e.clientX - rect.left;
  
  // Убираем резкий скачок при первом входе мыши на канвас
  if (smoothedMouseX === -1000) smoothedMouseX = targetMouseX;
});

window.addEventListener('mouseleave', () => {
  targetMouseX = -1000;
});

// Отслеживаем скролл (усиливаем ветер при прокрутке)
window.addEventListener('scroll', () => {
  scrollWind = 2; // Сила наклона при скролле
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    scrollWind = 0;
  }, 150); // Как только скролл затих, ветер уходит
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = 60;
  initHeatherField();
  syncFieldPosition();
});

const fieldContainer = document.querySelector('.heather-field-container');
const heroBottomRow = document.querySelector('.hero-bottom-row');

// Универсальная адаптация полосы
function syncFieldPosition() {
  if (!fieldContainer || !heroBottomRow) return;
  const stripHeight = fieldContainer.offsetHeight || 60;
  const rowBottom = heroBottomRow.getBoundingClientRect().bottom + window.scrollY;
  const overlap = rowBottom > window.innerHeight - stripHeight;
  fieldContainer.classList.toggle('is-inflow', overlap);
}

window.addEventListener('load', syncFieldPosition);

class HeatherBush {
  constructor(x) {
    this.x = x;
    this.height = BUSH_HEIGHT_MIN + Math.random() * BUSH_HEIGHT_SPREAD; // Высота из настроек выше
    this.speed = 0.01 + Math.random() * 0.01; 
    this.offset = Math.random() * Math.PI * 2;
    
    // Цвета из твоей оригинальной версии
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
    for (let i = 0; i < FLOWERS_PER_BUSH; i++) {
      this.flowers.push({
        t: 0.3 + (i / (FLOWERS_PER_BUSH + 2)), // Положение на стебле (шаг подстроен под число цветков)
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

    // Эффект от мышки теперь рассчитывается от СГЛАЖЕННОЙ координаты (smoothedMouseX)
    const distToMouse = Math.abs(this.x - smoothedMouseX);
    if (distToMouse < MOUSE_RADIUS) {
      const force = (MOUSE_RADIUS - distToMouse) / MOUSE_RADIUS;
      const direction = this.x > smoothedMouseX ? 1 : -1;
      wind += direction * force * 10; // Сила отталкивания от мыши
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
  // Кустики каждые HEATHER_DENSITY_STEP пикселей — плотность поля
  for (let x = 0; x < width; x += HEATHER_DENSITY_STEP) {
    bushes.push(new HeatherBush(x));
  }
}

let animTime = 0;
function renderField() {
  ctx.clearRect(0, 0, width, height);
  animTime++;
  
  // Математика задержки (Линейная интерполяция / LERP)
  // smoothedMouseX плавно догоняет targetMouseX на 7% расстояния за кадр
  if (targetMouseX === -1000) {
    smoothedMouseX += (-1000 - smoothedMouseX) * 0.07;
  } else {
    smoothedMouseX += (targetMouseX - smoothedMouseX) * 0.07;
  }
  
  bushes.forEach(bush => bush.draw(animTime * 0.5));
  requestAnimationFrame(renderField);
}

syncFieldPosition();
initHeatherField();
renderField();
