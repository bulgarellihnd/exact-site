export type PropertyType = 'locacao' | 'aquisicao';

export interface Property {
  id: string;
  code: string;
  title: string;
  type: PropertyType;
  price: number;
  location: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  gallery: string[];
  amenities: string[];
  coordinates: { lat: number; lng: number };
  yearBuilt: number;
  garage: number;
}

export const properties: Property[] = [
  {
    id: '1',
    code: 'EX-001',
    title: 'Apartamento Luxo - Batel',
    type: 'aquisicao',
    price: 5200000,
    location: 'Batel, Curitiba',
    neighborhood: 'Batel',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: 'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=800&h=600&fit=crop',
    description: 'Apartamento de luxo com vista panorâmica, acabamento premium e localização privilegiada. Localizado no coração do Batel, oferece acesso direto aos melhores restaurantes e boutiques de Curitiba.',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1000&h=750&fit=crop'
    ],
    amenities: ['Piscina', 'Academia', 'Sauna', 'Churrasqueira', 'Segurança 24h', 'Estacionamento'],
    coordinates: { lat: -25.4290, lng: -49.2671 },
    yearBuilt: 2018,
    garage: 2
  },
  {
    id: '2',
    code: 'EX-002',
    title: 'Penthouse - Champagnat',
    type: 'aquisicao',
    price: 6800000,
    location: 'Champagnat, Curitiba',
    neighborhood: 'Champagnat',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    description: 'Penthouse exclusivo com terraço e vistas da cidade. Acabamento de primeira qualidade com materiais importados e design contemporâneo.',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1000&h=750&fit=crop'
    ],
    amenities: ['Terraço Privado', 'Piscina', 'Home Theater', 'Adega', 'Segurança 24h', 'Concierge'],
    coordinates: { lat: -25.4345, lng: -49.2750 },
    yearBuilt: 2020,
    garage: 3
  },
  {
    id: '3',
    code: 'EX-003',
    title: 'Apartamento Premium - Ecoville',
    type: 'aquisicao',
    price: 3900000,
    location: 'Ecoville, Curitiba',
    neighborhood: 'Ecoville',
    bedrooms: 3,
    bathrooms: 2,
    area: 280,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800&h=600&fit=crop',
    description: 'Apartamento moderno em condomínio com infraestrutura completa e segurança 24h. Ambiente sustentável com áreas verdes e tecnologia inteligente.',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop'
    ],
    amenities: ['Piscina', 'Academia', 'Parque', 'Espaço Gourmet', 'Segurança 24h', 'Estacionamento'],
    coordinates: { lat: -25.4500, lng: -49.2900 },
    yearBuilt: 2019,
    garage: 2
  },
  {
    id: '4',
    code: 'EX-004',
    title: 'Apartamento para Locação - Alto da XV',
    type: 'locacao',
    price: 8500,
    location: 'Alto da XV, Curitiba',
    neighborhood: 'Alto da XV',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop',
    description: 'Apartamento bem localizado, próximo a comércios e serviços. Totalmente mobiliado e pronto para morar.',
    gallery: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop'
    ],
    amenities: ['Mobiliado', 'Academia', 'Segurança 24h', 'Estacionamento', 'Próximo ao comércio'],
    coordinates: { lat: -25.4200, lng: -49.2600 },
    yearBuilt: 2017,
    garage: 1
  },
  {
    id: '5',
    code: 'EX-005',
    title: 'Apartamento para Locação - Batel',
    type: 'locacao',
    price: 12000,
    location: 'Batel, Curitiba',
    neighborhood: 'Batel',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    description: 'Apartamento espaçoso em prédio de alto padrão com todas as comodidades. Localização premium no Batel.',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1000&h=750&fit=crop'
    ],
    amenities: ['Piscina', 'Academia', 'Sauna', 'Segurança 24h', 'Estacionamento', 'Espaço Gourmet'],
    coordinates: { lat: -25.4290, lng: -49.2671 },
    yearBuilt: 2016,
    garage: 2
  },
  {
    id: '6',
    code: 'EX-006',
    title: 'Apartamento para Locação - Champagnat',
    type: 'locacao',
    price: 6500,
    location: 'Champagnat, Curitiba',
    neighborhood: 'Champagnat',
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    description: 'Apartamento compacto e funcional, ideal para profissionais. Bem localizado e com fácil acesso.',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=750&fit=crop'
    ],
    amenities: ['Academia', 'Segurança 24h', 'Estacionamento', 'Próximo ao metrô'],
    coordinates: { lat: -25.4345, lng: -49.2750 },
    yearBuilt: 2015,
    garage: 1
  },
  {
    id: '7',
    code: 'EX-007',
    title: 'Apartamento para Locação - Ecoville',
    type: 'locacao',
    price: 7200,
    location: 'Ecoville, Curitiba',
    neighborhood: 'Ecoville',
    bedrooms: 2,
    bathrooms: 2,
    area: 130,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800&h=600&fit=crop',
    description: 'Apartamento moderno com varanda, em condomínio com lazer completo. Ambiente tranquilo e seguro.',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop'
    ],
    amenities: ['Piscina', 'Academia', 'Parque', 'Segurança 24h', 'Estacionamento'],
    coordinates: { lat: -25.4500, lng: -49.2900 },
    yearBuilt: 2018,
    garage: 1
  },
  {
    id: '8',
    code: 'EX-008',
    title: 'Apartamento para Locação - Água Verde',
    type: 'locacao',
    price: 5800,
    location: 'Água Verde, Curitiba',
    neighborhood: 'Água Verde',
    bedrooms: 1,
    bathrooms: 1,
    area: 70,
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop',
    description: 'Studio aconchegante, perfeito para quem busca praticidade e localização. Ambiente moderno e bem equipado.',
    gallery: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop'
    ],
    amenities: ['Mobiliado', 'Academia', 'Segurança 24h', 'Estacionamento'],
    coordinates: { lat: -25.4400, lng: -49.2800 },
    yearBuilt: 2017,
    garage: 1
  },
  {
    id: '9',
    code: 'EX-009',
    title: 'Apartamento Luxo - Água Verde',
    type: 'aquisicao',
    price: 2800000,
    location: 'Água Verde, Curitiba',
    neighborhood: 'Água Verde',
    bedrooms: 3,
    bathrooms: 2,
    area: 250,
    image: 'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=800&h=600&fit=crop',
    description: 'Apartamento elegante em bairro consolidado, com acabamento refinado. Perfeito para quem busca qualidade e localização.',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop'
    ],
    amenities: ['Piscina', 'Academia', 'Sauna', 'Segurança 24h', 'Estacionamento'],
    coordinates: { lat: -25.4400, lng: -49.2800 },
    yearBuilt: 2019,
    garage: 2
  },
  {
    id: '10',
    code: 'EX-010',
    title: 'Apartamento Luxo - Alto da XV',
    type: 'aquisicao',
    price: 4500000,
    location: 'Alto da XV, Curitiba',
    neighborhood: 'Alto da XV',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    description: 'Apartamento de grande metragem com vista privilegiada da cidade. Acabamento premium e localização estratégica.',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=1000&h=750&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=1000&h=750&fit=crop'
    ],
    amenities: ['Piscina', 'Academia', 'Sauna', 'Home Theater', 'Segurança 24h', 'Estacionamento'],
    coordinates: { lat: -25.4200, lng: -49.2600 },
    yearBuilt: 2020,
    garage: 3
  }
];

export const neighborhoods = [
  'Batel',
  'Champagnat',
  'Ecoville',
  'Alto da XV',
  'Água Verde'
];

export const priceRanges = [
  { label: 'Até R$ 5 mil', min: 0, max: 5000 },
  { label: 'R$ 5 mil - R$ 10 mil', min: 5000, max: 10000 },
  { label: 'R$ 10 mil - R$ 15 mil', min: 10000, max: 15000 },
  { label: 'Acima de R$ 15 mil', min: 15000, max: Infinity }
];

export const priceRangesAquisicao = [
  { label: 'Até R$ 3 milhões', min: 0, max: 3000000 },
  { label: 'R$ 3M - R$ 5M', min: 3000000, max: 5000000 },
  { label: 'R$ 5M - R$ 7M', min: 5000000, max: 7000000 },
  { label: 'Acima de R$ 7M', min: 7000000, max: Infinity }
];
