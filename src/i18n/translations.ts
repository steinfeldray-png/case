export const t = {
  ru: {
    // Header nav
    nav_cases: 'Кейсы',
    nav_about: 'Обо мне',
    nav_back: 'Назад',
    // Hero
    location: 'Москва, Россия',
    // Project cards
    label_product: 'Продукт',
    label_platform: 'Платформа',
    in_progress: 'В работе',
    no_projects: 'Проекты не найдены',
    // About section
    about_title: 'Обо мне',
    about_default_1: 'Продуктовый дизайнер с фокусом на B2B e-commerce и внутренние сервисы. Проектирую сложные сценарии с высокой бизнес-нагрузкой и помогаю командам принимать решения на основе данных.',
    about_default_2: 'Работаю по полному циклу: от исследования и формирования гипотез до прототипирования, запуска и итераций на основе метрик. Участвую в discovery, приоритизации задач и формировании roadmap вместе с PM и аналитикой.',
    about_default_3: 'Использую аналитику, интервью и A/B-тесты, чтобы улучшать продукт измеримо. Выстраиваю дизайн-системы, веду design review и слежу за качеством реализации.',
    // Case study
    case_not_found: 'Кейс не найден',
    back_home: 'Вернуться на главную',
    section_challenge: 'Задача',
    section_solution: 'Решение',
    section_results: 'Результаты',
    prev_project: 'Предыдущий проект',
    next_project: 'Следующий проект',
    img_fullsize: 'Полный размер',
  },
  en: {
    // Header nav
    nav_cases: 'Cases',
    nav_about: 'About',
    nav_back: 'Back',
    // Hero
    location: 'Moscow, Russia',
    // Project cards
    label_product: 'Product',
    label_platform: 'Platform',
    in_progress: 'In Progress',
    no_projects: 'No projects found',
    // About section
    about_title: 'About me',
    about_default_1: 'Product designer focused on B2B e-commerce and internal tools. I design complex workflows under heavy business load and help teams make data-driven decisions.',
    about_default_2: 'I work across the full cycle — from research and hypothesis definition to prototyping, launch and metric-based iterations. I participate in discovery, backlog prioritisation and roadmap shaping alongside PMs and analytics.',
    about_default_3: 'I use analytics, user interviews and A/B tests to improve the product in measurable ways. I build design systems, run design reviews and maintain implementation quality.',
    // Case study
    case_not_found: 'Case not found',
    back_home: 'Back to home',
    section_challenge: 'Challenge',
    section_solution: 'Solution',
    section_results: 'Results',
    prev_project: 'Previous project',
    next_project: 'Next project',
    img_fullsize: 'Full size',
  },
} as const;

export type TranslationKey = keyof typeof t.ru;
