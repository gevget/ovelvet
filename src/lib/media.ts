export type MediaSlot =
  | "homeHero"
  | "homeAudienceHome"
  | "homeAudienceBusiness"
  | "homeGalleryOne"
  | "homeGalleryTwo"
  | "homeGalleryThree"
  | "homeProjectFeature"
  | "workExampleOne"
  | "workExampleTwo"
  | "workExampleThree"
  | "workExampleFour"
  | "workExampleFive"
  | "workExampleSix"
  | "projectPortfolioOne"
  | "projectPortfolioTwo"
  | "homeProductTexture"
  | "homeMaterialSampleOne"
  | "homeMaterialSampleTwo"
  | "homeDesignerDetails"
  | "productHero"
  | "homeAudienceHero"
  | "businessHero"
  | "technologyCutaway"
  | "technologyDiagram"
  | "designerDetails"
  | "materialTexture"
  | "materialSampleOne"
  | "materialSampleTwo"
  | "materialSampleThree"
  | "materialSampleFour"
  | "aboutProcess"
  | "projectPortrait";

export type MediaAsset = {
  src: string;
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;
  variant: "hero" | "square" | "portrait" | "wide" | "material" | "technical";
  source: "pack-placeholder" | "owner-supplied" | "original-illustration" | "generated-concept";
  rightsConfirmed: boolean;
  isPlaceholder: boolean;
  caption?: string;
};

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const withBasePath = (src: string) => `${basePath}${src}`;

const placeholder = (src: string, width: number, height: number, variant: MediaAsset["variant"]): MediaAsset => ({
  src: withBasePath(src),
  alt: "",
  width,
  height,
  variant,
  source: "pack-placeholder",
  rightsConfirmed: false,
  isPlaceholder: true
});

const generatedConcept = (
  src: string,
  width: number,
  height: number,
  variant: MediaAsset["variant"],
  alt: string,
  caption: string
): MediaAsset => ({
  src: withBasePath(src),
  alt,
  width,
  height,
  variant,
  source: "generated-concept",
  rightsConfirmed: false,
  isPlaceholder: false,
  caption
});

// Replace one registry entry per visual slot when approved media arrives.
export const mediaRegistry: Record<MediaSlot, MediaAsset> = {
  homeHero: generatedConcept("/images/generated/home-hero-graphite-square.webp", 1254, 1254, "square", "Гостиная в городской квартире с фактурной графитовой натяжной стеной и диваном из бордовой кожи", "Концепт интерьера · не фото проекта"),
  homeAudienceHome: generatedConcept("/images/generated/home-private-portrait.webp", 1122, 1402, "portrait", "Спальня с текстильной стеной, деревянным полом и мягкой дневной подсветкой", "Концепт интерьера · не фото проекта"),
  homeAudienceBusiness: generatedConcept("/images/generated/home-business-glass-portrait.webp", 1122, 1402, "portrait", "Коммерческий интерьер с высокими стеклянными перегородками и натяжной стеной насыщенного сине-зелёного оттенка", "Концепт коммерческого интерьера · не фото проекта"),
  homeGalleryOne: generatedConcept("/images/generated/home-gallery-green-square.webp", 1254, 1254, "square", "Гостиная в загородном доме с глубокозелёной натяжной стеной, льняным креслом и светлым дубом", "Концепт интерьера · не фото проекта"),
  homeGalleryTwo: generatedConcept("/images/generated/home-gallery-blue-portrait.webp", 1122, 1402, "portrait", "Домашний кабинет с сине-серой текстильной стеной, рабочим столом из ореха и мягким боковым светом", "Концепт интерьера · не фото проекта"),
  homeGalleryThree: generatedConcept("/images/generated/home-gallery-clay-square.webp", 1254, 1254, "square", "Спальня с фактурной стеной приглушённого глиняного оттенка, тёмным деревом и холодным утренним светом", "Концепт интерьера · не фото проекта"),
  homeProjectFeature: generatedConcept("/images/generated/home-visualization-wide.webp", 1747, 900, "wide", "Просторная гостиная с длинной стеной из архитектурного текстиля", "Концептуальная визуализация · не выполненный объект"),
  workExampleOne: generatedConcept("/images/generated/project-light-square.webp", 1254, 1254, "square", "Натяжная текстильная стена с вертикальной световой линией в угловом примыкании", "Концепт по фото объекта · не снимок реализации"),
  workExampleTwo: generatedConcept("/images/generated/project-furniture-square.webp", 1254, 1254, "square", "Мебельный фасад, отделанный архитектурным текстилем в тон интерьерной поверхности", "Концепт по фото объекта · не снимок реализации"),
  workExampleThree: generatedConcept("/images/generated/project-outlet-square.webp", 1254, 1254, "square", "Текстильная натяжная стена с интегрированной электрической розеткой", "Концепт по фото объекта · не снимок реализации"),
  workExampleFour: generatedConcept("/images/generated/project-inlays-square.webp", 1254, 1254, "square", "Текстильная стена с декоративными вертикальными вставками и скрытым светом", "Концепт по фото объекта · не снимок реализации"),
  workExampleFive: generatedConcept("/images/generated/project-track-light-square.webp", 1254, 1254, "square", "Натяжная текстильная стена в композиции с трековым освещением", "Концепт по фото объекта · не снимок реализации"),
  workExampleSix: generatedConcept("/images/generated/project-shadow-light-square.webp", 1254, 1254, "square", "Текстильная стена и потолок с согласованной линией теневой подсветки", "Концепт по фото объекта · не снимок реализации"),
  projectPortfolioOne: generatedConcept("/images/generated/project-portfolio-light-square.webp", 1254, 1254, "square", "Угловая композиция натяжной текстильной стены с вертикальной подсветкой, созданная отдельно для карточки проекта", "Концепт по фото объекта · не снимок реализации"),
  projectPortfolioTwo: generatedConcept("/images/generated/project-portfolio-furniture-square.webp", 1254, 1254, "square", "Композиция мебели с текстильным фасадом, созданная отдельно для карточки проекта", "Концепт по фото объекта · не снимок реализации"),
  homeProductTexture: generatedConcept("/images/generated/home-product-texture-square.webp", 1254, 1254, "material", "Макрофактура матового текстиля в оттенке тауп", "Концепт · не образец"),
  homeMaterialSampleOne: generatedConcept("/images/generated/home-material-stone-square.webp", 1254, 1254, "material", "Мелкая тканая фактура в светлом серо-каменном оттенке", "Концепт · не образец"),
  homeMaterialSampleTwo: generatedConcept("/images/generated/home-material-soft-weave-square.webp", 1254, 1254, "material", "Мягкая тканая фактура в светлом оттенке слоновой кости", "Концепт · не образец"),
  homeDesignerDetails: generatedConcept("/images/generated/home-designer-studio-4x3.webp", 1448, 1086, "technical", "Подбор текстиля и отделочных материалов для интерьерного проекта", "Концепт подборки материалов · не рабочая документация"),
  productHero: generatedConcept("/images/generated/stretch-walls-rust-wide.webp", 1536, 1024, "wide", "Прихожая квартиры с натяжной стеной в терракотовом оттенке, тёмной деревянной скамьёй и графитовым полом", "Концепт интерьера · не фото проекта"),
  homeAudienceHero: generatedConcept("/images/generated/home-private-blue-portrait.webp", 1122, 1402, "portrait", "Спальня в городской квартире с натяжной стеной глубокого сине-серого оттенка и креслом цвета ржавчины", "Концепт интерьера · не фото проекта"),
  businessHero: generatedConcept("/images/generated/business-meeting-graphite-wide.webp", 1536, 1024, "wide", "Переговорная в коммерческом пространстве с натяжной стеной графитового цвета, длинным столом и кожаными креслами", "Концепт коммерческого интерьера · не фото проекта"),
  technologyCutaway: generatedConcept("/images/generated/wall-cutaway-concept-wide.webp", 1448, 1086, "technical", "Концептуальный разрез натяжной стены: основание, профильная система, возможный дополнительный слой и натянутое текстильное полотно", "Концептуальная визуализация · не рабочий чертёж"),
  technologyDiagram: {
    src: withBasePath("/images/diagrams/wall-scheme.svg"),
    alt: "Условная схема: основание, профильная система, возможный дополнительный слой и текстильное полотно",
    width: 1000,
    height: 680,
    variant: "technical",
    source: "original-illustration",
    rightsConfirmed: true,
    isPlaceholder: false
  },
  designerDetails: generatedConcept("/images/generated/home-designer-studio-4x3.webp", 1448, 1086, "technical", "Подбор текстиля и отделочных материалов для интерьерного проекта", "Концепт подборки материалов · не рабочая документация"),
  materialTexture: generatedConcept("/images/generated/materials-hero-square.webp", 1254, 1254, "material", "Фрагменты архитектурного текстиля в графитовом, синем и глиняном оттенках при боковом дневном свете", "Концепт фактуры · не образец"),
  materialSampleOne: generatedConcept("/images/generated/material-sample-stone-square.webp", 1254, 1254, "material", "Мелкая тканая фактура в прохладном каменно-сером оттенке", "Концепт · не образец"),
  materialSampleTwo: generatedConcept("/images/generated/material-sample-blue-square.webp", 1254, 1254, "material", "Плотное переплетение нитей в глубоком сине-графитовом оттенке", "Концепт · не образец"),
  materialSampleThree: generatedConcept("/images/generated/material-sample-clay-square.webp", 1254, 1254, "material", "Выразительное тканое переплетение в приглушённом терракотовом оттенке", "Концепт · не образец"),
  materialSampleFour: generatedConcept("/images/generated/material-sample-olive-square.webp", 1254, 1254, "material", "Мягкая меланжевая текстура в сдержанном оливково-коричневом оттенке", "Концепт · не образец"),
  aboutProcess: generatedConcept("/images/generated/about-studio-wide.webp", 1536, 1024, "wide", "Интерьерная студия с образцами архитектурного текстиля, рабочими чертежами и стеклянными перегородками", "Концепт рабочего пространства · не фото команды или объекта"),
  projectPortrait: placeholder("/images/placeholders/project-portrait.svg", 800, 1000, "portrait")
};

export const publicationMediaSlots: MediaSlot[] = [
  "homeHero", "homeAudienceHome", "homeAudienceBusiness", "productHero",
  "homeGalleryOne", "homeGalleryTwo", "homeGalleryThree",
  "workExampleOne", "workExampleTwo", "workExampleThree", "workExampleFour", "workExampleFive", "workExampleSix", "projectPortfolioOne", "projectPortfolioTwo",
  "homeAudienceHero", "businessHero", "designerDetails", "materialTexture", "materialSampleOne", "materialSampleTwo", "materialSampleThree",
  "materialSampleFour", "aboutProcess", "homeProductTexture", "homeMaterialSampleOne", "homeMaterialSampleTwo", "homeDesignerDetails"
];
