-- ============================================
-- TechnoCure — Seed Data (Demo)
-- ============================================
-- NOTE: Run AFTER schema.sql. This is demo data only.

-- ── Demo Printers ─────────────────────────────
insert into public.printers (name, brand, model, category, description, price, stock_quantity, warranty, features) values
(
  'HP LaserJet Pro M404dn',
  'HP', 'LaserJet Pro M404dn', 'Laser',
  'Professional monochrome laser printer designed for small to medium workgroups. Fast, reliable, and cost-effective for high-volume printing.',
  5499.00, 8, '1 Year On-Site',
  ARRAY['40 ppm print speed','Automatic duplex printing','Gigabit Ethernet + USB','250-sheet input tray','Hi-Speed USB 2.0']
),
(
  'Canon imageCLASS MF445dw',
  'Canon', 'imageCLASS MF445dw', 'Multifunction',
  'Monochrome laser all-in-one with print, copy, scan and fax capabilities. Ideal for busy offices needing versatile document handling.',
  6299.00, 5, '1 Year Carry-in',
  ARRAY['Print, Copy, Scan, Fax','38 ppm print speed','Wireless and USB connectivity','250-sheet cassette + 50-sheet multipurpose tray','Mobile printing support']
),
(
  'Brother HL-L2350DW',
  'Brother', 'HL-L2350DW', 'Laser',
  'Compact, reliable monochrome laser printer perfect for home offices and small workgroups. Easy wireless setup.',
  3299.00, 12, '1 Year Carry-in',
  ARRAY['30 ppm print speed','Automatic duplex','Wireless + USB','250-sheet capacity','Compact design']
),
(
  'Epson EcoTank ET-2800',
  'Epson', 'EcoTank ET-2800', 'Inkjet',
  'Ultra-low cost inkjet with supersized refillable ink tanks. No cartridges — just fill and print. Great for homes and small offices.',
  2899.00, 15, '1 Year Carry-in',
  ARRAY['Refillable ink tanks','Print, Scan, Copy','Wireless and USB','Up to 4,500 pages black / 7,500 colour per bottle set','Borderless photo printing']
),
(
  'Kyocera ECOSYS P2235dw',
  'Kyocera', 'ECOSYS P2235dw', 'Laser',
  'Long-life monochrome laser printer with Kyocera ECOSYS technology for ultra-low cost per page. Built for reliability in demanding environments.',
  4799.00, 6, '1 Year On-Site',
  ARRAY['35 ppm print speed','Duplex printing standard','Wi-Fi + Ethernet + USB','250-sheet paper drawer','ECOSYS long-life components']
);

-- ── Demo Parts ────────────────────────────────
insert into public.parts (name, brand, part_number, description, price, stock_quantity, low_stock_threshold) values
(
  'HP LaserJet Fuser Unit 110V',
  'HP', 'RM1-6739-000CN',
  'Genuine HP fuser assembly for LaserJet series. Fuses toner onto paper using heat and pressure. Replace when experiencing smearing or fusing issues.',
  1299.00, 4, 3
),
(
  'Canon Drum Unit 064 Black',
  'Canon', '3756C001',
  'Genuine Canon drum unit compatible with imageCLASS MF and LBP series. High yield drum for extended printing between replacements.',
  899.00, 7, 3
),
(
  'HP Pickup Roller Kit',
  'HP', 'RM1-4006-000CN',
  'Paper pickup roller assembly. Replace when experiencing paper feed issues, paper jams, or misfeeds. Includes pickup roller and separation pad.',
  459.00, 10, 5
),
(
  'HP LaserJet Maintenance Kit 220V',
  'HP', 'Q7543-67910',
  'Comprehensive maintenance kit including fuser, transfer roller, and paper feed rollers. Recommended at 225,000 page intervals.',
  2199.00, 3, 2
),
(
  'Epson DX5 Printhead',
  'Epson', 'F186000',
  'Replacement printhead for Epson DX5-based wide format and desktop inkjet printers. Restore print quality and eliminate nozzle blockages.',
  3499.00, 2, 2
);

-- ── Demo Part Compatibility ───────────────────
-- HP Fuser
insert into public.part_compatibility (part_id, printer_brand, printer_model)
select id, 'HP', 'LaserJet P2055' from public.parts where part_number = 'RM1-6739-000CN'
union all
select id, 'HP', 'LaserJet P2055d' from public.parts where part_number = 'RM1-6739-000CN'
union all
select id, 'HP', 'LaserJet P2055dn' from public.parts where part_number = 'RM1-6739-000CN';

-- Canon Drum
insert into public.part_compatibility (part_id, printer_brand, printer_model)
select id, 'Canon', 'imageCLASS MF445dw' from public.parts where part_number = '3756C001'
union all
select id, 'Canon', 'imageCLASS MF445dw' from public.parts where part_number = '3756C001'
union all
select id, 'Canon', 'LBP632Cdw' from public.parts where part_number = '3756C001';

-- HP Pickup Roller
insert into public.part_compatibility (part_id, printer_brand, printer_model)
select id, 'HP', 'LaserJet M1005' from public.parts where part_number = 'RM1-4006-000CN'
union all
select id, 'HP', 'LaserJet P1005' from public.parts where part_number = 'RM1-4006-000CN';
