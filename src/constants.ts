export interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  images: string[];
  features: string[];
  description: string;
  type: 'rental' | 'sale';
  amenities?: string[];
  areaImages?: Record<string, string | string[]>;
  pdfLinks?: string[];
}

export const RENTALS: Listing[] = [
  {
    id: 'r1',
    title: 'Strandnahes, barrierearmes Apartment mit Terrasse',
    location: 'Heringsdorf, Deutschland',
    price: 'ab 95 € / Nacht',
    rating: 0,
    reviews: 0,
    type: 'rental',
    features: ['4 Gäste', '1 Schlafzimmer', '3 Betten', '1 Bad'],
    description: 'Modernes, barrierearmes Apartment in direkter Strandnähe. Mit sonniger Terrasse und hochwertiger Ausstattung.',
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1430418368693920411/original/6a7533b8-1188-4084-afbb-b2952e35fa2d.jpeg?im_w=960',
    ],
    amenities: ['WLAN', 'Küche', 'Parkplatz', 'Barrierefrei'],
    areaImages: {
      livingRoom: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80',
      kitchen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80',
      bedroom1: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80',
      dining: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80',
      bathroom: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80',
      outdoor: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'r2',
    title: 'Strandnahes, barrierearmes Apartment mit Terrasse',
    location: 'Heringsdorf, Deutschland',
    price: 'ab 105 € / Nacht',
    rating: 0,
    reviews: 0,
    type: 'rental',
    features: ['4 Gäste', '1 Schlafzimmer', '3 Betten', '1 Bad'],
    description: 'Exklusives Apartment in erstklassiger Lage von Heringsdorf. Barrierefrei und mit einer einladenden Terrasse.',
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQxMTYwNDc1OTA0NDYzODgyMA==/original/aea57c2c-51bd-4602-965c-03ee7bae7ebc.jpeg?im_w=960',
    ],
    amenities: ['WLAN', 'Küche', 'Terrasse', 'Barrierefrei'],
    areaImages: {
      livingRoom: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80',
      kitchen: 'https://images.unsplash.com/photo-1556909211-36987daf4508?auto=format&fit=crop&q=80',
      bedroom1: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80'
    }
  }
];

export const SALES: Listing[] = [
  {
    id: 's1',
    title: 'Neubau-Erstbezug Zinnowitz',
    location: 'Zinnowitz, Usedom',
    price: 'ab 380.000 €',
    rating: 0,
    reviews: 0,
    type: 'sale',
    features: ['82 m²', '2.5 Zimmer', 'Terrasse', 'Keller'],
    description: 'Moderne Architektur in ruhiger Lage. Effizienzhaus 55 Standard.',
    images: [
      'https://images.unsplash.com/photo-1512914890251-2f96a9b0925b?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80',
    ],
    areaImages: {
      livingRoom: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
      kitchen: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80',
      bedroom1: 'https://images.unsplash.com/photo-1600607687931-cebf5f4ca6ea?auto=format&fit=crop&q=80'
    }
  }
];
