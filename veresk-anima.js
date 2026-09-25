const canvas = document.getElementById('heatherFieldCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = 60; // Высота нашего газона

// Переинициализация при изменении размеров экрана (адаптивность)
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = 60;
  initHeatherField();
});

class HeatherBush {
  constructor(x) {
    this.x = x;
    this.height = 20 + Math.random() * 20; // Высота отдельных травинок вереска
    this.speed = 0.015 + Math.random() * 0.02; // Скорость колыхания от ветра
    this.offset = Math.random() * Math.PI * 2; // Разнобой в движении, чтобы не качались синхронно
    
    // Распределение фирменных цветов бренда "Вереск"
    const rand = Math.random();
    if (rand < 0.5) {
      this.flowerColor = `rgba(142, 110, 207, ${0.5 + Math.random() * 0.4})`; // Лиловый
    } else if (rand < 0.8) {
      this.flowerColor = `rgba(172, 134, 230, ${0.5 + Math.random() * 0.4})`; // Розово-лиловый
    } else {
      this.flowerColor = `rgba(46, 196, 182, ${0.4 + Math.random() * 0.4})`;  // Мятно-зеленый
    }
    this.stemColor = 'rgba(120, 135, 130, 0.25)'; // Приглушенные веточки
  }

  draw(time) {
    // Математика ветра (плавный синус)
    const wind = Math.sin(time * this.speed + this.offset) * 4;
    
    // Рисуем стебель кустика
    ctx.beginPath();
    ctx.moveTo(this.x, height);
    const cpX = this.x + wind * 0.4;
    const cpY = height - this.height * 0.4;
    const endX = this.x + wind;
    const endY = height - this.height;
    
    ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    ctx.strokeStyle = this.stemColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Нанизываем мелкие вересковые соцветия (как точки на кустике)
    for (let i = 0; i < 5; i++) {
      const t = 0.4 + (i / 8); // Соцветия только на верхней части веточки
      const fx = (1-t)*(1-t)*this.x + 2*(1-t)*t*cpX + t*t*endX;
      const fy = (1-t)*(1-t)*height + 2*(1-t)*t*cpY + t*t*endY;
      
      ctx.beginPath();
      // Крошечные цветки вереска
      ctx.arc(fx + (Math.random() - 0.5) * 1.5, fy, 1.2 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = this.flowerColor;
      ctx.fill();
    }
  }
}

let bushes = [];
function initHeatherField() {
  bushes = [];
  // Делаем плотный газон: кустик каждые 2 пикселя
  for (let x = 0; x < width; x += 2) {
    bushes.push(new HeatherBush(x));
  }
}

let animTime = 0;
function renderField() {
  ctx.clearRect(0, 0, width, height);
  animTime++;
  
  // Рендерим каждый кустик поля
  bushes.forEach(bush => bush.draw(animTime * 0.5));
  requestAnimationFrame(renderField);
}

// Поехали!
initHeatherField();
renderField();

