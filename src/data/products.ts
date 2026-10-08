import { productImageUrl } from '../lib/assets';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  badge?: string;
  images: {
    front: string;
    back: string;
    detail: string;
    lookbook: string;
  };
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  story: {
    quote: string;
    concept: string;
  };
  manufacturing: {
    fabric: string;
    fit: string;
    craftDetails: string[];
    careInstructions: string[];
  };
}

export const PRODUCTS: Product[] = [
  {
    id: 'the-feeling-hoodie',
    name: 'The Feeling Hoodie',
    subtitle: 'Edición inaugural con monograma bordado',
    price: 89.00,
    badge: 'DROP 01',
    images: {
      front: productImageUrl(1),
      back: productImageUrl(2),
      detail: productImageUrl(3),
      lookbook: productImageUrl(4),
    },
    sizes: ['S', 'M', 'L', 'XL'],
    story: {
      quote: 'Vestir lo que sientes antes de pronunciar una sola palabra.',
      concept: 'Una pieza concebida como armadura emocional cotidiana. El corte y peso buscan dar confort absoluto mientras los trazos en rojo comunican catarsis y presencia.'
    },
    manufacturing: {
      fabric: '100% Algodón peinado de alto gramaje (400 GSM)',
      fit: 'Oversize estructurado con hombro caído',
      craftDetails: [
        'Bordado frontal en hilo de alta densidad',
        'Costuras dobles reforzadas en cuello y mangas',
        'Etiqueta tejida a mano cosida individualmente'
      ],
      careInstructions: [
        'Lavar al revés con agua fría',
        'No usar secadora',
        'Planchar a baja temperatura evitando el bordado'
      ]
    }
  },
  {
    id: 'emotion-tee',
    name: 'Emotion Heavyweight Tee',
    subtitle: 'Corte cuadrado y gráficos serigrafiados',
    price: 49.00,
    badge: 'NUEVO',
    images: {
      front: productImageUrl(5),
      back: productImageUrl(6),
      detail: productImageUrl(7),
      lookbook: productImageUrl(8),
    },
    sizes: ['S', 'M', 'L', 'XL'],
    story: {
      quote: 'Líneas imperfectas para mentes en constante movimiento.',
      concept: 'Inspirada en el trazo gestual del arte urbano. Cada línea serigrafiada busca plasmar la crudeza y vulnerabilidad de la creación.'
    },
    manufacturing: {
      fabric: 'Algodón cardado 240 GSM de tacto seco',
      fit: 'Boxy fit / Cuello cerrado de 3 cm reforzado',
      craftDetails: [
        'Serigrafía de tacto cero en base agua',
        'Teñido reactivo en tono vino profundo',
        'Tratamiento pre-encogido'
      ],
      careInstructions: [
        'Lavar con prendas del mismo color',
        'Secar a la sombra',
        'No planchar directamente sobre el estampado'
      ]
    }
  },
  {
    id: 'passion-bomber-jacket',
    name: 'Passion Reversible Jacket',
    subtitle: 'Chaqueta técnica con detalles en vinilo y bordado',
    price: 139.00,
    badge: 'EDICIÓN LIMITADA',
    images: {
      front: productImageUrl(9),
      back: productImageUrl(10),
      detail: productImageUrl(11),
      lookbook: productImageUrl(12),
    },
    sizes: ['M', 'L', 'XL'],
    story: {
      quote: 'Dos caras, una misma intención.',
      concept: 'Diseñada para noches frías y transiciones rápidas de la ciudad al estudio. El forro interior en tono vino contrasta con el exterior sobrio.'
    },
    manufacturing: {
      fabric: 'Exterior en nylon impermeable / Forro en sarga suave',
      fit: 'Corte aviador relajado',
      craftDetails: [
        'Cierres metálicos YKK de uso rudo',
        'Bolsillo utilitario en manga izquierda',
        'Tiradores de cremallera con cintas grabadas'
      ],
      careInstructions: [
        'Limpieza en seco recomendada',
        'No exprimir',
        'Guardar en gancho ancho'
      ]
    }
  },
  {
    id: 'raw-statement-pants',
    name: 'Raw Statement Cargo',
    subtitle: 'Pantalón utilitario con cintas de ajuste',
    price: 99.00,
    badge: '1 DE 30 PIEZAS',
    images: {
      front: productImageUrl(13),
      back: productImageUrl(1),
      detail: productImageUrl(2),
      lookbook: productImageUrl(3),
    },
    sizes: ['S', 'M', 'L'],
    story: {
      quote: 'Movimiento sin restricciones.',
      concept: 'Pieza utilitaria que fusiona funcionalidad urbana y proporciones neobrutalistas.'
    },
    manufacturing: {
      fabric: 'Gabardina de algodón de alta resistencia',
      fit: 'Pierna ancha ajustable con broches en los tobillos',
      craftDetails: [
        'Bolsillos con solapa y costuras de remate',
        'Cintura elástica con cordón de ajuste pesado',
        'Remaches metálicos negros'
      ],
      careInstructions: [
        'Lavar en ciclo delicado',
        'No usar blanqueador'
      ]
    }
  }
];
