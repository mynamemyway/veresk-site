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

});
