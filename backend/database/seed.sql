-- Seed Data for Traditional Telugu Knowledge & PDF Reader App

-- App Settings
INSERT INTO app_settings (setting_key, setting_value) VALUES
('app_title', 'సాంప్రదాయిక జ్ఞాన తరంగిణి'),
('app_subtitle', 'వేద సంప్రదాయ & ఆయుర్వేద విజ్ఞాన గ్రంథాలు'),
('primary_wood_color', '#75451F'),
('accent_color', '#168FA8'),
('text_color', '#D8E8A0'),
('background_image', '/assets/backgrounds/traditional_bg.jpg'),
('footer_credit', 'V B S Sarma Kompella');

-- Admin User (Password: admin123)
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Administrator', 'admin@vedicknowledge.org', '$2y$10$t9YuxBV/U534no/DhheoRutSF5UGYY4EvCcKLjhiFIk6Elgo12lmC', 'admin', 1);

-- Default 3 Categories (As requested in specifications & matching reference)
INSERT INTO categories (id, title, description, icon, display_order, is_active) VALUES
(1, 'సంప్రదాయ', 'సనాతన ధర్మ వేద సంహితలు మరియు సాంప్రదాయిక విజ్ఞానం', 'scroll', 1, 1),
(2, 'బ్రాహ్మణం', 'యజ్ఞ యాగాదుల అంతరార్థాలు మరియు వైదిక విధులకు సంబంధించిన వివరణలు', 'book', 2, 1),
(3, 'ఆరోగ్యం', 'సాంప్రదాయిక ఆయుర్వేద జీవనశైలి మరియు ఆరోగ్య సూత్రాలు', 'heart', 3, 1);

-- Category 1 (సంప్రదాయ) - 7 Chapters (1వ అష్టము to 7వ అష్టము)
INSERT INTO chapters (id, category_id, title, description, chapter_number, display_order, is_published) VALUES
(1, 1, '1 వ అష్టము', 'ప్రథమ అష్టకము - దర్శపూర్ణమాస ప్రకరణము', 1, 1, 1),
(2, 1, '2 వ అష్టము', 'ద్వితీయ అష్టకము - అగ్నిష్టోమ మంత్రములు', 2, 2, 1),
(3, 1, '3 వ అష్టము', 'తృతీయ అష్టకము - వాజపేయ యాగ క్రమము', 3, 3, 1),
(4, 1, '4 వ అష్టము', 'చతుర్థ అష్టకము - రాజసూయ యాగ విశేషాలు', 4, 4, 1),
(5, 1, '5 వ అష్టము', 'పంచమ అష్టకము - చయనాది హోమ విధులు', 5, 5, 1),
(6, 1, '6 వ అష్టము', 'షష్ఠ అష్టకము - అశ్వమేధ మంత్ర ప్రవచనం', 6, 6, 1),
(7, 1, '7 వ అష్టము', 'సప్తమ అష్టకము - సౌత్రామణి తత్త్వ వివేచన', 7, 7, 1);

-- Category 2 (బ్రాహ్మణం) - 4 Chapters
INSERT INTO chapters (id, category_id, title, description, chapter_number, display_order, is_published) VALUES
(8, 2, '1 వ ప్రపాఠకం', 'ప్రపాఠకము ఒకటి - సత్రయాగ దర్శనము', 1, 1, 1),
(9, 2, '2 వ ప్రపాఠకం', 'ప్రపాఠకము రెండు - సోమయాగ రహస్యాలు', 2, 2, 1),
(10, 2, '3 వ ప్రపాఠకం', 'ప్రపాఠకము మూడు - హవిర్యజ్ఞ అంతరార్థం', 3, 3, 1),
(11, 2, '4 వ ప్రపాఠకం', 'ప్రపాఠకము నాలుగు - పవిత్ర దర్భాభిషేకము', 4, 4, 1);

-- Category 3 (ఆరోగ్యం) - 4 Chapters
INSERT INTO chapters (id, category_id, title, description, chapter_number, display_order, is_published) VALUES
(12, 3, '1 వ విభాగం', 'దినచర్య - ప్రాచీన నిత్య జీవన విధానము', 1, 1, 1),
(13, 3, '2 వ విభాగం', 'ఋతుచర్య - కాల విభాగము & శరీర రక్షణ', 2, 2, 1),
(14, 3, '3 వ విభాగం', 'దివ్య ఔషధ గుణాలు - వనమూలికల వైశిష్ట్యం', 3, 3, 1),
(15, 3, '4 వ విభాగం', 'ప్రాణాయామం & యోగ చికిత్స', 4, 4, 1);

-- Subtopics for Chapter 1 (1వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(1, 1, 'ఇషే త్వా', 'ప్రథమ అనువాకము - పవిత్ర ధాన్య సంచయన మంత్రము', 1, 1),
(2, 1, 'ఆప ఉన్దన్తు', 'ద్వితీయ అనువాకము - పవిత్ర జల శుద్ధి మంత్రార్పణ', 2, 1),
(3, 1, 'దేవస్య త్వా', 'తృతీయ అనువాకము - దేవతా సమర్పణ విధి', 3, 1),
(4, 1, 'ఆదదే', 'చతుర్థ అనువాకము - హవిర్ గ్రహణ ప్రక్రియ', 4, 1),
(5, 1, 'దేవాసురాః', 'పంచమ అనువాకము - దేవాసుర సంగ్రామ రహస్యము', 5, 1),
(6, 1, 'సన్త్వా సిఞ్చామి', 'షష్ఠ అనువాకము - అభిషేక జల సింజన విధి', 6, 1),
(7, 1, 'పాక యజ్ఞం', 'సప్తమ అనువాకము - గృహస్థ పాక యజ్ఞ నియమాలు', 7, 1),
(8, 1, 'అనుమత్యై', 'అష్టమ అనువాకము - అనుమతీ దేవీ ప్రార్థన', 8, 1);

-- Subtopics for Chapter 2 (2వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(9, 2, 'అగ్నిమీళే పురోహితం', 'అగ్నిదేవ స్తుతి & యజ్ఞ పురోహితత్వం', 1, 1),
(10, 2, 'వాయవాయాహి దర్శత', 'వాయుదేవ ఆహ్వాన మంత్రములు', 2, 1),
(11, 2, 'ఇంద్రవాయూ ఇమే సుతాః', 'ఇంద్ర వాయు సమైక్య సమర్పణ', 3, 1),
(12, 2, 'మిత్రం హువే పూతదక్షం', 'మిత్ర-వరుణ దేవతల దివ్య ప్రాశస్త్యం', 4, 1),
(13, 2, 'అశ్వినా యజ్వరీరిషో', 'అశ్వినీ దేవతల దివ్య భేషజ మహిమ', 5, 1);

-- Subtopics for Chapter 3 (3వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(14, 3, 'ప్రాజాపత్యం', 'ప్రజాపతి సృష్టి సంకల్ప విశ్లేషణ', 1, 1),
(15, 3, 'సౌమ్యం', 'చంద్ర తత్త్వ ఆరాధన విధానం', 2, 1),
(16, 3, 'వైశ్వదేవం', 'విశ్వేదేవతల సర్వతోముఖ మంగళ హవిస్సు', 3, 1),
(17, 3, 'సారస్వతం', 'సరస్వతీ దేవి వాగ్వైభవం', 4, 1);

-- Subtopics for Chapter 4 (4వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(18, 4, 'రాజసూయ విధి', 'సార్వభౌమ చక్రవర్తుల అభిషేక క్రమం', 1, 1),
(19, 4, 'దిగ్విజయ ప్రార్థన', 'చతుర్దిశల దేవతల ఆశీర్వాద సూక్తం', 2, 1),
(20, 4, 'రత్ని హవిస్సులు', 'రాష్ట్ర పాలన & మంత్రుల కర్తవ్య విధి', 3, 1),
(21, 4, 'వార్త్రఘ్న శస్త్రం', 'రాష్ట్ర రక్షణ & శత్రు నిర్మూలన మంత్రం', 4, 1);

-- Subtopics for Chapter 5 (5వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(22, 5, 'అగ్నిచయన క్రమము', 'గరుడ పక్ష్యాకార యజ్ఞవేదిక నిర్మాణం', 1, 1),
(23, 5, 'ఇష్టకా పూజనము', 'యజ్ఞ ఇటుకల మంత్ర పూతాభిమంత్రణ', 2, 1),
(24, 5, 'శతరూద్రీయ విభాగం', 'మహా రుద్ర భగవానుని సహస్ర నామార్చన', 3, 1),
(25, 5, 'వసోర్ధార మంత్రాలు', 'ఘృతధారల ద్వారా సమగ్ర విశ్వ కళ్యాణం', 4, 1);

-- Subtopics for Chapter 6 (6వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(26, 6, 'అశ్వమేధ సంకల్పం', 'సమ్రాట్ అశ్వమేధ యాగ దివ్య ప్రారంభం', 1, 1),
(27, 6, 'బ్రహ్మోద్య చర్చ', 'విశ్వ రహస్యాలు & పరబ్రహ్మ తత్త్వ విచారణ', 2, 1),
(28, 6, 'అవభృథ స్నాన విధి', 'యాగాంత పవిత్ర మంగళ స్నాన మహోత్సవం', 3, 1);

-- Subtopics for Chapter 7 (7వ అష్టము)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(29, 7, 'సౌత్రామణి యాగం', 'ఇంద్రియ పునరుజ్జీవన & బలోపేత విధి', 1, 1),
(30, 7, 'సురాపాన నివారణ', 'శుద్ధి క్రతువు & సత్వగుణ ప్రతిష్ఠాపన', 2, 1),
(31, 7, 'సర్వతోముఖ ఆశీర్వాదం', 'సకల లోక శాంతి మహా మంత్రార్పణ', 3, 1);

-- Subtopics for Category 2 (బ్రాహ్మణం) - Chapter 8
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(32, 8, 'సత్రయాగ విధానం', 'దీర్ఘ సత్రయాగముల కల్ప సూత్రాలు', 1, 1),
(33, 8, 'సోమయాగ క్రమం', 'సోమలత గ్రహణ & రస సంగ్రహణ ప్రక్రియ', 2, 1),
(34, 8, 'హవిర్యజ్ఞ ప్రక్రియ', 'అష్టాదశ హవిస్సుల శాస్త్రీయ విశేషాలు', 3, 1);

-- Subtopics for Category 2 (బ్రాహ్మణం) - Chapter 9
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(35, 9, 'అగ్నిష్టోమ సమాప్తి', 'ప్రథమ సోమసంస్థా పూర్ణాహుతి విశేషాలు', 1, 1),
(36, 9, 'ఉక్థ్య క్రతు విధి', 'స్తోత్ర శస్త్రముల గాన విశేషాలు', 2, 1),
(37, 9, 'షోడశి ప్రకరణం', 'షోడశ కళా సంపూర్ణ యాగ మంత్రాలు', 3, 1);

-- Subtopics for Category 2 (బ్రాహ్మణం) - Chapter 10
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(38, 10, 'వాజపేయ రథారోహణం', 'విజయ రథారోహణ మంత్రోచ్ఛారణ', 1, 1),
(39, 10, 'సురా గ్రహ విధి', 'వైదిక ఔషధ రస సేవన నియమాలు', 2, 1),
(40, 10, 'ఛత్ర ధారణ క్రమం', 'సామ్రాజ్య శ్వేతచ్ఛత్ర పవిత్ర స్థాపన', 3, 1);

-- Subtopics for Category 2 (బ్రాహ్మణం) - Chapter 11
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(41, 11, 'దర్భాభిషేకము', 'పవిత్ర దర్భల ప్రాశస్త్యం & అధివాసన', 1, 1),
(42, 11, 'బ్రహ్మయజ్ఞ కల్పం', 'నిత్య వేదాధ్యయన & ఋషి తర్పణ విధి', 2, 1),
(43, 11, 'పితృమేధ సూక్తం', 'పితృదేవతల తరణ & పుణ్యలోక ప్రాప్తి', 3, 1);

-- Subtopics for Category 3 (ఆరోగ్యం) - Chapter 12
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(44, 12, 'బ్రాహ్మీ ముహూర్త జాగరణ', 'సూర్యోదయానికి ముందటి అమృత ఘడియల ఆరోగ్య రహస్యం', 1, 1),
(45, 12, 'దంతధావన పద్ధతులు', 'వేప, కానుగ తదితర ప్రకృతి సిద్ధ కాష్ఠ దంతధావనం', 2, 1),
(46, 12, 'అభ్యంగన స్నాన ఫలాలు', 'నువ్వుల నూనెతో తైలమర్దన ఆయుర్వేద ఫలితాలు', 3, 1),
(47, 12, 'సాత్వికాహార నియమాలు', 'శరీర ప్రకృతికి తగిన మిత, హిత, ఋత ఆహార విధి', 4, 1);

-- Subtopics for Category 3 (ఆరోగ్యం) - Chapter 13
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(48, 13, 'వసంత ఋతు విధానం', 'కఫ శమనము & వేప పూత ఆహార నియమం', 1, 1),
(49, 13, 'గ్రీష్మ ఋతు రక్షణ', 'వాత పిత్త సమతుల్యత & శీతల పానీయాలు', 2, 1),
(50, 13, 'వర్ష ఋతు జాగ్రత్తలు', 'అగ్నిమాంద్య నివారణ & శొంఠి కషాయ విధి', 3, 1),
(51, 13, 'హేమంత ఋతు బలం', 'ధాతు పుష్టి & పోషకాహార సేకరణ', 4, 1);

-- Subtopics for Category 3 (ఆరోగ్యం) - Chapter 14
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(52, 14, 'తులసీ మహిమ', 'సర్వ రోగ నివారిణి & ప్రాణవాయు శుద్ధి', 1, 1),
(53, 14, 'అశ్వగంధ ప్రాశస్త్యం', 'శారీరక ధారుఢ్యం, మనశ్శాంతి & నిద్రా ప్రదాత', 2, 1),
(54, 14, 'త్రిఫల చూర్ణ విధి', 'శరీర శోధన, నేత్ర రక్షణ & దీర్ఘాయువు', 3, 1),
(55, 14, 'గుడూచీ (తిప్పతీగ)', 'రోగనిరోధక శక్తి & జ్వరహర దివ్య మూలిక', 4, 1);

-- Subtopics for Category 3 (ఆరోగ్యం) - Chapter 15
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(56, 15, 'నాడీశోధన ప్రాణాయామం', '72,000 నాడుల సమగ్ర శుద్ధి & మానసిక స్థైర్యం', 1, 1),
(57, 15, 'భ్రామరీ ప్రాణాయామం', 'తీవ్ర మానసిక ఒత్తిడి & నిద్రలేమి నివారణ', 2, 1),
(58, 15, 'సూర్యనమస్కార క్రమం', '12 దివ్య సూర్య మంత్రాలతో శారీరక యోగ సాధన', 3, 1),
(59, 15, 'శవాసన ధ్యాన సమాధి', 'పూర్ణ విశ్రాంతి & ఆత్మ చైతన్య అనుసంధానం', 4, 1);

-- Documents attached to Subtopics
INSERT INTO documents (id, subtopic_id, title, storage_path, original_filename, file_size, mime_type, is_published, allow_download) VALUES
(1, 1, 'ఇషే త్వా - వేద మంత్రం & తాత్పర్యం', 'storage/pdfs/ishe_tva.pdf', 'ishe_tva.pdf', 145200, 'application/pdf', 1, 1),
(2, 2, 'ఆప ఉన్దన్తు - పవిత్ర జల సూక్తం', 'storage/pdfs/aapa_undantu.pdf', 'aapa_undantu.pdf', 132400, 'application/pdf', 1, 1),
(3, 3, 'దేవస్య త్వా - సవితృ దేవతా మంత్ర విధి', 'storage/pdfs/devasya_tva.pdf', 'devasya_tva.pdf', 158900, 'application/pdf', 1, 1),
(4, 4, 'ఆదదే - హవిర్ గ్రహణ ప్రక్రియ', 'storage/pdfs/aadade.pdf', 'aadade.pdf', 121000, 'application/pdf', 1, 1),
(5, 5, 'దేవాసురాః - దేవాసుర సంగ్రామ అంతరార్థం', 'storage/pdfs/devaasuraah.pdf', 'devaasuraah.pdf', 178500, 'application/pdf', 1, 1),
(6, 6, 'సన్త్వా సిఞ్చామి - శాంతి మంత్రం', 'storage/pdfs/santva_sinchaami.pdf', 'santva_sinchaami.pdf', 142100, 'application/pdf', 1, 1),
(7, 7, 'పాక యజ్ఞం - వైదిక గృహ్య సూత్రాలు', 'storage/pdfs/paaka_yajnam.pdf', 'paaka_yajnam.pdf', 195600, 'application/pdf', 1, 1),
(8, 8, 'అనుమత్యై - అనుమతి సూక్తమ్', 'storage/pdfs/anumatyai.pdf', 'anumatyai.pdf', 139000, 'application/pdf', 1, 1),
(9, 9, 'అగ్నిమీళే - ఋగ్వేద ప్రారంభ సూక్తం', 'storage/pdfs/agnimile.pdf', 'agnimile.pdf', 148200, 'application/pdf', 1, 1),
(10, 10, 'వాయు సూక్తం', 'storage/pdfs/vayu_suktam.pdf', 'vayu_suktam.pdf', 138000, 'application/pdf', 1, 1),
(11, 11, 'ఇంద్రవాయు సూక్తం', 'storage/pdfs/indravayu_suktam.pdf', 'indravayu_suktam.pdf', 141000, 'application/pdf', 1, 1),
(12, 12, 'మిత్రావరుణ సూక్తం', 'storage/pdfs/mitravaruna_suktam.pdf', 'mitravaruna_suktam.pdf', 152000, 'application/pdf', 1, 1),
(13, 13, 'అశ్వినీ సూక్తం', 'storage/pdfs/ashvina_suktam.pdf', 'ashvina_suktam.pdf', 134000, 'application/pdf', 1, 1),
(14, 14, 'ప్రాజాపత్య సూక్తం', 'storage/pdfs/prajapatya_suktam.pdf', 'prajapatya_suktam.pdf', 146000, 'application/pdf', 1, 1),
(15, 15, 'సౌమ్య సూక్తం', 'storage/pdfs/saumya_suktam.pdf', 'saumya_suktam.pdf', 139000, 'application/pdf', 1, 1),
(16, 16, 'వైశ్వదేవ సూక్తం', 'storage/pdfs/vaishvadeva_suktam.pdf', 'vaishvadeva_suktam.pdf', 155000, 'application/pdf', 1, 1),
(17, 17, 'సరస్వతీ సూక్తం', 'storage/pdfs/sarasvati_suktam.pdf', 'sarasvati_suktam.pdf', 162000, 'application/pdf', 1, 1),
(18, 18, 'రాజసూయ విధి గ్రంథం', 'storage/pdfs/rajasuya_vidhi.pdf', 'rajasuya_vidhi.pdf', 170000, 'application/pdf', 1, 1),
(19, 19, 'దిగ్విజయ ప్రార్థన పత్రం', 'storage/pdfs/digvijaya_prarthana.pdf', 'digvijaya_prarthana.pdf', 140000, 'application/pdf', 1, 1),
(20, 20, 'రత్ని హవిస్సుల వివరణ', 'storage/pdfs/ratni_havis.pdf', 'ratni_havis.pdf', 148000, 'application/pdf', 1, 1),
(21, 21, 'వార్త్రఘ్న శస్త్రం', 'storage/pdfs/vartraghna_shastram.pdf', 'vartraghna_shastram.pdf', 152000, 'application/pdf', 1, 1),
(22, 22, 'అగ్నిచయన క్రమము', 'storage/pdfs/agnichayana_kramam.pdf', 'agnichayana_kramam.pdf', 185000, 'application/pdf', 1, 1),
(23, 23, 'ఇష్టకా పూజనము', 'storage/pdfs/ishtaka_pujanam.pdf', 'ishtaka_pujanam.pdf', 143000, 'application/pdf', 1, 1),
(24, 24, 'శతరూద్రీయ విభాగం', 'storage/pdfs/shatarudriya_vibhagam.pdf', 'shatarudriya_vibhagam.pdf', 198000, 'application/pdf', 1, 1),
(25, 25, 'వసోర్ధార మంత్రాలు', 'storage/pdfs/vasordhara_mantralu.pdf', 'vasordhara_mantralu.pdf', 165000, 'application/pdf', 1, 1),
(26, 26, 'అశ్వమేధ సంకల్పం', 'storage/pdfs/ashvamedha_sankalpam.pdf', 'ashvamedha_sankalpam.pdf', 180000, 'application/pdf', 1, 1),
(27, 27, 'బ్రహ్మోద్య చర్చ', 'storage/pdfs/brahmodya_charcha.pdf', 'brahmodya_charcha.pdf', 162000, 'application/pdf', 1, 1),
(28, 28, 'అవభృథ స్నాన విధి', 'storage/pdfs/avabhritha_snana.pdf', 'avabhritha_snana.pdf', 154000, 'application/pdf', 1, 1),
(29, 29, 'సౌత్రామణి యాగ విధి', 'storage/pdfs/sautramani_yagam.pdf', 'sautramani_yagam.pdf', 168000, 'application/pdf', 1, 1),
(30, 30, 'శుద్ధి క్రతువు', 'storage/pdfs/shuddhi_kratuvu.pdf', 'shuddhi_kratuvu.pdf', 142000, 'application/pdf', 1, 1),
(31, 31, 'సర్వతోముఖ శాంతి మంత్రాలు', 'storage/pdfs/shanti_mantralu.pdf', 'shanti_mantralu.pdf', 159000, 'application/pdf', 1, 1),
(32, 32, 'సత్రయాగ విధి', 'storage/pdfs/satrayaga_vidhi.pdf', 'satrayaga_vidhi.pdf', 175000, 'application/pdf', 1, 1),
(33, 33, 'సోమయాగ ప్రక్రియ', 'storage/pdfs/somayaga_prakriya.pdf', 'somayaga_prakriya.pdf', 164000, 'application/pdf', 1, 1),
(34, 34, 'హవిర్యజ్ఞ శాస్త్రం', 'storage/pdfs/haviryajna_shastram.pdf', 'haviryajna_shastram.pdf', 172000, 'application/pdf', 1, 1),
(35, 35, 'అగ్నిష్టోమ పూర్ణాహుతి', 'storage/pdfs/agnishtoma_purnahuti.pdf', 'agnishtoma_purnahuti.pdf', 158000, 'application/pdf', 1, 1),
(36, 36, 'ఉక్థ్య క్రతు గానం', 'storage/pdfs/ukthya_kratu.pdf', 'ukthya_kratu.pdf', 149000, 'application/pdf', 1, 1),
(37, 37, 'షోడశి ప్రకరణం', 'storage/pdfs/shodashi_prakaranam.pdf', 'shodashi_prakaranam.pdf', 160000, 'application/pdf', 1, 1),
(38, 38, 'వాజపేయ రథారోహణ మంత్రం', 'storage/pdfs/vajapeya_ratha.pdf', 'vajapeya_ratha.pdf', 155000, 'application/pdf', 1, 1),
(39, 39, 'సురా గ్రహ నియమాలు', 'storage/pdfs/sura_graha.pdf', 'sura_graha.pdf', 147000, 'application/pdf', 1, 1),
(40, 40, 'ఛత్ర ధారణ క్రమం', 'storage/pdfs/chhatra_dharana.pdf', 'chhatra_dharana.pdf', 151000, 'application/pdf', 1, 1),
(41, 41, 'దర్భాభిషేక మహా ప్రాశస్త్యం', 'storage/pdfs/darbhabhishekam.pdf', 'darbhabhishekam.pdf', 144000, 'application/pdf', 1, 1),
(42, 42, 'బ్రహ్మయజ్ఞ కల్పం', 'storage/pdfs/brahmayajna_kalpam.pdf', 'brahmayajna_kalpam.pdf', 167000, 'application/pdf', 1, 1),
(43, 43, 'పితృమేధ సూక్తం', 'storage/pdfs/pitrimedha_suktam.pdf', 'pitrimedha_suktam.pdf', 158000, 'application/pdf', 1, 1),
(44, 44, 'బ్రాహ్మీ ముహూర్తం - ఆయుర్వేద జీవనశైలి మార్గదర్శిని', 'storage/pdfs/brahmi_muhurtam.pdf', 'brahmi_muhurtam.pdf', 165400, 'application/pdf', 1, 1),
(45, 45, 'దంతధావన విధి', 'storage/pdfs/dantadhawana_vidhi.pdf', 'dantadhawana_vidhi.pdf', 138000, 'application/pdf', 1, 1),
(46, 46, 'అభ్యంగన స్నాన విధానం', 'storage/pdfs/abhyangana_snanam.pdf', 'abhyangana_snanam.pdf', 152000, 'application/pdf', 1, 1),
(47, 47, 'సాత్వికాహార సూత్రాలు', 'storage/pdfs/satvikahara_sutralu.pdf', 'satvikahara_sutralu.pdf', 160000, 'application/pdf', 1, 1),
(48, 48, 'వసంత ఋతు జీవన విధానం', 'storage/pdfs/vasanta_ritucharya.pdf', 'vasanta_ritucharya.pdf', 145000, 'application/pdf', 1, 1),
(49, 49, 'గ్రీష్మ ఋతు సంరక్షణ మార్గదర్శిని', 'storage/pdfs/grishma_ritucharya.pdf', 'grishma_ritucharya.pdf', 149000, 'application/pdf', 1, 1),
(50, 50, 'వర్ష ఋతు ఆరోగ్య జాగ్రత్తలు', 'storage/pdfs/varsha_ritucharya.pdf', 'varsha_ritucharya.pdf', 153000, 'application/pdf', 1, 1),
(51, 51, 'హేమంత ఋతు బలోపేతం', 'storage/pdfs/hemanta_ritucharya.pdf', 'hemanta_ritucharya.pdf', 147000, 'application/pdf', 1, 1),
(52, 52, 'తులసీ దివ్య ఔషధ గుణాలు', 'storage/pdfs/tulasi_mahimah.pdf', 'tulasi_mahimah.pdf', 168000, 'application/pdf', 1, 1),
(53, 53, 'అశ్వగంధ ప్రాశస్త్యం & ప్రయోజనాలు', 'storage/pdfs/ashwagandha_prashastyam.pdf', 'ashwagandha_prashastyam.pdf', 174000, 'application/pdf', 1, 1),
(54, 54, 'త్రిఫల చూర్ణ విధి & ఉపయోగాలు', 'storage/pdfs/triphala_churnam.pdf', 'triphala_churnam.pdf', 162000, 'application/pdf', 1, 1),
(55, 55, 'గుడూచీ (తిప్పతీగ) సంజీవని', 'storage/pdfs/guduchi_sanjeevani.pdf', 'guduchi_sanjeevani.pdf', 159000, 'application/pdf', 1, 1),
(56, 56, 'నాడీశోధన ప్రాణాయామ సాధన', 'storage/pdfs/nadishodhana_pranayama.pdf', 'nadishodhana_pranayama.pdf', 182000, 'application/pdf', 1, 1),
(57, 57, 'భ్రామరీ ప్రాణాయామ విధానం', 'storage/pdfs/bhramari_pranayama.pdf', 'bhramari_pranayama.pdf', 166000, 'application/pdf', 1, 1),
(58, 58, 'సూర్యనమస్కార సమగ్ర పద్ధతి', 'storage/pdfs/suryanamaskara_samagram.pdf', 'suryanamaskara_samagram.pdf', 195000, 'application/pdf', 1, 1),
(59, 59, 'శవాసన ధ్యాన రహస్యం', 'storage/pdfs/shavasana_dhyanam.pdf', 'shavasana_dhyanam.pdf', 156000, 'application/pdf', 1, 1);
