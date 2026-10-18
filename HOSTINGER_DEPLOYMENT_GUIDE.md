# హోస్టింగర్ (Hostinger) డిప్లాయ్‌మెంట్ మార్గదర్శిని
## Traditional Telugu Knowledge & PDF Reader Platform

ఈ ప్రాజెక్ట్ **Shared Hosting (Hostinger cPanel/hPanel)** లో **Node.js అవసరం లేకుండా (Without Node.js)** పూర్తిగా PHP మరియు MySQL లతో నడపడానికి సిద్ధంగా రూపొందించబడింది.

---

## 1. సిస్టమ్ నిర్మాణం (Architecture Overview)

```
Hostinger public_html/
├── .htaccess                 (రూట్ డైరెక్టరీ రీరైట్ & భద్రతా నియమాలు)
├── index.php                 (రూట్ ఫార్వార్డర్)
├── backend/
│   ├── config/
│   │   ├── config.php        (MySQL డేటాబేస్ & అప్లికేషన్ కాన్ఫిగరేషన్)
│   │   └── Database.php      (PDO MySQL కనెక్షన్)
│   ├── database/
│   │   └── single_database_install.sql (ఒకే ఒక్క క్లిక్‌తో ఇన్‌స్టాల్ అయ్యే MySQL ఫైల్)
│   ├── public/
│   │   ├── admin/            (స్టాటిక్ రియాక్ట్ అడ్మిన్ ప్యానెల్ - నోడ్ అవసరం లేదు)
│   │   ├── js/
│   │   │   ├── pdf.min.js    (ఆఫ్‌లైన్ పి.డి.ఎఫ్ రెండరర్)
│   │   │   └── pdf.worker.min.js
│   │   ├── viewer.php        (నేరుగా బ్రౌజర్‌లో పి.డి.ఎఫ్ వీక్షించే స్వతంత్ర పేజీ)
│   │   └── index.php         (PHP రౌటర్ & REST API)
│   └── storage/
│       ├── pdfs/             (అన్ని 59 ఒరిజినల్ వేద పి.డి.ఎఫ్ దస్త్రాలు)
│       └── uploads/          (సంప్రదాయ నేపథ్య చిత్రాలు)
```

---

## 2. గిట్‌హబ్ (GitHub) సెటప్ - develop మరియు prod బ్రాంచ్‌లు

మీ స్థానిక కంప్యూటర్‌లో `develop` మరియు `prod` బ్రాంచ్‌లు ఇప్పటికే రూపొందించబడ్డాయి.

### Step 2.1: గిట్‌హబ్‌లో రిపోజిటరీ సృష్టించడం
1. [GitHub.com](https://github.com) లోకి లాగిన్ అవ్వండి.
2. నూతన రిపోజిటరీని సృష్టించండి (ఉదాహరణకు: `telugu-pdf-app`). **Initialize with README ను అన్‌చెక్ చేయండి**.

### Step 2.2: కోడ్‌ను గిట్‌హబ్‌కు పుష్ చేయడం
మీ టెర్మినల్ లేదా పవర్‌షెల్‌లో క్రింది ఆదేశాలను అమలు చేయండి:

```bash
# 1. రిమోట్ రిపోజిటరీని జోడించండి (మీ యూజర్‌నేమ్ మార్చుకోండి):
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/telugu-pdf-app.git

# 2. develop బ్రాంచ్‌ను పుష్ చేయండి:
git push -u origin develop

# 3. prod బ్రాంచ్‌ను పుష్ చేయండి:
git push -u origin prod
```

---

## 3. హోస్టింగర్ సింగిల్ డేటాబేస్ (MySQL) సెటప్

మేము తయారుచేసిన `single_database_install.sql` ఫైల్ ద్వారా 6 టేబుళ్లు, 3 విభాగాలు, 15 అధ్యాయాలు, 59 అనువాకాలు మరియు డిఫాల్ట్ అడ్మిన్ అకౌంట్ ఒక్క క్లిక్‌తో ఇన్‌స్టాల్ అవుతాయి.

1. **హోస్టింగర్ hPanel** లోకి లాగిన్ అవ్వండి.
2. **Databases** -> **MySQL Databases** విభాగంలోకి వెళ్లండి.
3. నూతన డేటాబేస్‌ను సృష్టించండి:
   - **Database Name**: ఉదా: `u123456789_telugu`
   - **Username**: ఉదా: `u123456789_admin`
   - **Password**: మీ పాస్‌వర్డ్
4. డేటాబేస్ ప్రక్కన ఉన్న **Enter phpMyAdmin** బటన్‌ను క్లిక్ చేయండి.
5. పైన ఉన్న **Import** ట్యాబ్‌ను ఎంచుకోండి.
6. **Choose File** క్లిక్ చేసి `backend/database/single_database_install.sql` ను ఎంచుకోండి.
7. పేజీ దిగువన ఉన్న **Go** లేదా **Import** క్లిక్ చేయండి.

> **డిఫాల్ట్ అడ్మిన్ లాగిన్ వివరాలు:**
> - ఈమెయిల్: `admin@vedicknowledge.org`
> - పాస్‌వర్డ్: `admin123`

---

## 4. హోస్టింగర్ గిట్ డిప్లాయ్‌మెంట్ (Git Deployment)

హోస్టింగర్ hPanel లో గిట్‌ను కనెక్ట్ చేయడం ద్వారా మీరు గిట్‌హబ్‌కు పుష్ చేసిన వెంటనే లైవ్ సర్వర్ ఆటోమేటిక్‌గా అప్‌డేట్ అవుతుంది.

### Step 4.1: టెస్టింగ్ / స్టేజింగ్ (develop బ్రాంచ్)
1. hPanel లో **Advanced** -> **Git** విభాగంలోకి వెళ్లండి.
2. **Repository URL**: `https://github.com/<YOUR_USERNAME>/telugu-pdf-app.git`
3. **Branch**: `develop`
4. **Install Path**: 
   - సబ్‌డొమైన్ కొరకు అయితే: `/public_html/dev`
   - ప్రధాన డొమైన్ కొరకు అయితే: `/public_html`
5. **Create** బటన్ క్లిక్ చేయండి.
6. అక్కడ ఇచ్చే **Webhook URL** ను కాపీ చేసుకోండి.
7. మీ GitHub రిపోజిటరీ -> **Settings** -> **Webhooks** -> **Add webhook** లో ఆ URL ను పేస్ట్ చేయండి (Content type: `application/json`).
8. ఇప్పుడు మీరు `develop` కు పుష్ చేసిన ప్రతిసారీ హోస్టింగర్ వెంటనే కోడ్‌ను లైవ్ చేస్తుంది.

### Step 4.2: ప్రొడక్షన్ లైవ్ (prod బ్రాంచ్)
1. మీరు `develop` బ్రాంచ్‌లో అన్ని పరిశీలించిన తరువాత, మార్పులను `prod` లోకి కలపండి:
   ```bash
   git checkout prod
   git merge develop
   git push origin prod
   ```
2. మీ ప్రధాన డొమైన్ గిట్ బ్రాంచ్‌ను `prod` కు అనుసంధానించండి.

---

## 5. కాన్ఫిగరేషన్ ఫైల్ (`config.php`) సవరణ

హోస్టింగర్ ఫైల్ మేనేజర్‌లో `backend/config/config.php` ఫైల్‌ను తెరిచి మీ డేటాబేస్ వివరాలను ఇవ్వండి:

```php
<?php
return [
    'db' => [
        'driver'   => 'mysql',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'u123456789_telugu',     // మీ హోస్టింగర్ DB పేరు
        'username' => 'u123456789_admin',      // మీ హోస్టింగర్ DB యూజర్‌నేమ్
        'password' => 'మీ_డేటాబేస్_పాస్‌వర్డ్',  // మీ పాస్‌వర్డ్
    ],
    'app' => [
        'name'       => 'సాంప్రదాయిక జ్ఞాన తరంగిణి',
        'url'        => 'https://yourdomain.com', // మీ డొమైన్ URL
        'jwt_secret' => 'telugu_traditional_sacred_knowledge_jwt_key_2026',
    ]
];
```

---

## 6. ఫైల్ పర్మిషన్లు (File Permissions)

PDFలు మరియు చిత్రాల అప్‌లోడ్ సరిగ్గా పనిచేయుటకు హోస్టింగర్ ఫైల్ మేనేజర్‌లో:
- `backend/storage/` -> Permissions: `755` లేదా `775`
- `backend/storage/pdfs/` -> Permissions: `755` లేదా `775`
- `backend/storage/uploads/` -> Permissions: `755` లేదా `775`

---

## 7. యాక్సెస్ యు.ఆర్.ఎల్ (URLs)

డిప్లాయ్‌మెంట్ పూర్తయిన తర్వాత:
- **అడ్మిన్ డాష్‌బోర్డ్**: `https://yourdomain.com/admin/`
- **బ్యాకెండ్ API**: `https://yourdomain.com/api/categories`
- **డైరెక్ట్ PDF వ్యూయర్**: `https://yourdomain.com/api/documents/1/view`

---

## 8. మొబైల్ యాప్‌లో లైవ్ హోస్టింగర్ డొమైన్ కనెక్ట్ చేయడం

మొబైల్ యాప్‌ను ప్రొడక్షన్ హోస్టింగర్ సర్వర్‌కు కనెక్ట్ చేయడానికి `mobile/src/services/api.ts` లోని `getBaseUrl` ఫంక్షన్‌లో మీ ప్రొడక్షన్ డొమైన్‌ను నమోదు చేయండి:

```typescript
// mobile/src/services/api.ts
export const getBaseUrl = (): string => {
  // ప్రొడక్షన్ హోస్టింగర్ API
  return 'https://yourdomain.com/api';
};
```

ఇప్పుడు EAS Build ద్వారా లేదా APK బిల్డ్ ద్వారా మీ మొబైల్ యాప్ నేరుగా హోస్టింగర్ లైవ్ సర్వర్ నుండే డేటాను మరియు PDFలను అత్యంత వేగంగా పొందుతుంది.
