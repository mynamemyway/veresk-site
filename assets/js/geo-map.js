/* Блок 7: карта зоны выезда.

   Виджет Яндекс.Карт грузится лениво — только когда секция приближается
   к экрану, иначе скрипт съедает стартовую загрузку страницы.
   Если API недоступен, ставим текстовую заглушку: пустой серый блок
   читается как поломка вёрстки. */
(() => {
    'use strict';

    const MAP_ID = 'geo-map';
    const container = document.getElementById(MAP_ID);
    if (!container) return;

    /* Фирменные цвета продублированы прямо в SVG: data-URI не умеет
       читать CSS-переменные. Держать синхронно с --btn-fill (#24AA99)
       и --accent-color (#785B9D). */
    const MARKER_SVG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">'
        + '<path d="M22 2C11.5 2 3 10.5 3 21c0 13 15.5 28.4 18.2 31a1 1 0 0 0 1.6 0'
        + 'C25.5 49.4 41 34 41 21 41 10.5 32.5 2 22 2z" fill="#24AA99" stroke="#fff" stroke-width="2.5"/>'
        + '<circle cx="22" cy="21" r="7.5" fill="#785B9D"/>'
        + '</svg>');

    const showFallback = () => {
        container.classList.add('geo-map--fallback');
        const note = document.createElement('p');
        note.className = 'geo-map-note';
        note.textContent = 'Карта зоны выезда сейчас недоступна. '
            + 'Позвоните — рассчитаем выезд по адресу.';
        container.replaceChildren(note);
    };

    let apiPromise = null;

    const loadApi = (key) => {
        if (apiPromise) return apiPromise;

        apiPromise = new Promise((resolve, reject) => {
            if (window.ymaps) {
                resolve(window.ymaps);
                return;
            }

            const params = new URLSearchParams({ lang: 'ru_RU', v: '2.1.79' });
            if (key) params.set('apikey', key);

            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?' + params;
            script.async = true;
            script.onload = () => (window.ymaps
                ? resolve(window.ymaps)
                : reject(new Error('скрипт загрузился, но API не отдал ymaps')));
            script.onerror = () => reject(new Error('скрипт Яндекс.Карт не загрузился'));
            document.head.appendChild(script);
        });

        return apiPromise;
    };

    const initMap = (ymaps) => {
        const [lat, lon] = (container.dataset.center || '59.9386,30.3141')
            .split(',')
            .map(Number);
        const zoom = Number(container.dataset.zoom) || 10;

        /* У Яндекс.Карт нет опции gestureHandling из Google Maps. Ближайший
           эквивалент — scrollZoom: 'hybrid': первый жест зумит карту,
           повторный возвращает прокрутку страницы, поэтому в карте нельзя
           застрять при скролле лендинга. */
        const map = new ymaps.Map(MAP_ID, {
            center: [lon, lat],
            zoom,
            scrollZoom: 'hybrid',
            controls: [],
        }, {
            /* Без этого Яндекс кладёт поверх карты блок «Откройте Яндекс.Карты»
               и он перехватывает все клики по карте */
            suppressMapOpenBlock: true,
        });

        const marker = new ymaps.Placemark([lon, lat], {}, {
            iconLayout: MARKER_SVG,
            iconSize: [44, 56],
            iconAnchor: [22, 56],
            labelLayout: '<div class="geo-map-label">ВЕРЕСК</div>',
        });
        marker.options.set('zIndex', 500);
        map.geoObjects.add(marker);
    };

    const boot = () => {
        loadApi(container.dataset.apiKey || '')
            .then((ymaps) => ymaps.ready(initMap))
            .catch((error) => {
                console.warn('[geo-map]', error.message);
                showFallback();
            });
    };

    if (!('IntersectionObserver' in window)) {
        boot();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        boot();
    }, { rootMargin: '400px' });

    observer.observe(container);
})();