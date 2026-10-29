import type { Category, Dish, Promotion } from '../types/database';

export const RESTAURANT_DATA = {
  name: 'La Terraza',
  tagline: 'A LA MESA, SIN AFÁN',
  title: 'El gusto de estar aquí.',
  subtitle: 'Cocina para compartir. Un buen plato, una buena conversación.',
  whatsappNumber: '+573001234567',
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-comidas', name: 'Comidas', slug: 'comidas' },
  { id: 'cat-cocteles', name: 'Cócteles', slug: 'cocteles' },
  { id: 'cat-bebidas', name: 'Bebidas sin alcohol', slug: 'bebidas' },
  { id: 'cat-postres', name: 'Postres', slug: 'postres' },
];

export const INITIAL_DISHES: Dish[] = [
  {
    id: 'p-combo-marranada',
    name: 'Combo marranada',
    description: 'Tradicional picada de cerdo crocante, costilla y arepitas.',
    priceCOP: 179000,
    priceUSD: 45.0,
    categoryId: 'cat-comidas',
    isAvailable: true,
  },
  {
    id: 'p-combo-paisa',
    name: 'Combo paisa',
    description: 'Chorizo y morcilla hechos en casa, chicharrón, patacón...',
    priceCOP: 99000,
    priceUSD: 25.0,
    categoryId: 'cat-comidas',
    isAvailable: true,
  },
  {
    id: 'p-combo-chicharron',
    name: 'Combo chicharrón',
    description: 'Chicharrón carnudo, acompañado de arepita en bola y limón...',
    priceCOP: 99000,
    priceUSD: 25.0,
    categoryId: 'cat-comidas',
    isAvailable: true,
  },
  {
    id: 'p-combo-iglesia',
    name: 'Combo iglesia',
    description: 'Empanaditas crujientes con papa y hogao tradicional.',
    priceCOP: 99000,
    priceUSD: 25.0,
    categoryId: 'cat-comidas',
    isAvailable: true,
  },
  {
    id: 'p-arepa',
    name: 'Arepa de queso callejera',
    description: 'Arepa de maíz rellena de abundante queso derretido dorado al carbón.',
    priceCOP: 21000,
    priceUSD: 6.81,
    categoryId: 'cat-comidas',
    isAvailable: true,
  },
  {
    id: 'p-mojito',
    name: 'Mojito Clásico',
    description: 'Ron blanco, hierbabuena fresca, azúcar de caña y toque de soda.',
    priceCOP: 32000,
    priceUSD: 8.0,
    categoryId: 'cat-cocteles',
    isAvailable: true,
    tags: ['2x1'],
  },
  {
    id: 'p-medallo-mule',
    name: 'Medallo Mule',
    description: 'Nuestra versión con aguardiente artesanal, jengibre y limón.',
    priceCOP: 35000,
    priceUSD: 8.5,
    categoryId: 'cat-cocteles',
    isAvailable: true,
    tags: ['2x1'],
  },
];

export const CURRENT_PROMO: Promotion = {
  id: 'promo-jueves',
  badge: '2×1',
  title: 'Hoy es jueves, 2 por 1',
  subtitle: 'Pide dos y paga uno.',
  tags: ['MOJITO', 'PIÑA COLADA', 'MEDALLO MULE', 'NEGRONI'],
  ctaText: 'Ver cócteles',
};
