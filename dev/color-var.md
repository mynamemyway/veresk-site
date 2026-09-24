```css - серые преимущества, белая граница
        /* Светлая тема — Вереск зелёный */
        :root {
            --site-bg: radial-gradient(circle at 80% 20%, #f8fafc 0%, #f1f5f9 100%);
            --text-main: #0f172a;
            --text-muted: #64748b;
            --text-light: #94a3b8;

            /* Зелёный Вереск */
            --accent-color: #26AA99;
            --accent-hover: #0f766e;
            --accent-soft: rgba(13, 148, 136, 0.08);
            --btn-text: #ffffff;

            /* Конструкция сетки */
            --border-grid: #f8fafc;
            --border-glass: rgba(15, 23, 42, 0.08);
            --card-bg: #cbd5e1;
            --header-bg: transparent;
            --line-color: #cbd5e1;

            /* Настройки графики и радиусов */
            --radius-main: 1.5rem;
            --radius-asym: 2rem 0.5rem 2rem 2rem;
            --hero-image: url('assets/pack1/0.png');
        
            /* Оригинальные мягкие воздушные тени */
            --shadow-img: 0 15px 30px rgba(15, 23, 42, 0.04);
            --shadow-cta: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
        }
```

```css - светло-лиловые преимущества
        /* Светлая тема — Вереск зелёный */
        :root {
            --site-bg: radial-gradient(circle at 80% 20%, #f8fafc 0%, #f1f5f9 100%);
            --text-main: #0f172a;
            --text-muted: #64748b;
            --text-light: #f8fafc;

            /* Зелёный Вереск */
            --accent-color: #26AA99;
            --accent-hover: #0f766e;
            --accent-soft: rgba(13, 148, 136, 0.08);
            --btn-text: #ffffff;

            /* Конструкция сетки */
            --border-grid: #cbd5e1;
            --border-glass: rgba(15, 23, 42, 0.08);
            --card-bg: #9B6FD144;
            --header-bg: transparent;
            --line-color: #cbd5e1;

            /* Настройки графики и радиусов */
            --radius-main: 1.5rem;
            --radius-asym: 2rem 0.5rem 2rem 2rem;
            --hero-image: url('assets/pack1/0.png');
        
            /* Оригинальные мягкие воздушные тени */
            --shadow-img: 0 15px 30px rgba(15, 23, 42, 0.04);
            --shadow-cta: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
        }
        
        /* Тёмная тема — Вереск фиолетовый */
        body.dark-theme {
            --site-bg: radial-gradient(circle at 80% 20%, #1a1c1e 0%, #0f1011 100%);
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --text-light: #64748b;

            /* Фиолетовый Вереск #7c3aed */
            --accent-color: #a78bfa;
            --accent-hover: #0f766e;
            --accent-soft: rgba(139, 92, 246, 0.1);
            --btn-text: #ffffff;

            /* Конструкция сетки */
            --border-grid: rgba(255, 255, 255, 0.08);
            --border-glass: rgba(255, 255, 255, 0.08);
            --card-bg: #0F1011;
            --card-cta-bg: #141617;
            --header-bg: transparent;
            --line-color: rgba(255, 255, 255, 0.05);
        
            /* Оригинальные глубокие, но мягкие тени с большим размытием */
            --shadow-img: 0 20px 40px rgba(0, 0, 0, 0.3);
            --shadow-cta: 0 30px 60px rgba(0, 0, 0, 0.4);
        }
```