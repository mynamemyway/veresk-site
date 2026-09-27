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

      document.getElementById('v2-total-price').textContent = formatRub(total);

      // Гарантия меняется в зависимости от типа обработки
      const guarantee = type === 'full'
          ? 'Гарантийное обслуживание: бесплатно в течение 6 мес.'
          : 'Повторный вызов - 50% от стоимости обработки';
      document.getElementById('v2-guarantee').textContent = guarantee;
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

  document.querySelectorAll('#v2-phys .v2-check input').forEach(el => el.addEventListener('change', calcV2Phys));

  const v2BizEls = document.querySelectorAll('#v2-biz input, #v2-biz select');
  v2BizEls.forEach(el => el.addEventListener('change', calcV2Biz));
  calcV2Phys();

});
