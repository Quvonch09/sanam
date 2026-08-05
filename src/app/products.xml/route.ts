import { initialProducts } from '@/data/products';
import { slugify } from '@/utils/slugify';

export const dynamic = 'force-static';


export async function GET() {
  const baseUrl = 'https://www.sanamfactory.uz';

  const itemsXml = initialProducts
    .map((p) => {
      // Parse numerical price for Google Merchant Center
      const numericPrice = p.price.replace(/\D/g, '');
      const priceTag = numericPrice ? `<g:price>${numericPrice} UZS</g:price>` : '<g:price>0 UZS</g:price>';

      // Image link
      const imageLink = p.imageUrl
        ? p.imageUrl.startsWith('http')
          ? p.imageUrl
          : `${baseUrl}${p.imageUrl}`
        : `${baseUrl}/globe.svg`; // default placeholder

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.desc}]]></g:description>
      <g:link>${baseUrl}/product/${slugify(p.name)}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      ${priceTag}
      <g:brand>SANAM</g:brand>
      <g:mpn>${p.model}</g:mpn>
      <g:product_type><![CDATA[${p.category}]]></g:product_type>
      <g:size><![CDATA[${p.sizes}]]></g:size>
      <g:material><![CDATA[${p.material}]]></g:material>
    </item>`;
    })
    .join('');

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Sanam Official Garment Factory Feed</title>
    <link>${baseUrl}</link>
    <description>Sanam official website product feed for Google Merchant Center</description>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
