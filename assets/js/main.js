
document.addEventListener('DOMContentLoaded', () => {
  
  // Логика главных табов (Насекомые / Грызуны / Запахи)
  const tabButtons = document.querySelectorAll('.tab-nav-btn');
  const priceGrids = document.querySelectorAll('.prices-grid');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      priceGrids.forEach(grid => grid.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });

  // Логика внутренних мини-табов (Бизнес / Участки в 3-й карточке)
  const miniTabButtons = document.querySelectorAll('.mini-tab-btn');
  const subtabContents = document.querySelectorAll('.subtab-content');

  miniTabButtons.forEach(miniBtn => {
    miniBtn.addEventListener('click', () => {
      const targetSubtab = miniBtn.getAttribute('data-subtab');

      miniTabButtons.forEach(btn => btn.classList.remove('active'));
      subtabContents.forEach(content => content.classList.remove('active'));

      miniBtn.classList.add('active');
      document.getElementById(`subtab-${targetSubtab}`).classList.add('active');
    });
  });

});
