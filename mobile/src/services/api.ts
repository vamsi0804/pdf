// mobile/src/services/api.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Category, Chapter, Subtopic, Document, AppSettings } from '../types';

const DEV_PC_IP = '192.168.0.5';

export const getBaseUrl = (): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname || '127.0.0.1';
    return `http://${host}:8000/api`;
  }

  // Detect PC host IP from Expo Metro connection (works for physical phones over Wi-Fi!)
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000/api`;
    }
  }

  // Primary development LAN IP for real devices on Wi-Fi
  return `http://${DEV_PC_IP}:8000/api`;
};

export const API_BASE = getBaseUrl();

// FULL DEMO CATEGORIES (Matches Admin Database)
export const DEMO_CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'సంప్రదాయ',
    description: 'సనాతన ధర్మ వేద సంహితలు మరియు సాంప్రదాయిక విజ్ఞానం',
    icon: 'scroll',
    display_order: 1,
    is_active: 1,
    chapters_count: 7,
  },
  {
    id: 2,
    title: 'బ్రాహ్మణం',
    description: 'యజ్ఞ యాగాదుల అంతరార్థాలు మరియు వైదిక విధులకు సంబంధించిన వివరణలు',
    icon: 'book',
    display_order: 2,
    is_active: 1,
    chapters_count: 4,
  },
  {
    id: 3,
    title: 'ఆరోగ్యం',
    description: 'సాంప్రదాయిక ఆయుర్వేద జీవనశైలి మరియు ఆరోగ్య సూత్రాలు',
    icon: 'heart',
    display_order: 3,
    is_active: 1,
    chapters_count: 4,
  },
];

// FULL DEMO CHAPTERS (Matches all 15 Chapters)
export const DEMO_CHAPTERS: Chapter[] = [
  // Category 1: సంప్రదాయ (7 Ashtakas)
  { id: 1, category_id: 1, title: '1 వ అష్టము', description: 'ప్రథమ అష్టకము - దర్శపూర్ణమాస ప్రకరణము', chapter_number: 1, display_order: 1, is_published: 1, subtopics_count: 8 },
  { id: 2, category_id: 1, title: '2 వ అష్టము', description: 'ద్వితీయ అష్టకము - అగ్నిష్టోమ మంత్రములు', chapter_number: 2, display_order: 2, is_published: 1, subtopics_count: 5 },
  { id: 3, category_id: 1, title: '3 వ అష్టము', description: 'తృతీయ అష్టకము - వాజపేయ యాగ క్రమము', chapter_number: 3, display_order: 3, is_published: 1, subtopics_count: 4 },
  { id: 4, category_id: 1, title: '4 వ అష్టము', description: 'చతుర్థ అష్టకము - రాజసూయ యాగ విశేషాలు', chapter_number: 4, display_order: 4, is_published: 1, subtopics_count: 4 },
  { id: 5, category_id: 1, title: '5 వ అష్టము', description: 'పంచమ అష్టకము - చయనాది హోమ విధులు', chapter_number: 5, display_order: 5, is_published: 1, subtopics_count: 4 },
  { id: 6, category_id: 1, title: '6 వ అష్టము', description: 'షష్ఠ అష్టకము - అశ్వమేధ మంత్ర ప్రవచనం', chapter_number: 6, display_order: 6, is_published: 1, subtopics_count: 3 },
  { id: 7, category_id: 1, title: '7 వ అష్టము', description: 'సప్తమ అష్టకము - సౌత్రామణి తత్త్వ వివేచన', chapter_number: 7, display_order: 7, is_published: 1, subtopics_count: 3 },

  // Category 2: బ్రాహ్మణం (4 Prapathakas)
  { id: 8, category_id: 2, title: '1 వ ప్రపాఠకం', description: 'ప్రపాఠకము ఒకటి - సత్రయాగ దర్శనము', chapter_number: 1, display_order: 1, is_published: 1, subtopics_count: 3 },
  { id: 9, category_id: 2, title: '2 వ ప్రపాఠకం', description: 'ప్రపాఠకము రెండు - సోమయాగ రహస్యాలు', chapter_number: 2, display_order: 2, is_published: 1, subtopics_count: 3 },
  { id: 10, category_id: 2, title: '3 వ ప్రపాఠకం', description: 'ప్రపాఠకము మూడు - హవిర్యజ్ఞ అంతరార్థం', chapter_number: 3, display_order: 3, is_published: 1, subtopics_count: 3 },
  { id: 11, category_id: 2, title: '4 వ ప్రపాఠకం', description: 'ప్రపాఠకము నాలుగు - పవిత్ర దర్భాభిషేకము', chapter_number: 4, display_order: 4, is_published: 1, subtopics_count: 3 },

  // Category 3: ఆరోగ్యం (4 Ayurvedic sections)
  { id: 12, category_id: 3, title: '1 వ విభాగం', description: 'దినచర్య - ప్రాచీన నిత్య జీవన విధానము', chapter_number: 1, display_order: 1, is_published: 1, subtopics_count: 4 },
  { id: 13, category_id: 3, title: '2 వ విభాగం', description: 'ఋతుచర్య - కాల విభాగము & శరీర రక్షణ', chapter_number: 2, display_order: 2, is_published: 1, subtopics_count: 4 },
  { id: 14, category_id: 3, title: '3 వ విభాగం', description: 'దివ్య ఔషధ గుణాలు - వనమూలికల వైశిష్ట్యం', chapter_number: 3, display_order: 3, is_published: 1, subtopics_count: 4 },
  { id: 15, category_id: 3, title: '4 వ విభాగం', description: 'ప్రాణాయామం & యోగ చికిత్స', chapter_number: 4, display_order: 4, is_published: 1, subtopics_count: 4 },
];

// FULL DEMO SUBTOPICS (Matches all 59 Subtopics across 15 Chapters)
export const DEMO_SUBTOPICS: Subtopic[] = [
  // Chapter 1: 1వ అష్టము (సంప్రదాయ)
  { id: 1, chapter_id: 1, title: 'ఇషే త్వా', description: 'ప్రథమ అనువాకము - పవిత్ర ధాన్య సంచయన మంత్రము', display_order: 1, is_published: 1, has_document: 1, document_id: 1, document_title: 'ఇషే త్వా - వేద మంత్రం & తాత్పర్యం', document_file_size: 145200, document_allow_download: 1 },
  { id: 2, chapter_id: 1, title: 'ఆప ఉన్దన్తు', description: 'ద్వితీయ అనువాకము - పవిత్ర జల శుద్ధి మంత్రార్పణ', display_order: 2, is_published: 1, has_document: 1, document_id: 2, document_title: 'ఆప ఉన్దన్తు - పవిత్ర జల సూక్తం', document_file_size: 132400, document_allow_download: 1 },
  { id: 3, chapter_id: 1, title: 'దేవస్య త్వా', description: 'తృతీయ అనువాకము - దేవతా సమర్పణ విధి', display_order: 3, is_published: 1, has_document: 1, document_id: 3, document_title: 'దేవస్య త్వా - సవితృ దేవతా మంత్ర విధి', document_file_size: 158900, document_allow_download: 1 },
  { id: 4, chapter_id: 1, title: 'ఆదదే', description: 'చతుర్థ అనువాకము - హవిర్ గ్రహణ ప్రక్రియ', display_order: 4, is_published: 1, has_document: 1, document_id: 4, document_title: 'ఆదదే - హవిర్ గ్రహణ ప్రక్రియ', document_file_size: 121000, document_allow_download: 1 },
  { id: 5, chapter_id: 1, title: 'దేవాసురాః', description: 'పంచమ అనువాకము - దేవాసుర సంగ్రామ రహస్యము', display_order: 5, is_published: 1, has_document: 1, document_id: 5, document_title: 'దేవాసురాః - దేవాసుర సంగ్రామ అంతరార్థం', document_file_size: 178500, document_allow_download: 1 },
  { id: 6, chapter_id: 1, title: 'సన్త్వా సిఞ్చామి', description: 'షష్ఠ అనువాకము - అభిషేక జల సింజన విధి', display_order: 6, is_published: 1, has_document: 1, document_id: 6, document_title: 'సన్త్వా సిఞ్చామి - శాంతి మంత్రం', document_file_size: 142100, document_allow_download: 1 },
  { id: 7, chapter_id: 1, title: 'పాక యజ్ఞం', description: 'సప్తమ అనువాకము - గృహస్థ పాక యజ్ఞ నియమాలు', display_order: 7, is_published: 1, has_document: 1, document_id: 7, document_title: 'పాక యజ్ఞం - వైదిక గృహ్య సూత్రాలు', document_file_size: 195600, document_allow_download: 1 },
  { id: 8, chapter_id: 1, title: 'అనుమత్యై', description: 'అష్టమ అనువాకము - అనుమతీ దేవీ ప్రార్థన', display_order: 8, is_published: 1, has_document: 1, document_id: 8, document_title: 'అనుమత్యై - అనుమతి సూక్తమ్', document_file_size: 139000, document_allow_download: 1 },

  // Chapter 2: 2వ అష్టము (సంప్రదాయ)
  { id: 9, chapter_id: 2, title: 'అగ్నిమీళే పురోహితం', description: 'అగ్నిదేవ స్తుతి & యజ్ఞ పురోహితత్వం', display_order: 1, is_published: 1, has_document: 1, document_id: 9, document_title: 'అగ్నిమీళే - ఋగ్వేద ప్రారంభ సూక్తం', document_file_size: 148200, document_allow_download: 1 },
  { id: 10, chapter_id: 2, title: 'వాయవాయాహి దర్శత', description: 'వాయుదేవ ఆహ్వాన మంత్రములు', display_order: 2, is_published: 1, has_document: 1, document_id: 10, document_title: 'వాయు సూక్తం', document_file_size: 138000, document_allow_download: 1 },
  { id: 11, chapter_id: 2, title: 'ఇంద్రవాయూ ఇమే సుతాః', description: 'ఇంద్ర వాయు సమైక్య సమర్పణ', display_order: 3, is_published: 1, has_document: 1, document_id: 11, document_title: 'ఇంద్రవాయు సూక్తం', document_file_size: 141000, document_allow_download: 1 },
  { id: 12, chapter_id: 2, title: 'మిత్రం హువే పూతదక్షం', description: 'మిత్ర-వరుణ దేవతల దివ్య ప్రాశస్త్యం', display_order: 4, is_published: 1, has_document: 1, document_id: 12, document_title: 'మిత్రావరుణ సూక్తం', document_file_size: 152000, document_allow_download: 1 },
  { id: 13, chapter_id: 2, title: 'అశ్వినా యజ్వరీరిషో', description: 'అశ్వినీ దేవతల దివ్య భేషజ మహిమ', display_order: 5, is_published: 1, has_document: 1, document_id: 13, document_title: 'అశ్వినీ సూక్తం', document_file_size: 134000, document_allow_download: 1 },

  // Chapter 3: 3వ అష్టము (సంప్రదాయ)
  { id: 14, chapter_id: 3, title: 'ప్రాజాపత్యం', description: 'ప్రజాపతి సృష్టి సంకల్ప విశ్లేషణ', display_order: 1, is_published: 1, has_document: 1, document_id: 14, document_title: 'ప్రాజాపత్య సూక్తం', document_file_size: 146000, document_allow_download: 1 },
  { id: 15, chapter_id: 3, title: 'సౌమ్యం', description: 'చంద్ర తత్త్వ ఆరాధన విధానం', display_order: 2, is_published: 1, has_document: 1, document_id: 15, document_title: 'సౌమ్య సూక్తం', document_file_size: 139000, document_allow_download: 1 },
  { id: 16, chapter_id: 3, title: 'వైశ్వదేవం', description: 'విశ్వేదేవతల సర్వతోముఖ మంగళ హవిస్సు', display_order: 3, is_published: 1, has_document: 1, document_id: 16, document_title: 'వైశ్వదేవ సూక్తం', document_file_size: 155000, document_allow_download: 1 },
  { id: 17, chapter_id: 3, title: 'సారస్వతం', description: 'సరస్వతీ దేవి వాగ్వైభవం', display_order: 4, is_published: 1, has_document: 1, document_id: 17, document_title: 'సరస్వతీ సూక్తం', document_file_size: 162000, document_allow_download: 1 },

  // Chapter 4: 4వ అష్టము (సంప్రదాయ)
  { id: 18, chapter_id: 4, title: 'రాజసూయ విధి', description: 'సార్వభౌమ చక్రవర్తుల అభిషేక క్రమం', display_order: 1, is_published: 1, has_document: 1, document_id: 18, document_title: 'రాజసూయ విధి గ్రంథం', document_file_size: 170000, document_allow_download: 1 },
  { id: 19, chapter_id: 4, title: 'దిగ్విజయ ప్రార్థన', description: 'చతుర్దిశల దేవతల ఆశీర్వాద సూక్తం', display_order: 2, is_published: 1, has_document: 1, document_id: 19, document_title: 'దిగ్విజయ ప్రార్థన పత్రం', document_file_size: 140000, document_allow_download: 1 },
  { id: 20, chapter_id: 4, title: 'రత్ని హవిస్సులు', description: 'రాష్ట్ర పాలన & మంత్రుల కర్తవ్య విధి', display_order: 3, is_published: 1, has_document: 1, document_id: 20, document_title: 'రత్ని హవిస్సుల వివరణ', document_file_size: 148000, document_allow_download: 1 },
  { id: 21, chapter_id: 4, title: 'వార్త్రఘ్న శస్త్రం', description: 'రాష్ట్ర రక్షణ & శత్రు నిర్మూలన మంత్రం', display_order: 4, is_published: 1, has_document: 1, document_id: 21, document_title: 'వార్త్రఘ్న శస్త్రం', document_file_size: 152000, document_allow_download: 1 },

  // Chapter 5: 5వ అష్టము (సంప్రదాయ)
  { id: 22, chapter_id: 5, title: 'అగ్నిచయన క్రమము', description: 'గరుడ పక్ష్యాకార యజ్ఞవేదిక నిర్మాణం', display_order: 1, is_published: 1, has_document: 1, document_id: 22, document_title: 'అగ్నిచయన క్రమము', document_file_size: 185000, document_allow_download: 1 },
  { id: 23, chapter_id: 5, title: 'ఇష్టకా పూజనము', description: 'యజ్ఞ ఇటుకల మంత్ర పూతాభిమంత్రణ', display_order: 2, is_published: 1, has_document: 1, document_id: 23, document_title: 'ఇష్టకా పూజనము', document_file_size: 143000, document_allow_download: 1 },
  { id: 24, chapter_id: 5, title: 'శతరూద్రీయ విభాగం', description: 'మహా రుద్ర భగవానుని సహస్ర నామార్చన', display_order: 3, is_published: 1, has_document: 1, document_id: 24, document_title: 'శతరూద్రీయ విభాగం', document_file_size: 198000, document_allow_download: 1 },
  { id: 25, chapter_id: 5, title: 'వసోర్ధార మంత్రాలు', description: 'ఘృతధారల ద్వారా సమగ్ర విశ్వ కళ్యాణం', display_order: 4, is_published: 1, has_document: 1, document_id: 25, document_title: 'వసోర్ధార మంత్రాలు', document_file_size: 165000, document_allow_download: 1 },

  // Chapter 6: 6వ అష్టము (సంప్రదాయ)
  { id: 26, chapter_id: 6, title: 'అశ్వమేధ సంకల్పం', description: 'సమ్రాట్ అశ్వమేధ యాగ దివ్య ప్రారంభం', display_order: 1, is_published: 1, has_document: 1, document_id: 26, document_title: 'అశ్వమేధ సంకల్పం', document_file_size: 180000, document_allow_download: 1 },
  { id: 27, chapter_id: 6, title: 'బ్రహ్మోద్య చర్చ', description: 'విశ్వ రహస్యాలు & పరబ్రహ్మ తత్త్వ విచారణ', display_order: 2, is_published: 1, has_document: 1, document_id: 27, document_title: 'బ్రహ్మోద్య చర్చ', document_file_size: 162000, document_allow_download: 1 },
  { id: 28, chapter_id: 6, title: 'అవభృథ స్నాన విధి', description: 'యాగాంత పవిత్ర మంగళ స్నాన మహోత్సవం', display_order: 3, is_published: 1, has_document: 1, document_id: 28, document_title: 'అవభృథ స్నాన విధి', document_file_size: 154000, document_allow_download: 1 },

  // Chapter 7: 7వ అష్టము (సంప్రదాయ)
  { id: 29, chapter_id: 7, title: 'సౌత్రామణి యాగం', description: 'ఇంద్రియ పునరుజ్జీవన & బలోపేత విధి', display_order: 1, is_published: 1, has_document: 1, document_id: 29, document_title: 'సౌత్రామణి యాగ విధి', document_file_size: 168000, document_allow_download: 1 },
  { id: 30, chapter_id: 7, title: 'సురాపాన నివారణ', description: 'శుద్ధి క్రతువు & సత్వగుణ ప్రతిష్ఠాపన', display_order: 2, is_published: 1, has_document: 1, document_id: 30, document_title: 'శుద్ధి క్రతువు', document_file_size: 142000, document_allow_download: 1 },
  { id: 31, chapter_id: 7, title: 'సర్వతోముఖ ఆశీర్వాదం', description: 'సకల లోక శాంతి మహా మంత్రార్పణ', display_order: 3, is_published: 1, has_document: 1, document_id: 31, document_title: 'సర్వతోముఖ శాంతి మంత్రాలు', document_file_size: 159000, document_allow_download: 1 },

  // Chapter 8: 1వ ప్రపాఠకం (బ్రాహ్మణం)
  { id: 32, chapter_id: 8, title: 'సత్రయాగ విధానం', description: 'దీర్ఘ సత్రయాగముల కల్ప సూత్రాలు', display_order: 1, is_published: 1, has_document: 1, document_id: 32, document_title: 'సత్రయాగ విధి', document_file_size: 175000, document_allow_download: 1 },
  { id: 33, chapter_id: 8, title: 'సోమయాగ క్రమం', description: 'సోమలత గ్రహణ & రస సంగ్రహణ ప్రక్రియ', display_order: 2, is_published: 1, has_document: 1, document_id: 33, document_title: 'సోమయాగ ప్రక్రియ', document_file_size: 164000, document_allow_download: 1 },
  { id: 34, chapter_id: 8, title: 'హవిర్యజ్ఞ ప్రక్రియ', description: 'అష్టాదశ హవిస్సుల శాస్త్రీయ విశేషాలు', display_order: 3, is_published: 1, has_document: 1, document_id: 34, document_title: 'హవిర్యజ్ఞ శాస్త్రం', document_file_size: 172000, document_allow_download: 1 },

  // Chapter 9: 2వ ప్రపాఠకం (బ్రాహ్మణం)
  { id: 35, chapter_id: 9, title: 'అగ్నిష్టోమ సమాప్తి', description: 'ప్రథమ సోమసంస్థా పూర్ణాహుతి విశేషాలు', display_order: 1, is_published: 1, has_document: 1, document_id: 35, document_title: 'అగ్నిష్టోమ పూర్ణాహుతి', document_file_size: 158000, document_allow_download: 1 },
  { id: 36, chapter_id: 9, title: 'ఉక్థ్య క్రతు విధి', description: 'స్తోత్ర శస్త్రముల గాన విశేషాలు', display_order: 2, is_published: 1, has_document: 1, document_id: 36, document_title: 'ఉక్థ్య క్రతు గానం', document_file_size: 149000, document_allow_download: 1 },
  { id: 37, chapter_id: 9, title: 'షోడశి ప్రకరణం', description: 'షోడశ కళా సంపూర్ణ యాగ మంత్రాలు', display_order: 3, is_published: 1, has_document: 1, document_id: 37, document_title: 'షోడశి ప్రకరణం', document_file_size: 160000, document_allow_download: 1 },

  // Chapter 10: 3వ ప్రపాఠకం (బ్రాహ్మణం)
  { id: 38, chapter_id: 10, title: 'వాజపేయ రథారోహణం', description: 'విజయ రథారోహణ మంత్రోచ్ఛారణ', display_order: 1, is_published: 1, has_document: 1, document_id: 38, document_title: 'వాజపేయ రథారోహణ మంత్రం', document_file_size: 155000, document_allow_download: 1 },
  { id: 39, chapter_id: 10, title: 'సురా గ్రహ విధి', description: 'వైదిక ఔషధ రస సేవన నియమాలు', display_order: 2, is_published: 1, has_document: 1, document_id: 39, document_title: 'సురా గ్రహ నియమాలు', document_file_size: 147000, document_allow_download: 1 },
  { id: 40, chapter_id: 10, title: 'ఛత్ర ధారణ క్రమం', description: 'సామ్రాజ్య శ్వేతచ్ఛత్ర పవిత్ర స్థాపన', display_order: 3, is_published: 1, has_document: 1, document_id: 40, document_title: 'ఛత్ర ధారణ క్రమం', document_file_size: 151000, document_allow_download: 1 },

  // Chapter 11: 4వ ప్రపాఠకం (బ్రాహ్మణం)
  { id: 41, chapter_id: 11, title: 'దర్భాభిషేకము', description: 'పవిత్ర దర్భల ప్రాశస్త్యం & అధివాసన', display_order: 1, is_published: 1, has_document: 1, document_id: 41, document_title: 'దర్భాభిషేక మహా ప్రాశస్త్యం', document_file_size: 144000, document_allow_download: 1 },
  { id: 42, chapter_id: 11, title: 'బ్రహ్మయజ్ఞ కల్పం', description: 'నిత్య వేదాధ్యయన & ఋషి తర్పణ విధి', display_order: 2, is_published: 1, has_document: 1, document_id: 42, document_title: 'బ్రహ్మయజ్ఞ కల్పం', document_file_size: 167000, document_allow_download: 1 },
  { id: 43, chapter_id: 11, title: 'పితృమేధ సూక్తం', description: 'పితృదేవతల తరణ & పుణ్యలోక ప్రాప్తి', display_order: 3, is_published: 1, has_document: 1, document_id: 43, document_title: 'పితృమేధ సూక్తం', document_file_size: 158000, document_allow_download: 1 },

  // Chapter 12: 1వ విభాగం - దినచర్య (ఆరోగ్యం)
  { id: 44, chapter_id: 12, title: 'బ్రాహ్మీ ముహూర్త జాగరణ', description: 'సూర్యోదయానికి ముందటి అమృత ఘడియల ఆరోగ్య రహస్యం', display_order: 1, is_published: 1, has_document: 1, document_id: 44, document_title: 'బ్రాహ్మీ ముహూర్తం - ఆయుర్వేద జీవనశైలి మార్గదర్శిని', document_file_size: 165400, document_allow_download: 1 },
  { id: 45, chapter_id: 12, title: 'దంతధావన పద్ధతులు', description: 'వేప, కానుగ తదితర ప్రకృతి సిద్ధ కాష్ఠ దంతధావనం', display_order: 2, is_published: 1, has_document: 1, document_id: 45, document_title: 'దంతధావన విధి', document_file_size: 138000, document_allow_download: 1 },
  { id: 46, chapter_id: 12, title: 'అభ్యంగన స్నాన ఫలాలు', description: 'నువ్వుల నూనెతో తైలమర్దన ఆయుర్వేద ఫలితాలు', display_order: 3, is_published: 1, has_document: 1, document_id: 46, document_title: 'అభ్యంగన స్నాన విధానం', document_file_size: 152000, document_allow_download: 1 },
  { id: 47, chapter_id: 12, title: 'సాత్వికాహార నియమాలు', description: 'శరీర ప్రకృతికి తగిన మిత, హిత, ఋత ఆహార విధి', display_order: 4, is_published: 1, has_document: 1, document_id: 47, document_title: 'సాత్వికాహార సూత్రాలు', document_file_size: 160000, document_allow_download: 1 },

  // Chapter 13: 2వ విభాగం - ఋతుచర్య (ఆరోగ్యం)
  { id: 48, chapter_id: 13, title: 'వసంత ఋతు విధానం', description: 'కఫ శమనము & వేప పూత ఆహార నియమం', display_order: 1, is_published: 1, has_document: 1, document_id: 48, document_title: 'వసంత ఋతు జీవన విధానం', document_file_size: 145000, document_allow_download: 1 },
  { id: 49, chapter_id: 13, title: 'గ్రీష్మ ఋతు రక్షణ', description: 'వాత పిత్త సమతుల్యత & శీతల పానీయాలు', display_order: 2, is_published: 1, has_document: 1, document_id: 49, document_title: 'గ్రీష్మ ఋతు సంరక్షణ మార్గదర్శిని', document_file_size: 149000, document_allow_download: 1 },
  { id: 50, chapter_id: 13, title: 'వర్ష ఋతు జాగ్రత్తలు', description: 'అగ్నిమాంద్య నివారణ & శొంఠి కషాయ విధి', display_order: 3, is_published: 1, has_document: 1, document_id: 50, document_title: 'వర్ష ఋతు ఆరోగ్య జాగ్రత్తలు', document_file_size: 153000, document_allow_download: 1 },
  { id: 51, chapter_id: 13, title: 'హేమంత ఋతు బలం', description: 'ధాతు పుష్టి & పోషకాహార సేకరణ', display_order: 4, is_published: 1, has_document: 1, document_id: 51, document_title: 'హేమంత ఋతు బలోపేతం', document_file_size: 147000, document_allow_download: 1 },

  // Chapter 14: 3వ విభాగం - దివ్య ఔషధ గుణాలు (ఆరోగ్యం)
  { id: 52, chapter_id: 14, title: 'తులసీ మహిమ', description: 'సర్వ రోగ నివారిణి & ప్రాణవాయు శుద్ధి', display_order: 1, is_published: 1, has_document: 1, document_id: 52, document_title: 'తులసీ దివ్య ఔషధ గుణాలు', document_file_size: 168000, document_allow_download: 1 },
  { id: 53, chapter_id: 14, title: 'అశ్వగంధ ప్రాశస్త్యం', description: 'శారీరక ధారుఢ్యం, మనశ్శాంతి & నిద్రా ప్రదాత', display_order: 2, is_published: 1, has_document: 1, document_id: 53, document_title: 'అశ్వగంధ ప్రాశస్త్యం & ప్రయోజనాలు', document_file_size: 174000, document_allow_download: 1 },
  { id: 54, chapter_id: 14, title: 'త్రిఫల చూర్ణ విధి', description: 'శరీర శోధన, నేత్ర రక్షణ & దీర్ఘాయువు', display_order: 3, is_published: 1, has_document: 1, document_id: 54, document_title: 'త్రిఫల చూర్ణ విధి & ఉపయోగాలు', document_file_size: 162000, document_allow_download: 1 },
  { id: 55, chapter_id: 14, title: 'గుడూచీ (తిప్పతీగ)', description: 'రోగనిరోధక శక్తి & జ్వరహర దివ్య మూలిక', display_order: 4, is_published: 1, has_document: 1, document_id: 55, document_title: 'గుడూచీ (తిప్పతీగ) సంజీవని', document_file_size: 159000, document_allow_download: 1 },

  // Chapter 15: 4వ విభాగం - ప్రాణాయామం & యోగ చికిత్స (ఆరోగ్యం)
  { id: 56, chapter_id: 15, title: 'నాడీశోధన ప్రాణాయామం', description: '72,000 నాడుల సమగ్ర శుద్ధి & మానసిక స్థైర్యం', display_order: 1, is_published: 1, has_document: 1, document_id: 56, document_title: 'నాడీశోధన ప్రాణాయామ సాధన', document_file_size: 182000, document_allow_download: 1 },
  { id: 57, chapter_id: 15, title: 'భ్రామరీ ప్రాణాయామం', description: 'తీవ్ర మానసిక ఒత్తిడి & నిద్రలేమి నివారణ', display_order: 2, is_published: 1, has_document: 1, document_id: 57, document_title: 'భ్రామరీ ప్రాణాయామ విధానం', document_file_size: 166000, document_allow_download: 1 },
  { id: 58, chapter_id: 15, title: 'సూర్యనమస్కార క్రమం', description: '12 దివ్య సూర్య మంత్రాలతో శారీరక యోగ సాధన', display_order: 3, is_published: 1, has_document: 1, document_id: 58, document_title: 'సూర్యనమస్కార సమగ్ర పద్ధతి', document_file_size: 195000, document_allow_download: 1 },
  { id: 59, chapter_id: 15, title: 'శవాసన ధ్యాన సమాధి', description: 'పూర్ణ విశ్రాంతి & ఆత్మ చైతన్య అనుసంధానం', display_order: 4, is_published: 1, has_document: 1, document_id: 59, document_title: 'శవాసన ధ్యాన రహస్యం', document_file_size: 156000, document_allow_download: 1 },
];

// RICH AUTHENTIC TELUGU SCRIPTURE CONTENT FOR PDF READER
export interface SubtopicDetailContent {
  sectionTag: string;
  mantraText: string;
  tatparyam: string;
  application: string;
}

export const SUBTOPIC_SCRIPTURE_MAP: Record<string, SubtopicDetailContent> = {
  'ఇషే త్వా': {
    sectionTag: 'కృష్ణ యజుర్వేద తైత్తిరీయ సంహిత • ప్రథమ కాండము',
    mantraText:
      'ఓం ఇషే త్వోర్జే త్వా వాయవః స్థోపాయవః స్థా దేవో వః సవితా ప్రార్పయతు శ్రేష్ఠతమాయ కర్మణే ఆప్యాయధ్వమఘ్న్యా ఇంద్రాయ భాగం ప్రజావతీరనమీవా అయక్ష్మా మా వ స్తేన ఈశత మాఘశగ్ంసో ధ్రువా అస్మిన్ గోపతౌ స్యాత బహ్వీర్యజమానస్య పశూన్ పాహి ॥',
    tatparyam:
      'హే పవిత్ర పలాశ శాఖా! పరమేశ్వరుని సృష్టి యజ్ఞంలో మాకు అన్నము (ఇష్), ప్రాణశక్తి (ఊర్జ్), మరియు ఆధ్యాత్మిక వర్చస్సును ప్రసాదించుము. సవితృ భగవానుడు మనలను శ్రేష్ఠతమమైన సత్కర్మల వైపు నడిపించుగాక. సకల లోకాలకు పౌష్టికత మరియు శాంతి చేకూరును.',
    application:
      'దర్శపూర్ణమాస తదితర వైదిక యాగ క్రమములలో ఈ అనువాకమును నిష్టతో పఠించి, సర్వ ప్రాణుల క్షేమార్థం సంకల్పం చేయబడుతుంది.',
  },
  'ఆప ఉన్దన్తు': {
    sectionTag: 'కృష్ణ యజుర్వేద తైత్తిరీయ సంహిత • పవిత్ర జల సూక్తం',
    mantraText:
      'ఓం ఆప ఉన్దన్తు జీవసే దీర్ఘాయుత్వాయ వర్చసే । ఓష్ఠే శిరస్తే మా హిగ్ంసీత్ శివే మే స్థం దేవం సవితారమాప్యాయతామింద్రస్య భాగః స్వాహా ॥',
    tatparyam:
      'ఓ దివ్య పవిత్ర జల దేవతలారా! జీవకోటికి దీర్ఘాయుష్షు, ఓజస్సు, శారీరక తేజస్సు మరియు అంతశ్శుద్ధి కోసం మమ్ములను అనుగ్రహించండి. ఈ అమృత సమాన జలములు శివస్వరూపమై సర్వ దుష్ట శక్తులను నివారించుగాక.',
    application:
      'యజ్ఞారంభంలో యజమాన సంస్కారము మరియు ప్రోక్షణ జలాల అభిమంత్రణ కొరకు ఈ పవిత్ర మంత్రం ఉచ్ఛరింపబడును.',
  },
  'దేవస్య త్వా': {
    sectionTag: 'కృష్ణ యజుర్వేద తైత్తిరీయ సంహిత • హవిర్నిర్వాప ప్రకరణం',
    mantraText:
      'ఓం దేవస్య త్వా సవితుః ప్రసవేఽశ్వినోర్బాహుభ్యాం పూష్ణో హస్తాభ్యాం ప్రతిగృష్ణామ్యగ్నయే త్వా జుష్టం నిర్వపామి ॥',
    tatparyam:
      'సవితృ భగవానుని ప్రేరణతో, అశ్వినీ దేవతల దివ్య భుజ బలంతో, పూషన్ దేవుని హస్తాల సహకారంతో ఈ దివ్య హవిస్సును స్వీకరించి అగ్నిదేవునికి సమర్పిస్తున్నాను.',
    application:
      'హవిస్సుల సంగ్రహణ మరియు హోమగుండంలో సమర్పణ సమయంలో ప్రధానంగా పఠించే మహామంత్రం.',
  },
  'ఆదదే': {
    sectionTag: 'కృష్ణ యజుర్వేద తైత్తిరీయ సంహిత • హవిర్ గ్రహణ ప్రక్రియ',
    mantraText:
      'ఓం ఆదదే భద్రం వర్చః సహస్రవల్శో విరోహతు । యజ్ఞస్య రూపమమృతం ప్రతిష్ఠితం బ్రహ్మణా తేన తే సహ ॥',
    tatparyam:
      'యజ్ఞ పాత్రలలో పవిత్ర హవిస్సును స్వీకరించుట ద్వారా వేలాది శాఖలుగా ధర్మము వర్ధిల్లుగాక. ఈ అమృతమయ యజ్ఞ ఫలితం సకల లోకాలకు శాంతిని ప్రసాదించును.',
    application:
      'యజ్ఞ పాత్రల సంస్కార విధి మరియు ఆజ్యాజ్య సంచయన క్రమం.',
  },
  'దేవాసురాః': {
    sectionTag: 'కృష్ణ యజుర్వేద తైత్తిరీయ సంహిత • దేవాసుర రహస్యం',
    mantraText:
      'ఓం దేవాసురాః సంయత్తా ఆసన్ తే దేవా విజయమకామయంత । స ఏతం యజ్ఞమపశ్యన్ తమాహరన్ తేన వై తేఽసురాన్ ప్రాణుదంత ॥',
    tatparyam:
      'సృష్టి ప్రారంభంలో దేవతలు మరియు అసురుల మధ్య సంఘర్షణ జరిగినప్పుడు దేవతలు సత్య ధర్మాధారిత యజ్ఞం ద్వారా అసుర ప్రవృత్తులను జయించి విశ్వంలో ధర్మ ప్రతిష్ఠాపన గావించారు.',
    application:
      'అధర్మ నివారణ మరియు అంతఃశత్రు నిర్మూలన సాధనకు ఈ మంత్రోపాసన దివ్య మార్గం.',
  },
  'అగ్నిమీళే పురోహితం': {
    sectionTag: 'ఋగ్వేద సంహిత • ప్రథమ మండలం • ప్రథమ సూక్తం',
    mantraText:
      'ఓం అగ్నిమీళే పురోహితం యజ్ఞస్య దేవమృత్విజమ్ । హోతారం రత్నధాతమమ్ ॥',
    tatparyam:
      'యజ్ఞ పురోహితుడు, దివ్య ప్రకాశమయుడు, ఋత్విక్కు, హోత, మరియు సమస్త రత్నములను శ్రేష్ఠ ఆధ్యాత్మిక సంపదలను ప్రసాదించే అగ్నిదేవుని నేను భక్తితో స్తుతిస్తున్నాను.',
    application:
      'సమస్త వేదాధ్యయనానికి మరియు హోమ క్రతువులకు మంగళకర ప్రారంభ సూక్తం.',
  },
  'రాజసూయ విధి': {
    sectionTag: 'కృష్ణ యజుర్వేద సంహిత • రాజసూయ ప్రకరణం',
    mantraText:
      'ఓం ఆవిర్భూతో రాష్ట్రాణాంపతిః సార్వభౌమో జయతు ధర్మనిష్ఠః । అపాం నపాతే నమస్తే అస్తు ॥',
    tatparyam:
      'సమ్రాట్ తన ప్రజల సంక్షేమం, ధర్మరక్షణ, మరియు గో-బ్రాహ్మణ ప్రతిష్ఠ కోసం రాజసూయ మహా యాగం నిర్వహించి లోకపాలక దీక్షను పూనును.',
    application:
      'రాష్ట్ర పాలకులు ధర్మ నిష్ఠతో ప్రజా రక్షణ బాధ్యతను స్వీకరించే వేదిక.',
  },
  'బ్రాహ్మీ ముహూర్త జాగరణ': {
    sectionTag: 'చరక సంహిత & అష్టాంగ హృదయమ్ • దినచర్య అధ్యాయము',
    mantraText:
      '॥ శ్రీ ధన్వంతరయే నమః ॥\nబ్రాహ్మే ముహూర్తే చోత్తిష్ఠేత్ స్వస్థో రక్షార్థమాయుషః । శరీరచింతాం నిర్వర్త్య కృతశౌచవిధిస్తతః ॥',
    tatparyam:
      'ఆరోగ్యవంతమైన ఆయుష్షును కోరుకునే ప్రతి మానవుడు సూర్యోదయానికి ముందటి బ్రాహ్మీ ముహూర్తంలో మేల్కొనవలెను. ఆ సమయంలో వాతావరణం అత్యంత పరిశుద్ధంగా ఉండి ప్రాణవాయువు సమృద్ధిగా లభించి బుద్ధిని, ఓజస్సును ఇనుమడింపజేస్తుంది.',
    application:
      'నిత్య ఆయుర్వేద జీవన విధానం మరియు మానసిక ఏకాగ్రతకు మూలస్థంభం.',
  },
  'దంతధావన పద్ధతులు': {
    sectionTag: 'సుశ్రుత సంహిత • చికిత్సా స్థానము',
    mantraText:
      '॥ శ్రీ ధన్వంతరయే నమః ॥\nకషాయ కటు తిక్తకం నింబ ఖదిర కారణ్జకమ్ । దంతకాష్ఠం ప్రయోజయేత్ ముఖదుర్గంధనాశనమ్ ॥',
    tatparyam:
      'వేప, కానుగ, చండ్ర తదితర కషాయ, కటు, తిక్త రసాలు కలిగిన సహజ కాష్ఠాలతో దంతధావనం చేయడం వల్ల ముఖ దుర్గంధం, దంత రోగాలు నశించి రుచి ఉత్పన్నమవుతుంది.',
    application:
      'ప్రాచీన ప్రకృతి సిద్ధ దంత రక్షణ పద్ధతి.',
  },
  'అభ్యంగన స్నాన ఫలాలు': {
    sectionTag: 'అష్టాంగ హృదయమ్ • సూత్రస్థానము',
    mantraText:
      '॥ శ్రీ ధన్వంతరయే నమః ॥\nఅభ్యంగమాచరేన్నిత్యం స జరాశ్రమవాతహా । దృష్టిప్రసాదపుష్ట్యాయుః సుస్వప్నత్వక్సుదార్ఢ్యకృత్ ॥',
    tatparyam:
      'ప్రతిరోజూ నువ్వుల నూనెతో తైలమర్దన (అభ్యంగనం) చేయడం వల్ల వృద్ధాప్యం, అలసట మరియు వాత దోషాలు తొలగిపోతాయి. కంటిచూపు మెరుగవుతుంది, శరీరానికి పుష్టి, దీర్ఘాయువు మరియు గాఢ నిద్ర లభిస్తాయి.',
    application:
      'శరీర దృఢత్వానికి మరియు నాడీ మండల సంరక్షణకు ఆయుర్వేద విధి.',
  },
  'సాత్వికాహార నియమాలు': {
    sectionTag: 'భగవద్గీత & ఆయుర్వేద ఆహార విధి',
    mantraText:
      'ఆయుః సత్త్వ బలారోగ్య సుఖ ప్రీతి వివర్ధనాః । రస్యాః స్నిగ్ధాః స్థిరా హృద్యా ఆహారాః సాత్త్విక ప్రియాః ॥',
    tatparyam:
      'ఆయుష్షు, సత్వగుణము, బలము, ఆరోగ్యము, సుఖము మరియు ప్రీతిని పెంపొందించే రసయుక్తమైన, స్నిగ్ధమైన, పోషక విలువలు గల ఆహారము సాత్విక జీవులకు ప్రీతికరమైనది.',
    application:
      'దేహారోగ్యము మరియు చిత్తశుద్ధికి అనువైన భోజన నియమావళి.',
  },
  'తులసీ మహిమ': {
    sectionTag: 'ఆయుర్వేద మూలికా శాస్త్రం & ద్రవ్యగుణ విజ్ఞానం',
    mantraText:
      'తులసీ గామృతసంభూతా రోగఘ్నీ పాపనాశినీ । కాసశ్వాసజ్వరహరా ప్రాణవాయువివర్ధినీ ॥',
    tatparyam:
      'తులసి అమృత సమానమైన దివ్య ఔషధం. కాస, శ్వాస, జ్వరాది సమస్త రుగ్మతలను హరించి శరీర రోగనిరోధక శక్తిని పెంచి ప్రాణవాయువును శుద్ధి చేస్తుంది.',
    application:
      'గృహస్థుల నిత్య తులసీ సేవనము మరియు ఆయుర్వేద కషాయ ప్రయోగం.',
  },
  'నాడీశోధన ప్రాణాయామం': {
    sectionTag: 'హఠయోగ ప్రదీపిక & పతంజలి యోగ సూత్రాలు',
    mantraText:
      'మలాకులాసు నాడీషు మారుతో నైవ గచ్ఛతి । ప్రాణాయామేన శుద్ధాసు నాడులలో సుఖం ప్రవహతి ॥',
    tatparyam:
      'శరీరంలోని 72,000 నాడులలోని మాలిన్యాలను నాడీశోధన (అనులోమ విలోమ) ప్రాణాయామం ద్వారా నిర్మూలించి ప్రాణశక్తిని సమతుల్యంగా ప్రవహింపజేయవచ్చును.',
    application:
      'మానసిక ఒత్తిడి నివారణ, శ్వాసకోశ బలోపేతం మరియు ధ్యాన సాధనకు తొలి మెట్టు.',
  },
};

export const getSubtopicScriptureContent = (subtopicTitle: string, defaultDesc?: string): SubtopicDetailContent => {
  if (SUBTOPIC_SCRIPTURE_MAP[subtopicTitle]) {
    return SUBTOPIC_SCRIPTURE_MAP[subtopicTitle];
  }

  // Authentic dynamic fallback for other traditional topics
  return {
    sectionTag: 'సాంప్రదాయిక వైదిక విజ్ఞాన గ్రంథం',
    mantraText: `॥ శ్రీ గురుభ్యో నమః హరిః ఓమ్ ॥\nఓం భద్రం కర్ణేభిః శృణుయామ దేవా భద్రం పశ్యేమాక్షభిర్యజత్రాః । స్థిరైరంగైస్తుష్టువాగ్ం సస్తనూభిః వ్యశేమ దేవహితం యదాయుః ॥\n\n[ ${subtopicTitle} - పవిత్ర మంత్రార్పణ ]`,
    tatparyam: `${subtopicTitle}: ${defaultDesc || 'సనాతన ధర్మ వేద విజ్ఞాన విశేషాలు మరియు ఆధ్యాత్మిక అంతరార్థ ప్రవచనం.'} దీని ద్వారా మానవ జీవితంలో శాంతి, సత్యము, మరియు ధార్మిక నిష్ఠ పెంపొందుతాయి.`,
    application: 'నిత్య పారాయణము, స్వాధ్యాయము, మరియు సాంప్రదాయిక పూజాది క్రతువులలో శ్రద్ధతో పఠించదగినది.',
  };
};

class MobileApi {
  private categoriesCache: Category[] = DEMO_CATEGORIES;
  private chaptersCache: Record<number, Chapter[]> = {};
  private subtopicsCache: Record<number, Subtopic[]> = {};
  private settingsCache: AppSettings = {
    app_title: 'సాంప్రదాయిక జ్ఞాన తరంగిణి',
    app_subtitle: 'వేద సంప్రదాయ & ఆయుర్వేద విజ్ఞాన గ్రంథాలు',
    footer_credit: 'V B S Sarma Kompella',
  };

  getCachedCategories(): Category[] {
    return this.categoriesCache;
  }

  getCachedChapters(categoryId: number): Chapter[] {
    if (this.chaptersCache[categoryId] && this.chaptersCache[categoryId].length > 0) {
      return this.chaptersCache[categoryId];
    }
    const filtered = DEMO_CHAPTERS.filter(c => c.category_id === categoryId);
    return filtered.length > 0 ? filtered : [
      { id: categoryId * 10 + 1, category_id: categoryId, title: '1 వ అధ్యాయం', description: 'ప్రథమ విభాగం', chapter_number: 1, display_order: 1, is_published: 1 }
    ];
  }

  getCachedSubtopics(chapterId: number): Subtopic[] {
    if (this.subtopicsCache[chapterId] && this.subtopicsCache[chapterId].length > 0) {
      return this.subtopicsCache[chapterId];
    }
    const filtered = DEMO_SUBTOPICS.filter(s => s.chapter_id === chapterId);
    return filtered.length > 0 ? filtered : [
      { id: chapterId * 100 + 1, chapter_id: chapterId, title: 'ప్రథమ అంశం', description: 'విషయ వివరణ', display_order: 1, is_published: 1, has_document: 1, document_id: 1, document_title: 'వేద జ్ఞాన పత్రం' }
    ];
  }

  async getCategories(): Promise<Category[]> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/categories?_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(id);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        this.categoriesCache = json.data;
        return json.data;
      }
    } catch (e) {
      // Fast fallback to memory cache
    }
    return this.categoriesCache;
  }

  async getChapters(categoryId: number): Promise<Chapter[]> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/chapters?category_id=${categoryId}&_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(id);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        this.chaptersCache[categoryId] = json.data;
        return json.data;
      }
    } catch (e) {
      // Fast fallback to memory cache
    }
    return this.getCachedChapters(categoryId);
  }

  async getSubtopics(chapterId: number): Promise<Subtopic[]> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/subtopics?chapter_id=${chapterId}&_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(id);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        this.subtopicsCache[chapterId] = json.data;
        return json.data;
      }
    } catch (e) {
      // Fast fallback to memory cache
    }
    return this.getCachedSubtopics(chapterId);
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/settings?_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(id);
      const json = await res.json();
      if (json.success && json.data) {
        this.settingsCache = json.data;
        return json.data;
      }
    } catch (e) {
      // ignore
    }
    return this.settingsCache;
  }

  getDocumentStreamUrl(id: number): string {
    return `${API_BASE}/documents/${id}/stream?_t=${Date.now()}`;
  }

  getDocumentViewUrl(id: number): string {
    return `${API_BASE}/documents/${id}/view`;
  }
}

export const mobileApi = new MobileApi();
