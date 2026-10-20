import { publicSiteReadiness } from "@/content/site-settings";

export const brand = "OTAGAN VELVET";

export const navigation = [
  { label: "Натяжные стены", href: "/stretch-walls" },
  { label: "Для дома", href: "/home" },
  { label: "Для бизнеса", href: "/business" },
  { label: "Технология", href: "/technology" },
  { label: "Проекты", href: "/projects" },
  { label: "Стоимость", href: "/cost" }
] as const;

export const footerNavigation = [
  ...navigation,
  { label: "Материалы", href: "/materials" },
  { label: "Дизайнерам", href: "/designers" },
  { label: "Статьи", href: "/articles" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
  { label: "Политика данных", href: "/privacy" }
] as const;

export const isPublicMode = process.env.SITE_MODE === "public" && process.env.PUBLIC_CONTENT_APPROVED === "true" && publicSiteReadiness().ready;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const siteBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function absoluteSitePath(path: string) {
  return new URL(`${siteBasePath}${path}`, siteUrl).toString();
}

export const routeMeta = {
  "/": {
    title: "Натяжные стены и архитектурный текстиль",
    description: "Натяжные стены для квартир, домов и коммерческих интерьеров. Текстильные поверхности, технология монтажа, материалы и расчёт проекта."
  },
  "/stretch-walls/": {
    title: "Натяжные стены из архитектурного текстиля",
    description: "Как устроены натяжные стены, где их применяют и что учитывать при выборе отделки. Фактуры, особенности монтажа и запрос расчёта."
  },
  "/home/": {
    title: "Натяжные стены для квартиры и дома",
    description: "Текстильная отделка стен для спальни, гостиной и кабинета. Фактуры, уход, интеграция света и индивидуальный расчёт проекта."
  },
  "/business/": {
    title: "Натяжные стены для бизнеса и коммерческих объектов",
    description: "Архитектурный текстиль для офисов, отелей, ресторанов и общественных пространств. Обсуждение технологии, ТЗ и сметы."
  },
  "/technology/": {
    title: "Технология натяжных стен: устройство и монтаж",
    description: "Профильная система, архитектурный текстиль, узлы и варианты акустического наполнения. Как устроена конструкция натяжных стен."
  },
  "/projects/": {
    title: "Проекты с натяжными стенами",
    description: "Подход к проектам с архитектурным текстилем. Реальные кейсы появятся после подтверждения материалов и прав на фотографии."
  },
  "/materials/": {
    title: "Материалы и фактуры для натяжных стен",
    description: "Как выбрать фактуру и цвет архитектурного текстиля, учесть освещение и условия эксплуатации. Подбор материала под интерьер."
  },
  "/cost/": {
    title: "Стоимость натяжных стен: факторы расчёта",
    description: "От чего зависит стоимость натяжных стен: площадь, геометрия, текстиль и конструктивные узлы. Отправьте данные для расчёта."
  },
  "/designers/": {
    title: "Натяжные стены для дизайнеров и архитекторов",
    description: "Архитектурный текстиль в интерьерных проектах: фактуры, конструктивные узлы и подготовка к реализации. Обсудить проект."
  },
  "/articles/": {
    title: "Статьи о натяжных стенах: монтаж, уход, ремонт",
    description: "Практические материалы о технологии натяжных стен, уходе за текстилем, ремонте полотна и применении на разных объектах."
  },
  "/about/": {
    title: "О компании OTAGAN VELVET — архитектурный текстиль",
    description: "Как OTAGAN VELVET соединяет инженерный подход с натяжными стенами: материал, конструкция и детали интерьера."
  },
  "/contacts/": {
    title: "Контакты — обсудить проект натяжных стен",
    description: "Свяжитесь с OTAGAN VELVET, чтобы обсудить отделку квартиры, дома или коммерческого объекта и передать данные для расчёта."
  },
  "/privacy/": {
    title: "Политика обработки персональных данных",
    description: "Условия обработки персональных данных на сайте OTAGAN VELVET. Документ будет опубликован после утверждения владельцем сайта."
  }
} as const;

export type SiteRoute = keyof typeof routeMeta;

export function metadataFor(route: SiteRoute) {
  const { title, description } = routeMeta[route];
  const canonical = absoluteSitePath(route);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" as const }
  };
}
