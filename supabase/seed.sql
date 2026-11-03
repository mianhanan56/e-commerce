-- Seed data: mirrors data/catalog.ts so storefront ids match database ids.
-- Stock is a starting placeholder; set real numbers in the admin portal.

insert into public.categories (slug, name, description, story, image, sort_order) values
  ('luxury', 'Luxury', 'Precious finishes and complications for the moments that count.', 'Gold, ceramic and sapphire. Our luxury pieces are made for the nikkah, the promotion and the anniversary — the days you''ll want to remember what you were wearing.', '/images/c-luxury.jpg', 0),
  ('classic', 'Classic', 'Leather straps and clean dials that never date.', 'Proportions borrowed from the mid-century and straps that age with you. Classic watches are the ones that look as right in thirty years as they do today.', '/images/c-classic.jpg', 1),
  ('minimalist', 'Minimalist', 'Nothing extra. Only the hours that matter.', 'Slim cases, quiet dials and nothing to distract. For the man who would rather be asked about his watch than announce it.', '/images/c-minimal.jpg', 2),
  ('business', 'Business', 'Quiet authority from boardroom to dinner.', 'Steel bracelets, dark dials and cases slim enough for a French cuff. Business watches are built to be worn every working day for a decade.', '/images/c-business.jpg', 3),
  ('sports', 'Sports', 'Built for depth, speed and the long weekend.', 'Divers, chronographs and GMTs with real water resistance and legible dials. Made to be knocked about, rinsed off and worn again.', '/images/c-sports.jpg', 4)
on conflict (slug) do nothing;

insert into public.products
  (id, name, line, description, category, price, original_price, stock, image, specs, is_new, bestseller, sort_order)
values
  ('noir-automatic', 'Noir Automatic', 'Steel · 40mm', 'A black sunray dial, polished applied indices and a steel bracelet that tapers neatly at the clasp. The Noir is the watch you stop noticing until someone asks about it.', 'business', 38500, 45000, 10, '/images/p-noir.jpg',
   '{"movement":"Automatic, 42-hour reserve","caseSize":"40mm × 11.8mm","caseMaterial":"316L stainless steel","strap":"Steel bracelet, butterfly clasp","glass":"Sapphire-coated mineral","waterResistance":"100m"}'::jsonb, false, true, 0),
  ('marine-heritage', 'Marine Heritage', 'Navy leather · 41mm', 'Deep navy dial, rose-gold hands and a croc-grain leather strap. A dress watch with enough colour to wear with denim on the weekend.', 'classic', 29900, null, 10, '/images/p-marine.jpg',
   '{"movement":"Japanese quartz","caseSize":"41mm × 9.5mm","caseMaterial":"Rose-gold PVD steel","strap":"Navy croc-grain leather","glass":"Sapphire-coated mineral","waterResistance":"50m"}'::jsonb, false, true, 1),
  ('panda-chronograph', 'Panda Chronograph', 'Calfskin · 39mm', 'The racing chronograph that never went out of style: cream dial, black sub-dials and a tachymeter bezel, on a soft brown calfskin strap.', 'classic', 34500, 41000, 10, '/images/p-panda.jpg',
   '{"movement":"Quartz chronograph","caseSize":"39mm × 12mm","caseMaterial":"316L stainless steel","strap":"Brown calfskin leather","glass":"Sapphire crystal","waterResistance":"50m"}'::jsonb, false, true, 2),
  ('abyss-diver', 'Abyss Diver 300', 'Oyster steel · 42mm', 'A professional-spec diver with a unidirectional ceramic bezel, generous lume and a screw-down crown. Rated to 300 metres; happiest at the pool or the office.', 'sports', 52000, null, 10, '/images/p-abyss.jpg',
   '{"movement":"Automatic, 41-hour reserve","caseSize":"42mm × 13.5mm","caseMaterial":"316L stainless steel","strap":"Oyster-style steel bracelet","glass":"Sapphire crystal","waterResistance":"300m"}'::jsonb, false, true, 3),
  ('regent-two-tone', 'Regent Two-Tone', 'Jubilee bracelet · 36mm', 'Gold and steel, a fluted bezel and a chocolate dial set with diamond-cut markers. A wedding-season watch that earns its place the rest of the year.', 'luxury', 47500, 55000, 10, '/images/p-regent.jpg',
   '{"movement":"Automatic, 40-hour reserve","caseSize":"36mm × 11mm","caseMaterial":"Two-tone steel, gold PVD","strap":"Five-link jubilee bracelet","glass":"Sapphire crystal","waterResistance":"100m"}'::jsonb, false, true, 4),
  ('field-chrono', 'Field Chronograph', 'Gunmetal · 44mm', 'Gunmetal case, textured dial and copper accents. A big, honest tool watch for the drive north and the long weekend after it.', 'sports', 24900, null, 10, '/images/p-field.jpg',
   '{"movement":"Quartz chronograph","caseSize":"44mm × 12.5mm","caseMaterial":"Gunmetal-plated steel","strap":"Mesh steel bracelet","glass":"Mineral crystal","waterResistance":"100m"}'::jsonb, false, true, 5),
  ('coastline', 'Coastline', 'Sky blue strap · 40mm', 'A crisp white dial with Arabic twelve, a date at three and a sky-blue rubberised leather strap. Summer, distilled.', 'minimalist', 19500, 23000, 10, '/images/p-coast.jpg',
   '{"movement":"Automatic, 38-hour reserve","caseSize":"40mm × 10.5mm","caseMaterial":"Brushed stainless steel","strap":"Sky blue rubberised leather","glass":"Sapphire-coated mineral","waterResistance":"50m"}'::jsonb, false, true, 6),
  ('midnight-dress', 'Midnight Dress', 'Black leather · 38mm', 'Black dial, black leather, a slim polished case. Midnight slips under a shirt cuff and stays there — exactly what a dress watch should do.', 'business', 27500, null, 10, '/images/p-midnight.jpg',
   '{"movement":"Japanese quartz","caseSize":"38mm × 8.2mm","caseMaterial":"Polished stainless steel","strap":"Black Italian leather","glass":"Sapphire-coated mineral","waterResistance":"30m"}'::jsonb, false, true, 7),
  ('sovereign-gold', 'Sovereign Gold', 'Gold bracelet · 40mm', 'Our flagship. A champagne dial, fluted bezel and an integrated gold bracelet with a hidden clasp. Made for the moments people photograph.', 'luxury', 64500, null, 10, '/images/hero-gold.jpg',
   '{"movement":"Automatic, 42-hour reserve","caseSize":"40mm × 11.5mm","caseMaterial":"Gold PVD steel","strap":"Integrated gold bracelet","glass":"Sapphire crystal","waterResistance":"100m"}'::jsonb, true, false, 8),
  ('atlas-gmt', 'Atlas GMT', 'Black bezel · 41mm', 'A second time zone on a 24-hour ceramic bezel, for the man who lives between Lahore, Dubai and London. Black, steel and quietly technical.', 'luxury', 58000, 64000, 10, '/images/c-luxury.jpg',
   '{"movement":"Automatic GMT, 42-hour reserve","caseSize":"41mm × 12.5mm","caseMaterial":"316L stainless steel","strap":"Oyster-style steel bracelet","glass":"Sapphire crystal","waterResistance":"200m"}'::jsonb, true, false, 9),
  ('heritage-leather', 'Heritage Leather', 'Brown leather · 40mm', 'A silver-white dial, dauphine hands and a dark-brown leather strap that softens with every wear. The watch your father would recognise.', 'classic', 26500, null, 10, '/images/c-classic.jpg',
   '{"movement":"Japanese quartz","caseSize":"40mm × 9.8mm","caseMaterial":"Polished stainless steel","strap":"Dark brown leather","glass":"Sapphire-coated mineral","waterResistance":"50m"}'::jsonb, true, false, 10),
  ('lune', 'Lune', 'Taupe suede · 38mm', 'Two hands, twelve hairline markers and nothing else. A 38mm steel case on a taupe suede strap — the lightest watch we sell.', 'minimalist', 17500, null, 10, '/images/c-minimal.jpg',
   '{"movement":"Swiss quartz","caseSize":"38mm × 7.5mm","caseMaterial":"Brushed stainless steel","strap":"Taupe suede","glass":"Sapphire crystal","waterResistance":"30m"}'::jsonb, true, false, 11),
  ('nordic-slim', 'Nordic Slim', 'Tan leather · 40mm', 'A Scandinavian-inspired white dial with a slim silver case and tan leather strap. Clean enough for a suit, relaxed enough for a kurta.', 'minimalist', 21000, 24500, 10, '/images/why-minimal.jpg',
   '{"movement":"Japanese quartz","caseSize":"40mm × 7.8mm","caseMaterial":"Polished stainless steel","strap":"Tan Italian leather","glass":"Sapphire-coated mineral","waterResistance":"30m"}'::jsonb, false, false, 12),
  ('bordeaux-automatic', 'Bordeaux Automatic', 'Slate dial · 39mm', 'A slate-grey sunburst dial, a slim fluted bezel and a three-link bracelet. Quiet authority, from the boardroom to dinner afterwards.', 'business', 42000, null, 10, '/images/c-business.jpg',
   '{"movement":"Automatic, 42-hour reserve","caseSize":"39mm × 11mm","caseMaterial":"316L stainless steel","strap":"Three-link steel bracelet","glass":"Sapphire crystal","waterResistance":"100m"}'::jsonb, true, false, 13),
  ('apex-chronograph', 'Apex Chronograph', 'Ceramic bezel · 43mm', 'Grey dial, orange accents and a ceramic tachymeter bezel. Built for speed — and for the stopwatch you''ll actually use at the nets.', 'sports', 49500, null, 10, '/images/c-sports.jpg',
   '{"movement":"Automatic chronograph","caseSize":"43mm × 14mm","caseMaterial":"316L stainless steel","strap":"Steel bracelet, fold-over clasp","glass":"Sapphire crystal","waterResistance":"100m"}'::jsonb, true, false, 14)
on conflict (id) do nothing;
