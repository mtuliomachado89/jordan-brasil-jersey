/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GalleryItem, BenefitItem, DetailedFeature, TestimonialItem, FaqItem } from "./types";

// Asset paths matching generated image locations
export const IMAGES = {
  hero: "/jersey-hero.png",
  front: "/jersey-front.png",
  back: "/jersey-back.png",
  detail: "/jersey-detail.png",
  lifestyle: "/jersey-lifestyle.png",
  folded: "/jersey-folded.png",
};

export const PRODUCT_INFO = {
  name: "Camisa Jordan x Brasil Edição Especial 2026",
  originalPrice: 299.90,
  promoPrice: 139.90,
  maxInstallments: 12,
  pricePerInstallment: 11.66,
  stockLeft: 27,
  maxStock: 250,
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    category: "Foto Frontal",
    title: "Manto Sagrado",
    description: "Visual frontal com escudo centralizado e caimento de alta performance sportswear.",
    src: IMAGES.front,
  },
  {
    id: "g2",
    category: "Foto Traseira",
    title: "Camisa 10 Lendária",
    description: "Visual das costas com as ranhuras exclusivas em degrade preto e azul royal profundo.",
    src: IMAGES.back,
  },
  {
    id: "g3",
    category: "Selo de Autenticidade",
    title: "Selo Engineered Jordan",
    description: "Etiqueta termofixada 'Engineered Jordan Brasil' oficial que atesta a exclusividade do manto.",
    src: IMAGES.detail,
  },
  {
    id: "g4",
    category: "Camisa Dobrada",
    title: "Pronta Para a Ação",
    description: "Apresentação impecável da camisa dobrada, exibindo as cores radiantes e corte simétrico.",
    src: IMAGES.folded,
  },
  {
    id: "g5",
    category: "Detalhe do Peito",
    title: "Escudo do Brasil & Jumpman",
    description: "O glorioso escudo da CBF bordado em relevo 3D sobreposto ao icônico logo Jumpman.",
    src: IMAGES.hero,
  },
  {
    id: "g6",
    category: "Foto Lifestyle",
    title: "Estilo Urbano Autêntico",
    description: "Streetwear marcante que se traduz em presença forte, conforto térmico e modelagem impecável.",
    src: IMAGES.lifestyle,
  },
];

export const BENEFITS: BenefitItem[] = [
  {
    id: "b1",
    title: "Design Exclusivo Jordan x Brasil",
    description: "Colaboração inédita integrando a alta performance urbana da Jordan com a garra brasileira.",
    iconName: "ShieldAlert",
  },
  {
    id: "b2",
    title: "Tecido Premium Respirável",
    description: "Sistema Dri-FIT inteligente de transpiração rápida que evapora o suor com máxima facilidade.",
    iconName: "Wind",
  },
  {
    id: "b3",
    title: "Conforto para Uso Diário",
    description: "Toque extremamente leve e sedoso na pele, com corte atlético confortável e sem fricção.",
    iconName: "Smile",
  },
  {
    id: "b4",
    title: "Edição Limitada",
    description: "Número restrito de peças produzidas mundialmente. Modelo de colecionador indisponível em lojas tradicionais.",
    iconName: "Sparkles",
  },
  {
    id: "b5",
    title: "Acabamento Premium",
    description: "Costuras interlock reforçadas, gola resistente ao desgaste e escudo dourado termoaplicado.",
    iconName: "Gem",
  },
  {
    id: "b6",
    title: "Envio Rápido para Todo Brasil",
    description: "Entrega expressa segurada com rastreamento detalhado por e-mail e suporte via WhatsApp.",
    iconName: "Truck",
  },
];

export const DETAILED_FEATURES: DetailedFeature[] = [
  {
    id: "df1",
    title: "Escudo Oficial da CBF & Jordan Brand",
    description: "Um logo lendário que une duas dinastias esportivas mundiais. O brasão dourado e verde-amarelo da CBF é bordado em relevo de alta precisão técnica ao lado do eterno Jumpman.",
    image: IMAGES.hero,
    items: [
      "Escudo texturizado em alta resolução 3D",
      "Jumpman bordado em fios metálicas premium",
      "Gola reforçada elástica com fita traseira",
      "Piping de ajuste sob os ombros"
    ]
  },
  {
    id: "df2",
    title: "Tag de Importação Engineered & Tecido Respirável",
    description: "Selo termofixado em matriz emborrachada original Jordan Brasil costurado na bainha inferior esquerda, conferindo originalidade premium e toque suave anti-atrito.",
    image: IMAGES.detail,
    items: [
      "Selo original Jordan Engineered Brasil",
      "Malha microperfurada respirável Dri-Mesh",
      "Estampa listrada integrada por sublimação térmica",
      "Poliéster reciclado ecológico de alta performance"
    ]
  },
  {
    id: "df3",
    title: "Modelagem Ergonômica Streetwear",
    description: "Corte esportivo inteligente e painéis laterais respiráveis projetados para acompanhar os movimentos do seu corpo, unindo conforto excepcional no dia a dia ao estilo autêntico das ruas.",
    image: IMAGES.lifestyle,
    items: [
      "Caimento sob medida para o corpo brasileiro",
      "Faixas laterais elásticas de refrigeração aerodinâmica",
      "Toque macio termorregulador que não descolore",
      "Versatilidade impecável para compor looks casuais"
    ]
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Rafael M.",
    rating: 5,
    text: "Qualidade impressionante. O tecido é levíssimo e o bordado dourado do escudo chama muita atenção. Muito melhor do que eu imaginava.",
    sizeBought: "GG",
    deliveryTime: "6 dias úteis",
    verified: true,
    initials: "RM",
    reviewImage: "/review-1-unboxing.png",
  },
  {
    id: "t2",
    name: "Lucas S.",
    rating: 5,
    text: "Recebi em poucos dias bem embalada. A camisa veste muito bem, o caimento Jordan é diferenciado. A camisa é espetacular.",
    sizeBought: "G",
    deliveryTime: "5 dias úteis",
    verified: true,
    initials: "LS",
    reviewImage: "/review-2-detalhe.png",
  },
  {
    id: "t3",
    name: "Gustavo R.",
    rating: 5,
    text: "Já me perguntaram várias vezes na rua onde eu comprei! Estilo puro, cai perfeito com jeans ou bermuda sportswear.",
    sizeBought: "M",
    deliveryTime: "4 dias úteis",
    verified: true,
    initials: "GR",
    reviewImage: "/review-3-caimento.png",
  },
  {
    id: "t4",
    name: "Felipe A.",
    rating: 5,
    text: "Manto impecável. Entrega rápida e o suporte no WhatsApp tirou todas as dúvidas de tamanho antes de comprar. Vale cada centavo.",
    sizeBought: "P",
    deliveryTime: "7 dias úteis",
    verified: true,
    initials: "FA",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq1",
    question: "A camisa é original?",
    answer: "Nossa Camisa Jordan x Brasil é uma versão de Importação Premium Especial para Colecionadores, fabricada com os mesmos materiais de alta performance (poliéster microperfurado, escudos termocolados e costuras reforçadas) e padrões exigidos nas principais boutiques esportivas internacionais."
  },
  {
    id: "faq2",
    question: "Qual o prazo de entrega?",
    answer: "O prazo médio de entrega varia de 5 a 12 dias úteis para todo o Brasil. Você recebe o código de rastreamento no seu e-mail e WhatsApp em até 48 horas úteis após a aprovação da sua compra."
  },
  {
    id: "faq3",
    question: "Como escolher meu tamanho?",
    answer: "Disponibilizamos uma tabela de medidas detalhada em nossa seção de compra. Recomendamos escolher o tamanho habitual de camisas esportivas que você já usa. Por exemplo: M (veste até 1.78m e 75kg); G (veste até 1.84m e 85kg)."
  },
  {
    id: "faq4",
    question: "Posso trocar caso não sirva?",
    answer: "Com certeza! Oferecemos nossa garantia estendida de Troca Facilitada. Caso decida mudar de tamanho, basta entrar em contato com nossa equipe em até 7 dias após o recebimento para providenciarmos a troca sem qualquer burocracia ou taxa extra."
  },
  {
    id: "faq5",
    question: "Quais são as formas de pagamento?",
    answer: "Aceitamos PIX com 5% de desconto extra e liberação instantânea de envio, ou parcelado em até 12x em todos os cartões de crédito. A transação é mediada por um dos gateways de maior segurança do país, garantindo proteção total aos seus dados."
  }
];
