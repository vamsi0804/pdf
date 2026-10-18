# హోస్టింగర్ (Hostinger) డిప్లాయ్‌మెంట్ మార్గదర్శిని
## 2 డొమైన్‌లు (Develop & Prod) + 2 డేటాబేస్‌లు (No Node.js)

ఈ ప్రాజెక్ట్ **Hostinger Shared Hosting** లో **Node.js లేకుండా** 2 వేర్వేరు డొమైన్‌లు (స్టేజింగ్ & ప్రొడక్షన్) మరియు 2 వేర్వేరు డేటాబేస్‌లతో నడవడానికి సిద్ధం చేయబడింది.

---

## 1. సిస్టమ్ నిర్మాణం (2 డొమైన్లు & 2 డేటాబేస్ విధానం)

| విభాగం | Develop / Staging | Production (Live) |
|---|---|---|
| **డొమైన్** | `dev.yourdomain.com` (లేదా సబ్‌డొమైన్) | `yourdomain.com` (ప్రధాన డొమైన్) |
| **గిట్ బ్రాంచ్** | `develop` | `prod` |
| **డేటాబేస్** | `u123456789_dev_db` | `u123456789_prod_db` |
| **హోస్టింగర్ పాత్** | `public_html/dev` (లేదా సబ్‌డొమైన్ ఫోల్డర్) | `public_html` |
| **అడ్మిన్ డాష్‌బోర్డ్** | `https://dev.yourdomain.com/admin/` | `https://yourdomain.com/admin/` |

---

## 2. హోస్టింగర్‌లో ఏ ఫైల్స్ డిప్లాయ్ అవుతాయి? (Which files are deployed?)

హోస్టింగర్ అనేది వెబ్ సర్వర్ (Apache + PHP). అందువల్ల హోస్టింగర్ రన్ చేయడానికి క్రింది ఫైల్స్ మాత్రమే అవసరం:

### ✅ హోస్టింగర్‌లో రన్ అయ్యే ప్రధాన ఫైల్స్:
1. **`index.php` & `.htaccess`** (ప్రాజెక్ట్ రూట్ లోనివి): అన్ని రిక్వెస్ట్‌లను బ్యాకెండ్‌కు సురక్షితంగా మళ్ళిస్తాయి.
2. **`backend/` ఫోల్డర్**:
   - `config/config.php`: డేటాబేస్ కనెక్షన్ వివరాలు (డొమైన్ ఆధారంగా ఆటో-స్విచ్ అవుతుంది).
   - `src/`: PHP API కంట్రోలర్లు & మోడల్స్ (వర్గం, అధ్యాయం, సబ్‌టాపిక్, అడ్మిన్ లాగిన్).
   - `public/admin/`: **ఇప్పటికే సిద్ధం చేయబడిన రియాక్ట్ అడ్మిన్ ప్యానెల్** (HTML, CSS, JS - నోడ్ అవసరం లేదు).
   - `public/js/`: ఆఫ్‌లైన్ `pdf.min.js` & `pdf.worker.min.js`.
   - `public/viewer.php`: పి.డి.ఎఫ్ వీక్షించే స్వతంత్ర పేజీ.
   - `storage/pdfs/`: అన్ని 59 వేద పి.డి.ఎఫ్ పత్రాలు.
   - `storage/uploads/`: భగవంతుని దివ్య నేపథ్య చిత్రాలు.

### ❌ హోస్టింగర్‌కు సంబంధం లేనివి (ఇవి సర్వర్‌లో రన్ కావు):
- `mobile/`: ఇది మొబైల్ ఫోన్ (Android/iOS) కొరకు React Native యాప్. దీనిని మీ కంప్యూటర్‌లో APK లేదా EAS Build ద్వారా బిల్డ్ చేసి ఫోన్‌లలో వాడతారు. హోస్టింగర్ కేవలం బ్యాకెండ్ API మరియు వెబ్ అడ్మిన్‌ను మాత్రమే నడుపుతుంది.
- `node_modules/`: హోస్టింగర్‌లో నోడ్ ప్రాసెస్‌లు ఏవీ నడవవు కాబట్టి సర్వర్‌లో Node.js లేదా node_modules అవసరం లేదు.

---

## 3. హోస్టింగర్‌లో 2 డేటాబేస్‌ల సృష్టి (MySQL)

హోస్టింగర్ hPanel లో 2 డేటాబేస్‌లను సృష్టించండి:
1. **Develop Database**: ఉదా: `u123456789_dev_db`
2. **Production Database**: ఉదా: `u123456789_prod_db`

### రెండింటినీ ఒక్క క్లిక్‌తో ఇన్‌స్టాల్ చేయడం:
మేము రూపొందించిన [`backend/database/single_database_install.sql`](file:///d:/Clickzen/PDF%20Application/backend/database/single_database_install.sql) ఫైల్ ద్వారా 6 టేబుళ్లు, 3 విభాగాలు, 15 అధ్యాయాలు, 59 అనువాకాలు మరియు డిఫాల్ట్ అడ్మిన్ ఒక్కసారే ఇన్‌స్టాల్ అవుతాయి:
1. phpMyAdmin లోకి వెళ్లి `u123456789_dev_db` ను ఎంచుకోండి -> **Import** -> `single_database_install.sql` ను అప్‌లోడ్ చేసి **Go** క్లిక్ చేయండి.
2. మరలా phpMyAdmin లో `u123456789_prod_db` ను ఎంచుకోండి -> **Import** -> అదే `single_database_install.sql` ను అప్‌లోడ్ చేసి **Go** క్లిక్ చేయండి.

> **డిఫాల్ట్ అడ్మిన్ లాగిన్:** `admin@vedicknowledge.org` / `admin123`

---

## 4. స్మార్ట్ `config.php` - డొమైన్ బట్టి డేటాబేస్ ఆటో-సెలెక్ట్

[`backend/config/config.php`](file:///d:/Clickzen/PDF%20Application/backend/config/config.php) లో మేము స్మార్ట్ డిటెక్షన్ రాశాము. డొమైన్ పేరులో `dev.` ఉంటే ఆటోమేటిక్‌గా `dev_db` కి కనెక్ట్ అవుతుంది, లేకుంటే `prod_db` కి కనెక్ట్ అవుతుంది!

హోస్టింగర్‌లో మీ డేటాబేస్ యూజర్‌నేమ్, పాస్‌వర్డ్‌లను `backend/config/config.php` లో ఒకసారి ఎంటర్ చేయండి:

```php
// 1. DEVELOP DATABASE
$devEnvironment = [
    'db' => [
        'driver'   => 'mysql',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'u123456789_dev_db',
        'username' => 'u123456789_dev_user',
        'password' => 'మీ_DEV_డేటాబేస్_పాస్‌వర్డ్',
    ],
    'app' => [
        'url' => 'https://dev.yourdomain.com',
    ]
];

// 2. PRODUCTION DATABASE
$prodEnvironment = [
    'db' => [
        'driver'   => 'mysql',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'u123456789_prod_db',
        'username' => 'u123456789_prod_user',
        'password' => 'మీ_PROD_డేటాబేస్_పాస్‌వర్డ్',
    ],
    'app' => [
        'url' => 'https://yourdomain.com',
    ]
];
```

---

## 5. హోస్టింగర్ గిట్ కనెక్షన్ (Git Deployment)

1. **Develop సైట్ కొరకు:**
   - hPanel లో `dev.yourdomain.com` సైట్ మేనేజ్‌మెంట్‌లోకి వెళ్లండి.
   - **Advanced** -> **Git** క్లిక్ చేయండి.
   - **Repository**: `https://github.com/vamsi0804/pdf.git`
   - **Branch**: `develop`
   - **Create** క్లిక్ చేయండి.
   - వెబ్‌హుక్ URL ను కాపీ చేసి GitHub Settings -> Webhooks లో వేయండి.

2. **Production సైట్ కొరకు:**
   - hPanel లో `yourdomain.com` ప్రధాన సైట్‌లోకి వెళ్లండి.
   - **Advanced** -> **Git** క్లిక్ చేయండి.
   - **Repository**: `https://github.com/vamsi0804/pdf.git`
   - **Branch**: `prod`
   - **Create** క్లిక్ చేయండి.
   - వెబ్‌హుక్ URL ను కాపీ చేసి GitHub Settings -> Webhooks లో వేయండి.

---

## 6. కమాండ్ ప్రాంప్ట్ ద్వారా Develop నుండి Prod కు పుష్ చేయడం (Push from Develop to Prod)

మీరు రోజువారీ మార్పులన్నీ `develop` లో చేస్తారు. ఆ మార్పులను ప్రొడక్షన్‌కు పంపడానికి 2 సులభమైన పద్ధతులు ఉన్నాయి:

### పద్ధతి 1: ఒక్క క్లిక్‌తో (Recommended Script)
మేము మీ ప్రాజెక్ట్ రూట్‌లో [`push_to_prod.bat`](file:///d:/Clickzen/PDF%20Application/push_to_prod.bat) తయారు చేసాము.
- కమాండ్ ప్రాంప్ట్‌లో క్రింది కమాండ్ ఇవ్వండి లేదా ఫైల్‌పై డబుల్ క్లిక్ చేయండి:
```cmd
push_to_prod.bat
```
ఇది ఆటోమేటిక్‌గా:
1. `develop` లోని మార్పులను కమిట్ చేసి GitHub `develop` కు పంపుతుంది (హోస్టింగర్ Dev లైవ్ అవుతుంది).
2. `prod` బ్రాంచ్‌లోకి వెళ్లి `develop` ను మెర్జ్ చేస్తుంది.
3. GitHub `prod` కు పుష్ చేస్తుంది (హోస్టింగర్ Prod లైవ్ అవుతుంది).
4. తిరిగి `develop` బ్రాంచ్‌కు వచ్చేస్తుంది.

---

### పద్ధతి 2: కమాండ్ ప్రాంప్ట్ మాన్యువల్ కమాండ్స్ (Manual Git Commands)

మీరు నేరుగా కమాండ్స్ టైప్ చేయాలనుకుంటే Command Prompt లో ఈ 4 కమాండ్స్ ఇవ్వండి:

```cmd
:: 1. Develop లో మార్పులను పుష్ చేయండి
git checkout develop
git add .
git commit -m "Updated features on develop"
git push origin develop

:: 2. Prod లోకి మారి Develop ను కలపండి
git checkout prod
git merge develop
git push origin prod

:: 3. తిరిగి Develop బ్రాంచ్‌కు రండి
git checkout develop
```

---

## 7. ఫైల్ పర్మిషన్లు (File Permissions on Hostinger)
హోస్టింగర్ ఫైల్ మేనేజర్‌లో:
- `backend/storage/` -> `755` లేదా `775`
- `backend/storage/pdfs/` -> `755` లేదా `775`
- `backend/storage/uploads/` -> `755` లేదా `775`

---

## 8. ఫలితం (Verification)
- **Develop వెబ్ అడ్మిన్**: `https://dev.yourdomain.com/admin/` (Develop డేటాబేస్‌తో అనుసంధానం)
- **Prod వెబ్ అడ్మిన్**: `https://yourdomain.com/admin/` (Production డేటాబేస్‌తో అనుసంధానం)
- **డైరెక్ట్ PDF వీక్షణి**: `https://yourdomain.com/api/documents/1/view`
- **పూర్తిగా Node.js రహితం**: 100% PHP & Apache Static Hosting.
