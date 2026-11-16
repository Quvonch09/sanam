export interface BarcodeProduct {
  gtin: string;
  size: string;
  name: string;
  description: string;
  brand: string;
  subtype: string;
  images?: string[];
}

// GTIN values transcribed from the GS1 Uzbekistan product sheet supplied by the user.
export const barcodeProducts: BarcodeProduct[] = [
  { gtin: '4780051340541', size: '46', name: 'Ko‘k rangli denim ikki qismli komplekt', description: 'Jinsi matodan tikilgan ikki qismli komplekt.', brand: 'Sanam мчж', subtype: '10002102' },
  { gtin: '4780051340558', size: '48', name: 'Ko‘k rangli denim ikki qismli komplekt', description: 'Jinsi matodan tikilgan ikki qismli komplekt.', brand: 'Sanam мчж', subtype: '10002102' },
  { gtin: '4780051340565', size: '50', name: 'Ko‘k rangli denim ikki qismli komplekt', description: 'Jinsi matodan tikilgan ikki qismli komplekt.', brand: 'Sanam мчж', subtype: '10002102' },
  { gtin: '4780051340572', size: '52', name: 'Ko‘k rangli denim ikki qismli komplekt', description: 'Jinsi matodan tikilgan ikki qismli komplekt.', brand: 'Sanam мчж', subtype: '10002102' },
  { gtin: '4780051340589', size: '54', name: 'Ko‘k rangli denim ikki qismli komplekt', description: 'Jinsi matodan tikilgan ikki qismli komplekt.', brand: 'Sanam мчж', subtype: '10002102' },
  { gtin: '4780051340596', size: '56', name: 'Ko‘k rangli denim ikki qismli komplekt', description: 'Jinsi matodan tikilgan ikki qismli komplekt.', brand: 'Sanam мчж', subtype: '10002102' },
  {
    gtin: '4780051340602',
    size: '58',
    name: 'Ko‘k rangli denim ikki qismli komplekt',
    description: 'Jinsi matodan tikilgan ikki qismli komplekt.',
    brand: 'Sanam мчж',
    subtype: '10002102',
    images: [
      '/products/barcode-4780051340602/front-main.jpg',
      '/products/barcode-4780051340602/front-detail.jpg',
      '/products/barcode-4780051340602/back-view.jpg',
      '/products/barcode-4780051340602/model-view.jpg',
    ],
  },
];

export function normalizeGtin(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 14 && digits.startsWith('0') ? digits.slice(1) : digits;
}

export function findBarcodeProduct(value: string): BarcodeProduct | undefined {
  const gtin = normalizeGtin(value);
  return barcodeProducts.find((product) => product.gtin === gtin);
}
