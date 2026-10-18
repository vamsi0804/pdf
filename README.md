# Traditional Telugu Knowledge & PDF Reader Mobile Application
### సాంప్రదాయిక జ్ఞాన తరంగిణి (Vedic & Traditional Telugu Knowledge App)

A production-ready mobile application and administration platform inspired by the traditional Telugu interface featuring handcrafted wooden signboards, carved wooden chapter planks, turquoise rivets, Telugu typography, and sacred devotional background artwork.

---

## 🏛️ System Architecture

```
PDF Application/
├── backend/                   # PHP 8.2 REST API
│   ├── config/Database.php    # Dual Driver: MySQL PDO + Auto SQLite fallback
│   ├── database/
│   │   ├── schema.mysql.sql   # Production MySQL DDL with utf8mb4 Telugu support
│   │   ├── schema.sqlite.sql  # Zero-setup local SQLite DDL
│   │   ├── seed.sql           # Initial 3 categories, 15 chapters, 24 subtopics, documents
│   │   └── init_db.php        # CLI database initializer & seeder
│   ├── public/index.php       # High-performance API router & static asset server
│   ├── src/
│   │   ├── Controllers/       # Categories, Chapters, Subtopics, Documents, Admin, Settings
│   │   ├── Middleware/        # CORS & Bearer JWT Auth middleware
│   │   └── Services/          # PDF file validation, secure streaming with HTTP Range
│   └── storage/pdfs/          # Protected storage for uploaded PDFs
│
├── mobile/                    # React Native (Expo SDK 52, TypeScript)
│   ├── App.tsx                # Font loading, safe areas, status bar, screen coordinator
│   ├── src/
│   │   ├── components/wooden/ # WoodenCategoryButton, WoodenChapterPlank,
│   │   │                      # WoodenSubtopicButton, ChevronIndicator, WoodenAuxButton
│   │   ├── components/pdf/    # PDFReaderScreen with pinch-to-zoom, page counter, caching
│   │   ├── screens/HomeScreen # Dual-column responsive layout (30% chapters, 70% subtopics)
│   │   ├── services/api.ts    # Resilient API client with offline fallback & host auto-detect
│   │   └── constants/theme.ts # Traditional wood palette (#75451F, #E7C65A, #D8E8A0, #168FA8)
│   └── assets/                # Background artwork, Telugu fonts, app icons
│
└── admin/                     # React + Vite + TypeScript Web Management Dashboard
    ├── src/
    │   ├── components/        # CategoryManager, ChapterManager, SubtopicManager,
    │   │                      # DocumentManager, SettingsManager, MobileSimulator, LoginModal
    │   ├── services/api.ts    # Admin REST API client with JWT bearer tokens
    │   ├── App.tsx            # Split-screen dashboard with live mobile UI emulator
    │   └── index.css          # Authentic wood styling and custom scrollbars
    └── vite.config.ts         # Proxy config for backend API routes
```

---

## 🎨 Visual Design Hierarchy (Reference Re-creation)

1. **LEVEL 1 — Three Main Categories (Top Wooden Signboards)**
   - Three handcrafted wooden plaques arranged horizontally:
     - **సంప్రదాయ** (Sanatana Dharma & Vedic Samhita)
     - **బ్రాహ్మణం** (Brahmana philosophy & rituals)
     - **ఆరోగ్యం** (Traditional Ayurveda & Dinacharya)
   - Corner wooden support stakes/pegs, dark carved borders, cream/yellow engraved Telugu lettering.
   - Fully dynamic and reorderable via the Admin Dashboard.

2. **LEVEL 2 — Numbered Chapters (Left Column: ~30% Width)**
   - Downward traditional golden chevron motif (`>>>`).
   - Vertical column of dark wood planks (`1 వ అష్టము`, `2 వ అష్టము` ... `7 వ అష్టము`).
   - Active chapter highlighted with golden border and rich walnut lighting.
   - Independent vertical scrolling.

3. **LEVEL 3 — Subtopic Buttons (Right Column: ~70% Width)**
   - Wide horizontal wooden buttons with rounded right edges.
   - Connected to a vertical dark wooden spine on the left.
   - Glowing turquoise/cyan circular rivets (`#168FA8`) with glossy 3D lighting glint.
   - Large, clear Telugu script in pale sage green (`#D8E8A0`).
   - Authentic Vedic Anuvakas pre-loaded:
     - `ఇషే త్వా`
     - `ఆప ఉన్దన్తు`
     - `దేవస్య త్వా`
     - `ఆదదే`
     - `దేవాసురాః`
     - `సన్త్వా సిఞ్చామి`
     - `పాక యజ్ఞం`
     - `అనుమత్యై`

4. **In-App PDF Reader**
   - Compact top bar with Back (`←`), document title, and zoom controls (`-`, `100%`, `+`).
   - Vertical continuous scrolling with pinch-to-zoom.
   - Page counter (`పుట 1 / 1`), mantra text boxes, meanings, and direct server streaming.
   - Back button returns directly to the exact selected category and chapter without state loss.
   - Elegant empty state when a subtopic does not yet have an attached document.

5. **Bottom Traditional Aux Signboard Buttons**
   - Replicating the reference bottom buttons: `ప్రాతిశాఖ్య`, `ప్రశ్నల వివరములు`, `అనధ్యాయములు`.
   - Author / tradition credit: `V B S Sarma Kompella`.

---

## 🚀 Quick Start Guide

### 1. PHP REST API Server
The backend requires PHP 8.1+ (PHP 8.2 is already installed). It automatically runs on SQLite out-of-the-box with zero database configuration needed, and also supports MySQL.

```bash
# From project root:
cd "d:\Clickzen\PDF Application"

# Optional: re-initialize database and sample PDFs
php backend/database/init_db.php
php backend/database/generate_sample_pdfs.php

# Start the PHP server on port 8000
php -S 127.0.0.1:8000 -t backend/public
```
The API is now live at `http://127.0.0.1:8000/api/health`.

---

### 2. Web Administration Dashboard
The Admin Dashboard is built with React, Vite, and Tailwind CSS.

```bash
cd "d:\Clickzen\PDF Application\admin"

# Start the Vite development server (proxies to PHP API on port 8000)
npm run dev -- --port 3000
```
Open **`http://127.0.0.1:3000`** in your browser.

**Admin Credentials:**
- **Email:** `admin@vedicknowledge.org`
- **Password:** `admin123`

Features available in Admin:
- **Category Manager**: Add, edit Telugu titles, reorder, toggle active state.
- **Chapter Manager**: Create chapters under selected category, reorder, publish/unpublish.
- **Subtopic Manager**: Add Anuvakas/topics, reorder, link PDF status.
- **Document Manager**: Drag-and-drop PDF upload, file size validation, permissions, inline PDF preview modal.
- **Settings & Background Manager**: Change app title, custom theme colors, upload custom temple background images.
- **Live Mobile Simulator**: Side-by-side interactive preview that immediately updates as you modify data!

---

### 3. Mobile Application (React Native / Expo)

```bash
cd "d:\Clickzen\PDF Application\mobile"

# Start Expo development server
npx expo start

# Or test in browser directly:
npx expo start --web
```

To run on an **Android Device or Emulator**:
1. Install **Expo Go** from Google Play Store on your phone.
2. Ensure your phone is on the same Wi-Fi network as your computer.
3. Scan the QR code displayed in the terminal.
4. Or press `a` in the terminal to launch in an Android Emulator.

---

## 📱 Standalone Mobile Builds (Android & iOS)

### Method A: Cloud Build using Expo Application Services (EAS Build) - Recommended

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure project credentials:
   ```bash
   cd mobile
   eas build:configure
   ```
4. **Build Android APK (Direct install on any Android phone):**
   ```bash
   eas build -p android --profile preview
   ```
5. **Build Android App Bundle (.aab for Google Play Store):**
   ```bash
   eas build -p android --profile production
   ```
6. **Build iOS IPA (App Store / TestFlight):**
   ```bash
   eas build -p ios --profile production
   ```

### Method B: Local Offline Android Build (Android Studio & Gradle)

1. Generate native `android/` directory:
   ```bash
   cd mobile
   npx expo prebuild --platform android
   ```
2. Build debug APK using Gradle:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   The APK will be generated at:
   `android/app/build/outputs/apk/debug/app-debug.apk`.

3. Build release signed APK:
   ```bash
   ./gradlew assembleRelease
   ```
   The release APK will be generated at:
   `android/app/build/outputs/apk/release/app-release.apk`.

---

## 🗄️ MySQL Production Database Setup

When deploying to a dedicated server with MySQL / MariaDB:

1. Create the MySQL database:
   ```sql
   CREATE DATABASE telugu_pdf_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import the schema and seed data:
   ```bash
   mysql -u root -p telugu_pdf_app < backend/database/schema.mysql.sql
   mysql -u root -p telugu_pdf_app < backend/database/seed.sql
   ```
3. Configure environment variables in your web server (Apache/Nginx/Docker) or `.env`:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=telugu_pdf_app
   DB_USERNAME=your_mysql_user
   DB_PASSWORD=your_mysql_password
   ```

---

## 🌐 Production Web Server Deployment (Apache / Nginx)

### Apache `.htaccess` Configuration
Ensure `mod_rewrite` is enabled. Place this in `backend/public/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

### Nginx Server Block
```nginx
server {
    listen 80;
    server_name api.vedicknowledge.org;
    root /var/www/pdf-app/backend/public;

    index index.php;
    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
```

---

## ✅ Acceptance Criteria & Test Results

| Test Case | Requirement | Result |
| :--- | :--- | :---: |
| **Visual Aesthetics** | Wooden signboards, carved borders, turquoise rivets, Telugu script | **PASSED** |
| **Level 1 Navigation** | 3 hanging wooden buttons (సంప్రదాయ, బ్రాహ్మణం, ఆరోగ్యం) | **PASSED** |
| **Level 2 Navigation** | Numbered wooden chapter planks (1 వ అష్టము to 7 వ అష్టము) | **PASSED** |
| **Level 3 Navigation** | Horizontal rounded subtopic buttons with turquoise pegs | **PASSED** |
| **PDF Reader** | In-app reading, zoom controls, document title, server stream | **PASSED** |
| **State Preservation** | Back button preserves active category and chapter selection | **PASSED** |
| **Dynamic Backend** | PHP REST API with category, chapter, subtopic, PDF CRUD | **PASSED** |
| **Database** | MySQL utf8mb4 schema + automatic SQLite fallback | **PASSED** |
| **Admin Dashboard** | React + Vite dashboard with live mobile emulator | **PASSED** |
| **PDF Uploads** | File validation, MIME check, magic byte `%PDF` check, 50MB limit | **PASSED** |
| **Mobile Build** | Expo web export and TypeScript typecheck with 0 errors | **PASSED** |
