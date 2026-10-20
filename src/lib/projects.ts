import type { MediaSlot } from "@/lib/media";

export type WorkExample = {
  slug: string;
  title: string;
  slot: MediaSlot;
  description: string;
};

export const workExamples: WorkExample[] = [
  {
    slug: "architectural-textile-lighting",
    title: "Архитектурный текстиль с подсветкой",
    slot: "workExampleOne",
    description: "Натяжная текстильная поверхность и вертикальная линия света в узле примыкания."
  },
  {
    slug: "textile-furniture-finish",
    title: "Текстиль на фасаде мебели",
    slot: "workExampleTwo",
    description: "Концептуальное сочетание текстильной стены с фактурой мебельного фасада."
  },
  {
    slug: "classic-outlet",
    title: "Розетка в натяжной текстильной стене",
    slot: "workExampleThree",
    description: "Текстильная стена с заранее предусмотренной электрической точкой."
  },
  {
    slug: "lighting-decorative-inlays",
    title: "Отделка с подсветкой и декоративными вставками",
    slot: "workExampleFour",
    description: "Скрытый свет и вертикальные декоративные детали на фактурной поверхности."
  },
  {
    slug: "track-lighting",
    title: "Трековый свет в интерьере с текстильной стеной",
    slot: "workExampleFive",
    description: "Архитектурный текстиль показан вместе с направленным потолочным освещением."
  },
  {
    slug: "shadow-light-ceiling",
    title: "Теневая подсветка у потолка",
    slot: "workExampleSix",
    description: "Линия света связывает плоскость потолка и текстильную стену."
  }
];

export const previewProjects = [
  { ...workExamples[0], imageSlot: "projectPortfolioOne" as const },
  { ...workExamples[1], imageSlot: "projectPortfolioTwo" as const }
];

export function getWorkExample(slug: string) {
  return previewProjects.find((project) => project.slug === slug);
}
