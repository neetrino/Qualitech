export type NavItem = {
  readonly label: string;
  readonly href: string;
};

export type HeroStat = {
  readonly value: string;
  readonly label: string;
};

export type SolutionCard = {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly imageSrc: string;
};

export type AdvantageCard = {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly iconSrc: string;
};

export type ArticleCard = {
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly readTime: string;
  readonly imageSrc: string;
  readonly dateIconSrc: string;
  readonly timeIconSrc: string;
  readonly arrowIconSrc: string;
};

export type FooterSection = {
  readonly title: string;
  readonly links: readonly string[];
};

export const homeAssets = {
  heroBackdrop: "/home/i-mg-ch-at-gp-ti-ma-ge-ap-r12026-at023607-pm1.png",
  robotArm: "/home/i-mg-de-si-gn-st-ud-ie-s07-ro-bo-ti-ca-rm3.png",
  heroGlow: "/home/i-mg-el-li-ps-e14.svg",
  headerLogo: "/home/i-mg-la-ye-r2.svg",
  footerLogo: "/home/i-mg-la-ye-r1.svg",
  languageIcon: "/home/i-mg-gr-ou-p70643.svg",
  languageAccent: "/home/i-mg-ve-ct-or.svg",
  languageArrow: "/home/i-mg-ar-ro-w2.svg",
  primaryArrow: "/home/i-mg-ic-on6.svg",
  linkArrow: "/home/i-mg-ic-on.svg",
  linkArrowAlt: "/home/i-mg-ic-on1.svg",
  playIcon: "/home/i-mg-ic-on11.svg",
  locationIcon: "/home/i-mg-ic-on12.svg",
  phoneIcon: "/home/i-mg-ic-on13.svg",
  emailIcon: "/home/i-mg-ic-on14.svg",
  socialIcons: [
    "/home/i-mg-ic-on15.svg",
    "/home/i-mg-ic-on16.svg",
    "/home/i-mg-ic-on17.svg",
    "/home/i-mg-ic-on18.svg",
  ] as const,
} as const;

export const navItems: readonly NavItem[] = [
  { label: "Главная", href: "#hero" },
  { label: "Станки", href: "#solutions" },
  { label: "О нас", href: "#about" },
  { label: "Блог", href: "#insights" },
  { label: "Связь", href: "#footer" },
] as const;

export const heroStats: readonly HeroStat[] = [
  { value: "25+", label: "Лет опыта" },
  { value: "500+", label: "завершенных проектов" },
  { value: "98%", label: "удовлетворенность" },
] as const;

export const solutionCards: readonly SolutionCard[] = [
  {
    index: "01",
    title: "Центр прецизионной обработки с ЧПУ",
    description:
      "Усовершенствованная компьютерная система числового управления для высокоточного производства. Идеально подходит для выпуска сложных деталей с исключительной точностью и повторяемостью.",
    bullets: [
      "5-осевая возможность",
      "Высокоскоростной шпиндель",
      "Автоматическая смена инструмента",
    ],
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k.jpg",
  },
  {
    index: "02",
    title: "Промышленная роботизированная система",
    description:
      "Полностью автоматизированное роботизированное решение для сборки, сварки и обработки материалов. Повышает производительность при сохранении стабильных стандартов качества.",
    bullets: [
      "6 степеней свободы",
      "Видение на основе искусственного интеллекта",
      "Совместный режим",
    ],
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k1.jpg",
  },
  {
    index: "03",
    title: "Система лазерной резки и гравировки",
    description:
      "Современная волоконная лазерная технология для резки и гравировки различных материалов. Идеально подходит для точной металлообработки и индивидуального изготовления.",
    bullets: [
      "Сверхбыстрая обработка",
      "Поддержка нескольких материалов",
      "Точная резка",
    ],
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k2.jpg",
  },
] as const;

export const aboutParagraphs: readonly string[] = [
  "С 2001 года Qualitech Machinery находится в авангарде промышленных инноваций. Наше стремление к совершенству и точному машиностроению сделало нас надежным партнером во всем мире.",
  "Мы сочетаем традиционное мастерство с современными технологиями для создания оборудования, отвечающего строгим требованиям современной промышленной среды. Каждая машина проходит строгую проверку качества.",
  "Наша команда опытных инженеров и технических специалистов неустанно работает над инновациями, обеспечивая нашим клиентам всегда доступ к самым передовым решениям.",
] as const;

export const aboutHighlights = [
  { value: "ИСО 9001", label: "Сертифицированное качество" },
  { value: "24/7", label: "Поддерживать" },
] as const;

export const advantageCards: readonly AdvantageCard[] = [
  {
    index: "01",
    title: "Премиальное качество",
    description:
      "Каждая машина изготовлена по самым высоким стандартам с использованием высококачественных материалов и передовых технологий.",
    iconSrc: "/home/i-mg-ic-on2.svg",
  },
  {
    index: "02",
    title: "Надежный и долговечный",
    description:
      "Наше оборудование рассчитано на непрерывную работу в сложных промышленных условиях.",
    iconSrc: "/home/i-mg-ic-on3.svg",
  },
  {
    index: "03",
    title: "Экспертная поддержка",
    description:
      "Комплексная техническая поддержка и сервисное обслуживание, предоставляемое опытными инженерами.",
    iconSrc: "/home/i-mg-ic-on4.svg",
  },
  {
    index: "04",
    title: "Инновационные решения",
    description:
      "Будьте впереди благодаря расширенным функциям автоматизации и интеграции интеллектуальных технологий.",
    iconSrc: "/home/i-mg-ic-on5.svg",
  },
] as const;

export const articleCards: readonly ArticleCard[] = [
  {
    category: "Технология",
    title: "Будущее промышленной автоматизации: ИИ и машинное обучение",
    description:
      "Изучаем, как искусственный интеллект меняет производственные процессы и какое значение это имеет для будущего.",
    date: "12 марта 2026 г.",
    readTime: "5 минут",
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k3.jpg",
    dateIconSrc: "/home/i-mg-ic-on7.svg",
    timeIconSrc: "/home/i-mg-ic-on8.svg",
    arrowIconSrc: "/home/i-mg-ic-on.svg",
  },
  {
    category: "Обслуживание",
    title: "Рекомендации по техническому обслуживанию оборудования с ЧПУ",
    description:
      "Важные советы и рекомендации по обслуживанию вашего оборудования с ЧПУ для обеспечения его оптимальной производительности.",
    date: "8 марта 2026 г.",
    readTime: "7 мин.",
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k4.jpg",
    dateIconSrc: "/home/i-mg-ic-on7.svg",
    timeIconSrc: "/home/i-mg-ic-on8.svg",
    arrowIconSrc: "/home/i-mg-ic-on.svg",
  },
  {
    category: "Автоматизация",
    title: "Оптимизация производственных линий с помощью робототехники",
    description:
      "Узнайте, как интеграция роботизированных систем может значительно повысить эффективность и сократить расходы.",
    date: "5 марта 2026 г.",
    readTime: "6 мин",
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k5.jpg",
    dateIconSrc: "/home/i-mg-ic-on9.svg",
    timeIconSrc: "/home/i-mg-ic-on10.svg",
    arrowIconSrc: "/home/i-mg-ic-on1.svg",
  },
  {
    category: "Инновации",
    title: "Использование дополненной реальности для углубленного обучения на производстве",
    description:
      "Узнайте, как инструменты дополненной реальности меняют обучение сотрудников, предоставляя иммерсивный практический опыт обучения.",
    date: "10 марта 2026 г.",
    readTime: "8 мин",
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k3.jpg",
    dateIconSrc: "/home/i-mg-ic-on9.svg",
    timeIconSrc: "/home/i-mg-ic-on10.svg",
    arrowIconSrc: "/home/i-mg-ic-on1.svg",
  },
] as const;

export const footerSections: readonly FooterSection[] = [
  { title: "Быстрые ссылки", links: ["Станки", "О нас", "Блог", "Контакты"] },
  {
    title: "Услуги",
    links: [
      "Обработка с использованием систем ЧПУ",
      "Роботизированная автоматизация",
      "Лазерная резка",
      "Техническое обслуживание",
      "Поддержка",
    ],
  },
] as const;

export const legalLinks = [
  "Политика Конфиденциальности",
  "Политика Доставки",
  "Пользовательское Соглашение",
  "Политика Полбзования",
] as const;
