import { ScanClient } from './ScanClient';

export const metadata = {
  title: 'Barkod orqali mahsulotni topish | SANAM',
  description: 'Sanam mahsulotining EAN-13 barkodini skanerlab, mahsulot sahifasini oching.',
};

export default function ScanPage() {
  return <ScanClient />;
}
