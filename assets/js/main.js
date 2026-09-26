document.addEventListener('DOMContentLoaded', () => {
  
  // Логика главных табов (Насекомые / Грызуны)
  const tabButtons = document.querySelectorAll('.tab-nav-btn');
  const priceGrids = document.querySelectorAll('.prices-grid');

  // Сброс мини-табов карточки «Организации» на вариант по умолчанию («Базовый»)
  const resetMiniTabs = (grid) => {
    const card = grid.querySelector('.b2b-combined-card');
    if (!card) return;

    card.querySelectorAll('.mini-tab-btn').forEach(btn => btn.classList.remove('active'));
    card.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('active'));

    const defaultBtn = card.querySelector('.mini-tab-btn[data-default]');
    defaultBtn.classList.add('active');
    document.getElementById(`subtab-${defaultBtn.getAttribute('data-subtab')}`).classList.add('active');
  };

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      priceGrids.forEach(grid => grid.classList.remove('active'));

      button.classList.add('active');
      const grid = document.getElementById(`tab-${targetTab}`);
      grid.classList.add('active');
      resetMiniTabs(grid);
    });
  });

  // Логика внутренних мини-табов (Базовый / Гель) — изолированно внутри своей карточки
  document.querySelectorAll('.mini-tab-btn').forEach(miniBtn => {
    miniBtn.addEventListener('click', () => {
      const card = miniBtn.closest('.price-card');

      card.querySelectorAll('.mini-tab-btn').forEach(btn => btn.classList.remove('active'));
      card.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('active'));

      miniBtn.classList.add('active');
      document.getElementById(`subtab-${miniBtn.getAttribute('data-subtab')}`).classList.add('active');
    });
  });

  // Логика вкладок альтернативного модуля v2 (Физические / Юридические лица)
  const v2Tabs = document.querySelectorAll('.v2-tab-btn');
  const v2Grids = document.querySelectorAll('.v2-grid');

  v2Tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      v2Tabs.forEach(b => b.classList.remove('active'));
      v2Grids.forEach(g => g.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`v2-${btn.getAttribute('data-v2')}`).classList.add('active');
    });
  });

  // Калькулятор для вкладки «Физические лица»
  // Цены из docs/price-new.md: насекомые / грызуны × частичная / полная.
  const v2Prices = {
      insects: { partial: { 1: 6000, 2: 7500, 3: 9000, 4: 10500, 5: 12000 },
                 full:    { 1: 7500, 2: 9000, 3: 10500, 4: 12000, 5: 13500 } },
      rodents: { partial: { 1: 5000, 2: 6000, 3: 7000, 4: 8000, 5: 9000 },
                 full:    { 1: 6000, 2: 7500, 3: 9000, 4: 10500, 5: 12000 } }
  };

  // Метраж → количество комнат (эвристика для оценки квартиры).
  const areaToRooms = (area) => {
      if (area < 40) return 1;
      if (area < 55) return 2;
      if (area < 70) return 3;
      if (area < 85) return 4;
      return 5;
  };

  const formatRub = (n) => Math.round(n).toLocaleString('ru-RU') + ' ₽';

  const calcV2Phys = () => {
      const pest = document.querySelector('input[name="v2-pest"]:checked').value;
      const type = document.querySelector('input[name="v2-type"]:checked').value;
      const areaEl = document.getElementById('v2-area').value.trim();
      const roomsEl = parseInt(document.getElementById('v2-rooms').value, 10);

      // Метраж приоритетнее выпадающего списка комнат.
      const rooms = areaEl ? areaToRooms(parseFloat(areaEl)) : roomsEl;

      // Для плесени/запахов точной таблицы нет — фиксированная оценка.
      let base;
      if (pest === 'insects' || pest === 'rodents') {
          base = v2Prices[pest][type][rooms];
      } else {
          base = 10000;
      }

      let total = base;

      document.querySelectorAll('.v2-calc input[type="checkbox"]').forEach(cb => {
          if (!cb.checked) return;
          if (cb.dataset.gel) {
              total *= 1.2;
          } else if (cb.dataset.add) {
              total += parseInt(cb.dataset.add, 10);
          }
      });

      document.getElementById('v2-total-price').textContent = formatRub(total);
  };

  const calcV2Biz = () => {
      const rate = parseInt(document.getElementById('v2-biz-range').value, 10);
      let finalRate = rate;

      document.querySelectorAll('#v2-biz input[type="checkbox"]').forEach(cb => {
          if (cb.checked && cb.dataset.gel) finalRate = rate * 1.2;
      });

      document.getElementById('v2-total-biz').textContent =
          'от ' + (finalRate % 1 === 0 ? finalRate : finalRate.toFixed(1)) + ' ₽ / м²';
  };

  const v2PhysEls = document.querySelectorAll('#v2-phys input, #v2-phys select');
  v2PhysEls.forEach(el => el.addEventListener('change', calcV2Phys));
  document.getElementById('v2-area').addEventListener('input', calcV2Phys);

  const v2BizEls = document.querySelectorAll('#v2-biz input, #v2-biz select');
  v2BizEls.forEach(el => el.addEventListener('change', calcV2Biz));
  calcV2Phys();

});
