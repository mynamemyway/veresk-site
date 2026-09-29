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

  const formatRub = (n) => Math.round(n).toLocaleString('ru-RU') + ' ₽';

  // Выбор кнопки внутри своего сегмента
  const activateSeg = (btn) => {
      const group = btn.closest('.v2-seg');
      group.querySelectorAll('.v2-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
  };

  document.querySelectorAll('.v2-seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          activateSeg(btn);
          calcV2Phys();
          calcV2Biz();
      });
  });

  const calcV2Phys = () => {
      const pest = document.querySelector('.v2-seg-btn[data-pest].active').getAttribute('data-pest');
      const type = document.querySelector('.v2-seg-btn[data-type].active').getAttribute('data-type');
      const rooms = parseInt(document.querySelector('.v2-seg-btn[data-rooms].active').getAttribute('data-rooms'), 10);

      const base = v2Prices[pest][type][rooms];
      let total = base;

      document.querySelectorAll('#v2-phys .v2-check input[type="checkbox"]').forEach(cb => {
          if (!cb.checked) return;
          if (cb.dataset.gel) {
              total *= 1.2;
          } else if (cb.dataset.add) {
              total += parseInt(cb.dataset.add, 10);
          }
      });

      // Разовая обработка: −50%, но не менее 3500 (насекомые) / 3000 (грызуны)
      const once = document.querySelector('#v2-phys .v2-check input[data-once="1"]').checked;
      if (once) {
          total = Math.max(Math.round(total * 0.5), pest === 'rodents' ? 3000 : 3500);
      }

      document.getElementById('v2-total-price').textContent = formatRub(total);

      // Гарантия меняется в зависимости от типа обработки
const guarantee = once
          ? 'Гарантийное обслуживание: -'
          : type === 'full'
              ? 'Гарантийное обслуживание: 6 месяцев'
              : 'Повторный вызов - 50% от стоимости обработки';
      document.getElementById('v2-guarantee').textContent = guarantee;
  };

  const bizRates = [
      [200, 37], [300, 36], [400, 35], [500, 34], [600, 33],
      [700, 32], [800, 31], [900, 30], [1000, 29], [1500, 28],
      [2000, 27], [3000, 26], [4000, 25], [5000, 24], [6000, 23],
      [7000, 22], [8000, 21], [9000, 20], [10000, 19], [Infinity, 18],
  ];

  const calcV2Biz = () => {
      const area = parseFloat(document.getElementById('v2-biz-area').value);
      const totalEl = document.getElementById('v2-total-biz');
      const guaranteeEl = document.getElementById('v2-biz-guarantee');
      const bizPest = document.querySelector('#v2-biz .v2-seg-btn[data-pest].active').getAttribute('data-pest');
      const minOrder = bizPest === 'rodents' ? 5000 : 6000;
      const annual = document.querySelector('#v2-biz input[data-annual="1"]').checked;
      const orderText = annual
          ? 'Гарантийное обслуживание: 12 месяцев'
          : 'мин. заказ ' + minOrder.toLocaleString('ru-RU') + ' ₽';

      // Опции надбавок: только для насекомых
      const insectOnly = bizPest === 'insects';
      document.querySelectorAll('#v2-biz .v2-insect-only').forEach(label => {
          const cb = label.querySelector('input');
          if (!insectOnly) cb.checked = false;
          label.style.display = insectOnly ? '' : 'none';
      });

      if (Number.isNaN(area)) {
          totalEl.textContent = '—';
          guaranteeEl.textContent = orderText;
          return;
      }

      let baseRate = bizRates.find(([max]) => area <= max)[1];
      let flat = 0;
      let surcharges = 0;

      document.querySelectorAll('#v2-biz input[type="checkbox"]').forEach(cb => {
          if (!cb.checked) return;
          if (cb.dataset.gel || cb.dataset.ceil || cb.dataset.complex) surcharges += 1;
          if (cb.dataset.add) flat += parseInt(cb.dataset.add, 10);
      });

      // Сначала базовая стоимость с полом, затем наценки опций всегда поверх
      const base = annual
          ? Math.max(2 * baseRate * area, bizPest === 'rodents' ? 10000 : 12000)
          : Math.max(baseRate * area, minOrder);
      const total = base * Math.pow(1.2, surcharges) + flat;
      const perM2 = total / area;
      const perM2Str = perM2 % 1 === 0 ? perM2 : perM2.toFixed(1);
      totalEl.textContent = formatRub(total);
      document.getElementById('v2-biz-rate').textContent = perM2Str + ' ₽ / м²';
      guaranteeEl.textContent = orderText;
  };

  document.querySelectorAll('#v2-phys .v2-check input').forEach(el => el.addEventListener('change', calcV2Phys));

  const v2BizEls = document.querySelectorAll('#v2-biz input');
  v2BizEls.forEach(el => {
      el.addEventListener('change', calcV2Biz);
      if (el.type === 'number') el.addEventListener('input', calcV2Biz);
  });
  calcV2Phys();
  calcV2Biz();

  // Выравнивание высот вкладок v2: обе панели получают общий min-height,
  // чтобы переключение не двигало блок ни на пиксель.
  const equalizeV2Panels = () => {
      const panels = Array.from(document.querySelectorAll('.v2-grid'));
      if (panels.length < 2) return;

      const activeBtn = document.querySelector('.v2-tab-btn.active');
      const activePanel = activeBtn ? document.getElementById('v2-' + activeBtn.getAttribute('data-v2')) : null;

      panels.forEach(p => p.classList.add('active'));
      const height = Math.max(...panels.map(p => p.offsetHeight));
      panels.forEach(p => {
          p.style.minHeight = height + 'px';
          p.classList.remove('active');
      });

      if (activePanel) activePanel.classList.add('active');
  };

  equalizeV2Panels();
  window.addEventListener('load', equalizeV2Panels);

  let resizeTimer;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(equalizeV2Panels, 100);
  });

});
