import 'dotenv/config';
import db from '../lib/db.js';

const sponsors = [
  {
    slug: 'placeholder-bike-co',
    name: 'Placeholder Bike Co. (example)',
    logo_url: 'https://placehold.co/400x400?text=Sponsor+Logo',
    category: 'bike',
    since: '2023-01-01',
    story: 'Example placeholder sponsor — swap for a real bike brand collab once assets are delivered.',
    product_images: [
      'https://placehold.co/800x600?text=Product+Photo+1',
      'https://placehold.co/800x600?text=Product+Photo+2',
    ],
    referral_url: 'https://example.com/ref/placeholder-bike-co',
    discount_code: 'EXAMPLE10',
  },
  {
    slug: 'placeholder-apparel-brand',
    name: 'Placeholder Apparel Brand (example)',
    logo_url: 'https://placehold.co/400x400?text=Sponsor+Logo',
    category: 'apparel',
    since: '2023-06-01',
    story: 'Example placeholder sponsor for kit/apparel — replace with real story and photos later.',
    product_images: ['https://placehold.co/800x600?text=Product+Photo'],
    referral_url: 'https://example.com/ref/placeholder-apparel-brand',
    discount_code: null,
  },
  {
    slug: 'placeholder-gear-supply',
    name: 'Placeholder Gear Supply (example)',
    logo_url: 'https://placehold.co/400x400?text=Sponsor+Logo',
    category: 'gear',
    since: '2024-02-01',
    story: 'Example placeholder sponsor for accessories/gear.',
    product_images: [],
    referral_url: 'https://example.com/ref/placeholder-gear-supply',
    discount_code: 'GEAR15',
  },
];

const siteContent = [
  {
    key: 'home_hero_tagline',
    value: 'Riding sponsored gear, sharing the road — [example tagline, replace with her copy].',
  },
  {
    key: 'about_bio',
    value: '[Example bio placeholder] Cyclist, content creator, and ambassador for the brands she rides with. Replace with her real bio.',
  },
  {
    key: 'about_highlights',
    value: '[Example placeholder] Career highlights and ambassador titles go here.',
  },
  {
    key: 'contact_intro',
    value: '[Example placeholder] Interested in working together? Reach out below.',
  },
];

async function seedSponsors() {
  for (const sponsor of sponsors) {
    await db.query(
      `INSERT INTO sponsors (slug, name, logo_url, category, since, story, product_images, referral_url, discount_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO NOTHING`,
      [
        sponsor.slug,
        sponsor.name,
        sponsor.logo_url,
        sponsor.category,
        sponsor.since,
        sponsor.story,
        sponsor.product_images,
        sponsor.referral_url,
        sponsor.discount_code,
      ]
    );
    console.log(`[seed] sponsor: ${sponsor.slug}`);
  }
}

async function seedSiteContent() {
  for (const row of siteContent) {
    await db.query(
      `INSERT INTO site_content (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO NOTHING`,
      [row.key, row.value]
    );
    console.log(`[seed] site_content: ${row.key}`);
  }
}

async function run() {
  await seedSponsors();
  await seedSiteContent();
  console.log('[seed] Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed:', err.message);
  process.exit(1);
});
