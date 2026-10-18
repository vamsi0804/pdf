-- MySQL Schema for Traditional Telugu Knowledge & PDF Reader App
-- Character set: utf8mb4 for full Telugu Unicode support

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(100) NULL,
    display_order INT NOT NULL DEFAULT 1,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (display_order),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    chapter_number INT NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 1,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category_order (category_id, display_order),
    INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subtopics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    display_order INT NOT NULL DEFAULT 1,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
    INDEX idx_chapter_order (chapter_id, display_order),
    INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subtopic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size INT NOT NULL DEFAULT 0,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    allow_download TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(id) ON DELETE CASCADE,
    INDEX idx_subtopic (subtopic_id),
    INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS app_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Seed Data for Traditional Telugu Knowledge & PDF Reader App

-- App Settings
INSERT INTO app_settings (setting_key, setting_value) VALUES
('app_title', 'à°¸à°¾à°‚à°ªà±à°°à°¦à°¾à°¯à°¿à°• à°œà±à°žà°¾à°¨ à°¤à°°à°‚à°—à°¿à°£à°¿'),
('app_subtitle', 'à°µà±‡à°¦ à°¸à°‚à°ªà±à°°à°¦à°¾à°¯ & à°†à°¯à±à°°à±à°µà±‡à°¦ à°µà°¿à°œà±à°žà°¾à°¨ à°—à±à°°à°‚à°¥à°¾à°²à±'),
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
(1, 'à°¸à°‚à°ªà±à°°à°¦à°¾à°¯', 'à°¸à°¨à°¾à°¤à°¨ à°§à°°à±à°® à°µà±‡à°¦ à°¸à°‚à°¹à°¿à°¤à°²à± à°®à°°à°¿à°¯à± à°¸à°¾à°‚à°ªà±à°°à°¦à°¾à°¯à°¿à°• à°µà°¿à°œà±à°žà°¾à°¨à°‚', 'scroll', 1, 1),
(2, 'à°¬à±à°°à°¾à°¹à±à°®à°£à°‚', 'à°¯à°œà±à°ž à°¯à°¾à°—à°¾à°¦à±à°² à°…à°‚à°¤à°°à°¾à°°à±à°¥à°¾à°²à± à°®à°°à°¿à°¯à± à°µà±ˆà°¦à°¿à°• à°µà°¿à°§à±à°²à°•à± à°¸à°‚à°¬à°‚à°§à°¿à°‚à°šà°¿à°¨ à°µà°¿à°µà°°à°£à°²à±', 'book', 2, 1),
(3, 'à°†à°°à±‹à°—à±à°¯à°‚', 'à°¸à°¾à°‚à°ªà±à°°à°¦à°¾à°¯à°¿à°• à°†à°¯à±à°°à±à°µà±‡à°¦ à°œà±€à°µà°¨à°¶à±ˆà°²à°¿ à°®à°°à°¿à°¯à± à°†à°°à±‹à°—à±à°¯ à°¸à±‚à°¤à±à°°à°¾à°²à±', 'heart', 3, 1);

-- Category 1 (à°¸à°‚à°ªà±à°°à°¦à°¾à°¯) - 7 Chapters (1à°µ à°…à°·à±à°Ÿà°®à± to 7à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO chapters (id, category_id, title, description, chapter_number, display_order, is_published) VALUES
(1, 1, '1 à°µ à°…à°·à±à°Ÿà°®à±', 'à°ªà±à°°à°¥à°® à°…à°·à±à°Ÿà°•à°®à± - à°¦à°°à±à°¶à°ªà±‚à°°à±à°£à°®à°¾à°¸ à°ªà±à°°à°•à°°à°£à°®à±', 1, 1, 1),
(2, 1, '2 à°µ à°…à°·à±à°Ÿà°®à±', 'à°¦à±à°µà°¿à°¤à±€à°¯ à°…à°·à±à°Ÿà°•à°®à± - à°…à°—à±à°¨à°¿à°·à±à°Ÿà±‹à°® à°®à°‚à°¤à±à°°à°®à±à°²à±', 2, 2, 1),
(3, 1, '3 à°µ à°…à°·à±à°Ÿà°®à±', 'à°¤à±ƒà°¤à±€à°¯ à°…à°·à±à°Ÿà°•à°®à± - à°µà°¾à°œà°ªà±‡à°¯ à°¯à°¾à°— à°•à±à°°à°®à°®à±', 3, 3, 1),
(4, 1, '4 à°µ à°…à°·à±à°Ÿà°®à±', 'à°šà°¤à±à°°à±à°¥ à°…à°·à±à°Ÿà°•à°®à± - à°°à°¾à°œà°¸à±‚à°¯ à°¯à°¾à°— à°µà°¿à°¶à±‡à°·à°¾à°²à±', 4, 4, 1),
(5, 1, '5 à°µ à°…à°·à±à°Ÿà°®à±', 'à°ªà°‚à°šà°® à°…à°·à±à°Ÿà°•à°®à± - à°šà°¯à°¨à°¾à°¦à°¿ à°¹à±‹à°® à°µà°¿à°§à±à°²à±', 5, 5, 1),
(6, 1, '6 à°µ à°…à°·à±à°Ÿà°®à±', 'à°·à°·à±à°  à°…à°·à±à°Ÿà°•à°®à± - à°…à°¶à±à°µà°®à±‡à°§ à°®à°‚à°¤à±à°° à°ªà±à°°à°µà°šà°¨à°‚', 6, 6, 1),
(7, 1, '7 à°µ à°…à°·à±à°Ÿà°®à±', 'à°¸à°ªà±à°¤à°® à°…à°·à±à°Ÿà°•à°®à± - à°¸à±Œà°¤à±à°°à°¾à°®à°£à°¿ à°¤à°¤à±à°¤à±à°µ à°µà°¿à°µà±‡à°šà°¨', 7, 7, 1);

-- Category 2 (à°¬à±à°°à°¾à°¹à±à°®à°£à°‚) - 4 Chapters
INSERT INTO chapters (id, category_id, title, description, chapter_number, display_order, is_published) VALUES
(8, 2, '1 à°µ à°ªà±à°°à°ªà°¾à° à°•à°‚', 'à°ªà±à°°à°ªà°¾à° à°•à°®à± à°’à°•à°Ÿà°¿ - à°¸à°¤à±à°°à°¯à°¾à°— à°¦à°°à±à°¶à°¨à°®à±', 1, 1, 1),
(9, 2, '2 à°µ à°ªà±à°°à°ªà°¾à° à°•à°‚', 'à°ªà±à°°à°ªà°¾à° à°•à°®à± à°°à±†à°‚à°¡à± - à°¸à±‹à°®à°¯à°¾à°— à°°à°¹à°¸à±à°¯à°¾à°²à±', 2, 2, 1),
(10, 2, '3 à°µ à°ªà±à°°à°ªà°¾à° à°•à°‚', 'à°ªà±à°°à°ªà°¾à° à°•à°®à± à°®à±‚à°¡à± - à°¹à°µà°¿à°°à±à°¯à°œà±à°ž à°…à°‚à°¤à°°à°¾à°°à±à°¥à°‚', 3, 3, 1),
(11, 2, '4 à°µ à°ªà±à°°à°ªà°¾à° à°•à°‚', 'à°ªà±à°°à°ªà°¾à° à°•à°®à± à°¨à°¾à°²à±à°—à± - à°ªà°µà°¿à°¤à±à°° à°¦à°°à±à°­à°¾à°­à°¿à°·à±‡à°•à°®à±', 4, 4, 1);

-- Category 3 (à°†à°°à±‹à°—à±à°¯à°‚) - 4 Chapters
INSERT INTO chapters (id, category_id, title, description, chapter_number, display_order, is_published) VALUES
(12, 3, '1 à°µ à°µà°¿à°­à°¾à°—à°‚', 'à°¦à°¿à°¨à°šà°°à±à°¯ - à°ªà±à°°à°¾à°šà±€à°¨ à°¨à°¿à°¤à±à°¯ à°œà±€à°µà°¨ à°µà°¿à°§à°¾à°¨à°®à±', 1, 1, 1),
(13, 3, '2 à°µ à°µà°¿à°­à°¾à°—à°‚', 'à°‹à°¤à±à°šà°°à±à°¯ - à°•à°¾à°² à°µà°¿à°­à°¾à°—à°®à± & à°¶à°°à±€à°° à°°à°•à±à°·à°£', 2, 2, 1),
(14, 3, '3 à°µ à°µà°¿à°­à°¾à°—à°‚', 'à°¦à°¿à°µà±à°¯ à°”à°·à°§ à°—à±à°£à°¾à°²à± - à°µà°¨à°®à±‚à°²à°¿à°•à°² à°µà±ˆà°¶à°¿à°·à±à°Ÿà±à°¯à°‚', 3, 3, 1),
(15, 3, '4 à°µ à°µà°¿à°­à°¾à°—à°‚', 'à°ªà±à°°à°¾à°£à°¾à°¯à°¾à°®à°‚ & à°¯à±‹à°— à°šà°¿à°•à°¿à°¤à±à°¸', 4, 4, 1);

-- Subtopics for Chapter 1 (1à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(1, 1, 'à°‡à°·à±‡ à°¤à±à°µà°¾', 'à°ªà±à°°à°¥à°® à°…à°¨à±à°µà°¾à°•à°®à± - à°ªà°µà°¿à°¤à±à°° à°§à°¾à°¨à±à°¯ à°¸à°‚à°šà°¯à°¨ à°®à°‚à°¤à±à°°à°®à±', 1, 1),
(2, 1, 'à°†à°ª à°‰à°¨à±à°¦à°¨à±à°¤à±', 'à°¦à±à°µà°¿à°¤à±€à°¯ à°…à°¨à±à°µà°¾à°•à°®à± - à°ªà°µà°¿à°¤à±à°° à°œà°² à°¶à±à°¦à±à°§à°¿ à°®à°‚à°¤à±à°°à°¾à°°à±à°ªà°£', 2, 1),
(3, 1, 'à°¦à±‡à°µà°¸à±à°¯ à°¤à±à°µà°¾', 'à°¤à±ƒà°¤à±€à°¯ à°…à°¨à±à°µà°¾à°•à°®à± - à°¦à±‡à°µà°¤à°¾ à°¸à°®à°°à±à°ªà°£ à°µà°¿à°§à°¿', 3, 1),
(4, 1, 'à°†à°¦à°¦à±‡', 'à°šà°¤à±à°°à±à°¥ à°…à°¨à±à°µà°¾à°•à°®à± - à°¹à°µà°¿à°°à± à°—à±à°°à°¹à°£ à°ªà±à°°à°•à±à°°à°¿à°¯', 4, 1),
(5, 1, 'à°¦à±‡à°µà°¾à°¸à±à°°à°¾à°ƒ', 'à°ªà°‚à°šà°® à°…à°¨à±à°µà°¾à°•à°®à± - à°¦à±‡à°µà°¾à°¸à±à°° à°¸à°‚à°—à±à°°à°¾à°® à°°à°¹à°¸à±à°¯à°®à±', 5, 1),
(6, 1, 'à°¸à°¨à±à°¤à±à°µà°¾ à°¸à°¿à°žà±à°šà°¾à°®à°¿', 'à°·à°·à±à°  à°…à°¨à±à°µà°¾à°•à°®à± - à°…à°­à°¿à°·à±‡à°• à°œà°² à°¸à°¿à°‚à°œà°¨ à°µà°¿à°§à°¿', 6, 1),
(7, 1, 'à°ªà°¾à°• à°¯à°œà±à°žà°‚', 'à°¸à°ªà±à°¤à°® à°…à°¨à±à°µà°¾à°•à°®à± - à°—à±ƒà°¹à°¸à±à°¥ à°ªà°¾à°• à°¯à°œà±à°ž à°¨à°¿à°¯à°®à°¾à°²à±', 7, 1),
(8, 1, 'à°…à°¨à±à°®à°¤à±à°¯à±ˆ', 'à°…à°·à±à°Ÿà°® à°…à°¨à±à°µà°¾à°•à°®à± - à°…à°¨à±à°®à°¤à±€ à°¦à±‡à°µà±€ à°ªà±à°°à°¾à°°à±à°¥à°¨', 8, 1);

-- Subtopics for Chapter 2 (2à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(9, 2, 'à°…à°—à±à°¨à°¿à°®à±€à°³à±‡ à°ªà±à°°à±‹à°¹à°¿à°¤à°‚', 'à°…à°—à±à°¨à°¿à°¦à±‡à°µ à°¸à±à°¤à±à°¤à°¿ & à°¯à°œà±à°ž à°ªà±à°°à±‹à°¹à°¿à°¤à°¤à±à°µà°‚', 1, 1),
(10, 2, 'à°µà°¾à°¯à°µà°¾à°¯à°¾à°¹à°¿ à°¦à°°à±à°¶à°¤', 'à°µà°¾à°¯à±à°¦à±‡à°µ à°†à°¹à±à°µà°¾à°¨ à°®à°‚à°¤à±à°°à°®à±à°²à±', 2, 1),
(11, 2, 'à°‡à°‚à°¦à±à°°à°µà°¾à°¯à±‚ à°‡à°®à±‡ à°¸à±à°¤à°¾à°ƒ', 'à°‡à°‚à°¦à±à°° à°µà°¾à°¯à± à°¸à°®à±ˆà°•à±à°¯ à°¸à°®à°°à±à°ªà°£', 3, 1),
(12, 2, 'à°®à°¿à°¤à±à°°à°‚ à°¹à±à°µà±‡ à°ªà±‚à°¤à°¦à°•à±à°·à°‚', 'à°®à°¿à°¤à±à°°-à°µà°°à±à°£ à°¦à±‡à°µà°¤à°² à°¦à°¿à°µà±à°¯ à°ªà±à°°à°¾à°¶à°¸à±à°¤à±à°¯à°‚', 4, 1),
(13, 2, 'à°…à°¶à±à°µà°¿à°¨à°¾ à°¯à°œà±à°µà°°à±€à°°à°¿à°·à±‹', 'à°…à°¶à±à°µà°¿à°¨à±€ à°¦à±‡à°µà°¤à°² à°¦à°¿à°µà±à°¯ à°­à±‡à°·à°œ à°®à°¹à°¿à°®', 5, 1);

-- Subtopics for Chapter 3 (3à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(14, 3, 'à°ªà±à°°à°¾à°œà°¾à°ªà°¤à±à°¯à°‚', 'à°ªà±à°°à°œà°¾à°ªà°¤à°¿ à°¸à±ƒà°·à±à°Ÿà°¿ à°¸à°‚à°•à°²à±à°ª à°µà°¿à°¶à±à°²à±‡à°·à°£', 1, 1),
(15, 3, 'à°¸à±Œà°®à±à°¯à°‚', 'à°šà°‚à°¦à±à°° à°¤à°¤à±à°¤à±à°µ à°†à°°à°¾à°§à°¨ à°µà°¿à°§à°¾à°¨à°‚', 2, 1),
(16, 3, 'à°µà±ˆà°¶à±à°µà°¦à±‡à°µà°‚', 'à°µà°¿à°¶à±à°µà±‡à°¦à±‡à°µà°¤à°² à°¸à°°à±à°µà°¤à±‹à°®à±à°– à°®à°‚à°—à°³ à°¹à°µà°¿à°¸à±à°¸à±', 3, 1),
(17, 3, 'à°¸à°¾à°°à°¸à±à°µà°¤à°‚', 'à°¸à°°à°¸à±à°µà°¤à±€ à°¦à±‡à°µà°¿ à°µà°¾à°—à±à°µà±ˆà°­à°µà°‚', 4, 1);

-- Subtopics for Chapter 4 (4à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(18, 4, 'à°°à°¾à°œà°¸à±‚à°¯ à°µà°¿à°§à°¿', 'à°¸à°¾à°°à±à°µà°­à±Œà°® à°šà°•à±à°°à°µà°°à±à°¤à±à°² à°…à°­à°¿à°·à±‡à°• à°•à±à°°à°®à°‚', 1, 1),
(19, 4, 'à°¦à°¿à°—à±à°µà°¿à°œà°¯ à°ªà±à°°à°¾à°°à±à°¥à°¨', 'à°šà°¤à±à°°à±à°¦à°¿à°¶à°² à°¦à±‡à°µà°¤à°² à°†à°¶à±€à°°à±à°µà°¾à°¦ à°¸à±‚à°•à±à°¤à°‚', 2, 1),
(20, 4, 'à°°à°¤à±à°¨à°¿ à°¹à°µà°¿à°¸à±à°¸à±à°²à±', 'à°°à°¾à°·à±à°Ÿà±à°° à°ªà°¾à°²à°¨ & à°®à°‚à°¤à±à°°à±à°² à°•à°°à±à°¤à°µà±à°¯ à°µà°¿à°§à°¿', 3, 1),
(21, 4, 'à°µà°¾à°°à±à°¤à±à°°à°˜à±à°¨ à°¶à°¸à±à°¤à±à°°à°‚', 'à°°à°¾à°·à±à°Ÿà±à°° à°°à°•à±à°·à°£ & à°¶à°¤à±à°°à± à°¨à°¿à°°à±à°®à±‚à°²à°¨ à°®à°‚à°¤à±à°°à°‚', 4, 1);

-- Subtopics for Chapter 5 (5à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(22, 5, 'à°…à°—à±à°¨à°¿à°šà°¯à°¨ à°•à±à°°à°®à°®à±', 'à°—à°°à±à°¡ à°ªà°•à±à°·à±à°¯à°¾à°•à°¾à°° à°¯à°œà±à°žà°µà±‡à°¦à°¿à°• à°¨à°¿à°°à±à°®à°¾à°£à°‚', 1, 1),
(23, 5, 'à°‡à°·à±à°Ÿà°•à°¾ à°ªà±‚à°œà°¨à°®à±', 'à°¯à°œà±à°ž à°‡à°Ÿà±à°•à°² à°®à°‚à°¤à±à°° à°ªà±‚à°¤à°¾à°­à°¿à°®à°‚à°¤à±à°°à°£', 2, 1),
(24, 5, 'à°¶à°¤à°°à±‚à°¦à±à°°à±€à°¯ à°µà°¿à°­à°¾à°—à°‚', 'à°®à°¹à°¾ à°°à±à°¦à±à°° à°­à°—à°µà°¾à°¨à±à°¨à°¿ à°¸à°¹à°¸à±à°° à°¨à°¾à°®à°¾à°°à±à°šà°¨', 3, 1),
(25, 5, 'à°µà°¸à±‹à°°à±à°§à°¾à°° à°®à°‚à°¤à±à°°à°¾à°²à±', 'à°˜à±ƒà°¤à°§à°¾à°°à°² à°¦à±à°µà°¾à°°à°¾ à°¸à°®à°—à±à°° à°µà°¿à°¶à±à°µ à°•à°³à±à°¯à°¾à°£à°‚', 4, 1);

-- Subtopics for Chapter 6 (6à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(26, 6, 'à°…à°¶à±à°µà°®à±‡à°§ à°¸à°‚à°•à°²à±à°ªà°‚', 'à°¸à°®à±à°°à°¾à°Ÿà± à°…à°¶à±à°µà°®à±‡à°§ à°¯à°¾à°— à°¦à°¿à°µà±à°¯ à°ªà±à°°à°¾à°°à°‚à°­à°‚', 1, 1),
(27, 6, 'à°¬à±à°°à°¹à±à°®à±‹à°¦à±à°¯ à°šà°°à±à°š', 'à°µà°¿à°¶à±à°µ à°°à°¹à°¸à±à°¯à°¾à°²à± & à°ªà°°à°¬à±à°°à°¹à±à°® à°¤à°¤à±à°¤à±à°µ à°µà°¿à°šà°¾à°°à°£', 2, 1),
(28, 6, 'à°…à°µà°­à±ƒà°¥ à°¸à±à°¨à°¾à°¨ à°µà°¿à°§à°¿', 'à°¯à°¾à°—à°¾à°‚à°¤ à°ªà°µà°¿à°¤à±à°° à°®à°‚à°—à°³ à°¸à±à°¨à°¾à°¨ à°®à°¹à±‹à°¤à±à°¸à°µà°‚', 3, 1);

-- Subtopics for Chapter 7 (7à°µ à°…à°·à±à°Ÿà°®à±)
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(29, 7, 'à°¸à±Œà°¤à±à°°à°¾à°®à°£à°¿ à°¯à°¾à°—à°‚', 'à°‡à°‚à°¦à±à°°à°¿à°¯ à°ªà±à°¨à°°à±à°œà±à°œà±€à°µà°¨ & à°¬à°²à±‹à°ªà±‡à°¤ à°µà°¿à°§à°¿', 1, 1),
(30, 7, 'à°¸à±à°°à°¾à°ªà°¾à°¨ à°¨à°¿à°µà°¾à°°à°£', 'à°¶à±à°¦à±à°§à°¿ à°•à±à°°à°¤à±à°µà± & à°¸à°¤à±à°µà°—à±à°£ à°ªà±à°°à°¤à°¿à°·à±à° à°¾à°ªà°¨', 2, 1),
(31, 7, 'à°¸à°°à±à°µà°¤à±‹à°®à±à°– à°†à°¶à±€à°°à±à°µà°¾à°¦à°‚', 'à°¸à°•à°² à°²à±‹à°• à°¶à°¾à°‚à°¤à°¿ à°®à°¹à°¾ à°®à°‚à°¤à±à°°à°¾à°°à±à°ªà°£', 3, 1);

-- Subtopics for Category 2 (à°¬à±à°°à°¾à°¹à±à°®à°£à°‚) - Chapter 8
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(32, 8, 'à°¸à°¤à±à°°à°¯à°¾à°— à°µà°¿à°§à°¾à°¨à°‚', 'à°¦à±€à°°à±à°˜ à°¸à°¤à±à°°à°¯à°¾à°—à°®à±à°² à°•à°²à±à°ª à°¸à±‚à°¤à±à°°à°¾à°²à±', 1, 1),
(33, 8, 'à°¸à±‹à°®à°¯à°¾à°— à°•à±à°°à°®à°‚', 'à°¸à±‹à°®à°²à°¤ à°—à±à°°à°¹à°£ & à°°à°¸ à°¸à°‚à°—à±à°°à°¹à°£ à°ªà±à°°à°•à±à°°à°¿à°¯', 2, 1),
(34, 8, 'à°¹à°µà°¿à°°à±à°¯à°œà±à°ž à°ªà±à°°à°•à±à°°à°¿à°¯', 'à°…à°·à±à°Ÿà°¾à°¦à°¶ à°¹à°µà°¿à°¸à±à°¸à±à°² à°¶à°¾à°¸à±à°¤à±à°°à±€à°¯ à°µà°¿à°¶à±‡à°·à°¾à°²à±', 3, 1);

-- Subtopics for Category 2 (à°¬à±à°°à°¾à°¹à±à°®à°£à°‚) - Chapter 9
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(35, 9, 'à°…à°—à±à°¨à°¿à°·à±à°Ÿà±‹à°® à°¸à°®à°¾à°ªà±à°¤à°¿', 'à°ªà±à°°à°¥à°® à°¸à±‹à°®à°¸à°‚à°¸à±à°¥à°¾ à°ªà±‚à°°à±à°£à°¾à°¹à±à°¤à°¿ à°µà°¿à°¶à±‡à°·à°¾à°²à±', 1, 1),
(36, 9, 'à°‰à°•à±à°¥à±à°¯ à°•à±à°°à°¤à± à°µà°¿à°§à°¿', 'à°¸à±à°¤à±‹à°¤à±à°° à°¶à°¸à±à°¤à±à°°à°®à±à°² à°—à°¾à°¨ à°µà°¿à°¶à±‡à°·à°¾à°²à±', 2, 1),
(37, 9, 'à°·à±‹à°¡à°¶à°¿ à°ªà±à°°à°•à°°à°£à°‚', 'à°·à±‹à°¡à°¶ à°•à°³à°¾ à°¸à°‚à°ªà±‚à°°à±à°£ à°¯à°¾à°— à°®à°‚à°¤à±à°°à°¾à°²à±', 3, 1);

-- Subtopics for Category 2 (à°¬à±à°°à°¾à°¹à±à°®à°£à°‚) - Chapter 10
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(38, 10, 'à°µà°¾à°œà°ªà±‡à°¯ à°°à°¥à°¾à°°à±‹à°¹à°£à°‚', 'à°µà°¿à°œà°¯ à°°à°¥à°¾à°°à±‹à°¹à°£ à°®à°‚à°¤à±à°°à±‹à°šà±à°›à°¾à°°à°£', 1, 1),
(39, 10, 'à°¸à±à°°à°¾ à°—à±à°°à°¹ à°µà°¿à°§à°¿', 'à°µà±ˆà°¦à°¿à°• à°”à°·à°§ à°°à°¸ à°¸à±‡à°µà°¨ à°¨à°¿à°¯à°®à°¾à°²à±', 2, 1),
(40, 10, 'à°›à°¤à±à°° à°§à°¾à°°à°£ à°•à±à°°à°®à°‚', 'à°¸à°¾à°®à±à°°à°¾à°œà±à°¯ à°¶à±à°µà±‡à°¤à°šà±à°›à°¤à±à°° à°ªà°µà°¿à°¤à±à°° à°¸à±à°¥à°¾à°ªà°¨', 3, 1);

-- Subtopics for Category 2 (à°¬à±à°°à°¾à°¹à±à°®à°£à°‚) - Chapter 11
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(41, 11, 'à°¦à°°à±à°­à°¾à°­à°¿à°·à±‡à°•à°®à±', 'à°ªà°µà°¿à°¤à±à°° à°¦à°°à±à°­à°² à°ªà±à°°à°¾à°¶à°¸à±à°¤à±à°¯à°‚ & à°…à°§à°¿à°µà°¾à°¸à°¨', 1, 1),
(42, 11, 'à°¬à±à°°à°¹à±à°®à°¯à°œà±à°ž à°•à°²à±à°ªà°‚', 'à°¨à°¿à°¤à±à°¯ à°µà±‡à°¦à°¾à°§à±à°¯à°¯à°¨ & à°‹à°·à°¿ à°¤à°°à±à°ªà°£ à°µà°¿à°§à°¿', 2, 1),
(43, 11, 'à°ªà°¿à°¤à±ƒà°®à±‡à°§ à°¸à±‚à°•à±à°¤à°‚', 'à°ªà°¿à°¤à±ƒà°¦à±‡à°µà°¤à°² à°¤à°°à°£ & à°ªà±à°£à±à°¯à°²à±‹à°• à°ªà±à°°à°¾à°ªà±à°¤à°¿', 3, 1);

-- Subtopics for Category 3 (à°†à°°à±‹à°—à±à°¯à°‚) - Chapter 12
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(44, 12, 'à°¬à±à°°à°¾à°¹à±à°®à±€ à°®à±à°¹à±‚à°°à±à°¤ à°œà°¾à°—à°°à°£', 'à°¸à±‚à°°à±à°¯à±‹à°¦à°¯à°¾à°¨à°¿à°•à°¿ à°®à±à°‚à°¦à°Ÿà°¿ à°…à°®à±ƒà°¤ à°˜à°¡à°¿à°¯à°² à°†à°°à±‹à°—à±à°¯ à°°à°¹à°¸à±à°¯à°‚', 1, 1),
(45, 12, 'à°¦à°‚à°¤à°§à°¾à°µà°¨ à°ªà°¦à±à°§à°¤à±à°²à±', 'à°µà±‡à°ª, à°•à°¾à°¨à±à°— à°¤à°¦à°¿à°¤à°° à°ªà±à°°à°•à±ƒà°¤à°¿ à°¸à°¿à°¦à±à°§ à°•à°¾à°·à±à°  à°¦à°‚à°¤à°§à°¾à°µà°¨à°‚', 2, 1),
(46, 12, 'à°…à°­à±à°¯à°‚à°—à°¨ à°¸à±à°¨à°¾à°¨ à°«à°²à°¾à°²à±', 'à°¨à±à°µà±à°µà±à°² à°¨à±‚à°¨à±†à°¤à±‹ à°¤à±ˆà°²à°®à°°à±à°¦à°¨ à°†à°¯à±à°°à±à°µà±‡à°¦ à°«à°²à°¿à°¤à°¾à°²à±', 3, 1),
(47, 12, 'à°¸à°¾à°¤à±à°µà°¿à°•à°¾à°¹à°¾à°° à°¨à°¿à°¯à°®à°¾à°²à±', 'à°¶à°°à±€à°° à°ªà±à°°à°•à±ƒà°¤à°¿à°•à°¿ à°¤à°—à°¿à°¨ à°®à°¿à°¤, à°¹à°¿à°¤, à°‹à°¤ à°†à°¹à°¾à°° à°µà°¿à°§à°¿', 4, 1);

-- Subtopics for Category 3 (à°†à°°à±‹à°—à±à°¯à°‚) - Chapter 13
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(48, 13, 'à°µà°¸à°‚à°¤ à°‹à°¤à± à°µà°¿à°§à°¾à°¨à°‚', 'à°•à°« à°¶à°®à°¨à°®à± & à°µà±‡à°ª à°ªà±‚à°¤ à°†à°¹à°¾à°° à°¨à°¿à°¯à°®à°‚', 1, 1),
(49, 13, 'à°—à±à°°à±€à°·à±à°® à°‹à°¤à± à°°à°•à±à°·à°£', 'à°µà°¾à°¤ à°ªà°¿à°¤à±à°¤ à°¸à°®à°¤à±à°²à±à°¯à°¤ & à°¶à±€à°¤à°² à°ªà°¾à°¨à±€à°¯à°¾à°²à±', 2, 1),
(50, 13, 'à°µà°°à±à°· à°‹à°¤à± à°œà°¾à°—à±à°°à°¤à±à°¤à°²à±', 'à°…à°—à±à°¨à°¿à°®à°¾à°‚à°¦à±à°¯ à°¨à°¿à°µà°¾à°°à°£ & à°¶à±Šà°‚à° à°¿ à°•à°·à°¾à°¯ à°µà°¿à°§à°¿', 3, 1),
(51, 13, 'à°¹à±‡à°®à°‚à°¤ à°‹à°¤à± à°¬à°²à°‚', 'à°§à°¾à°¤à± à°ªà±à°·à±à°Ÿà°¿ & à°ªà±‹à°·à°•à°¾à°¹à°¾à°° à°¸à±‡à°•à°°à°£', 4, 1);

-- Subtopics for Category 3 (à°†à°°à±‹à°—à±à°¯à°‚) - Chapter 14
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(52, 14, 'à°¤à±à°²à°¸à±€ à°®à°¹à°¿à°®', 'à°¸à°°à±à°µ à°°à±‹à°— à°¨à°¿à°µà°¾à°°à°¿à°£à°¿ & à°ªà±à°°à°¾à°£à°µà°¾à°¯à± à°¶à±à°¦à±à°§à°¿', 1, 1),
(53, 14, 'à°…à°¶à±à°µà°—à°‚à°§ à°ªà±à°°à°¾à°¶à°¸à±à°¤à±à°¯à°‚', 'à°¶à°¾à°°à±€à°°à°• à°§à°¾à°°à±à°¢à±à°¯à°‚, à°®à°¨à°¶à±à°¶à°¾à°‚à°¤à°¿ & à°¨à°¿à°¦à±à°°à°¾ à°ªà±à°°à°¦à°¾à°¤', 2, 1),
(54, 14, 'à°¤à±à°°à°¿à°«à°² à°šà±‚à°°à±à°£ à°µà°¿à°§à°¿', 'à°¶à°°à±€à°° à°¶à±‹à°§à°¨, à°¨à±‡à°¤à±à°° à°°à°•à±à°·à°£ & à°¦à±€à°°à±à°˜à°¾à°¯à±à°µà±', 3, 1),
(55, 14, 'à°—à±à°¡à±‚à°šà±€ (à°¤à°¿à°ªà±à°ªà°¤à±€à°—)', 'à°°à±‹à°—à°¨à°¿à°°à±‹à°§à°• à°¶à°•à±à°¤à°¿ & à°œà±à°µà°°à°¹à°° à°¦à°¿à°µà±à°¯ à°®à±‚à°²à°¿à°•', 4, 1);

-- Subtopics for Category 3 (à°†à°°à±‹à°—à±à°¯à°‚) - Chapter 15
INSERT INTO subtopics (id, chapter_id, title, description, display_order, is_published) VALUES
(56, 15, 'à°¨à°¾à°¡à±€à°¶à±‹à°§à°¨ à°ªà±à°°à°¾à°£à°¾à°¯à°¾à°®à°‚', '72,000 à°¨à°¾à°¡à±à°² à°¸à°®à°—à±à°° à°¶à±à°¦à±à°§à°¿ & à°®à°¾à°¨à°¸à°¿à°• à°¸à±à°¥à±ˆà°°à±à°¯à°‚', 1, 1),
(57, 15, 'à°­à±à°°à°¾à°®à°°à±€ à°ªà±à°°à°¾à°£à°¾à°¯à°¾à°®à°‚', 'à°¤à±€à°µà±à°° à°®à°¾à°¨à°¸à°¿à°• à°’à°¤à±à°¤à°¿à°¡à°¿ & à°¨à°¿à°¦à±à°°à°²à±‡à°®à°¿ à°¨à°¿à°µà°¾à°°à°£', 2, 1),
(58, 15, 'à°¸à±‚à°°à±à°¯à°¨à°®à°¸à±à°•à°¾à°° à°•à±à°°à°®à°‚', '12 à°¦à°¿à°µà±à°¯ à°¸à±‚à°°à±à°¯ à°®à°‚à°¤à±à°°à°¾à°²à°¤à±‹ à°¶à°¾à°°à±€à°°à°• à°¯à±‹à°— à°¸à°¾à°§à°¨', 3, 1),
(59, 15, 'à°¶à°µà°¾à°¸à°¨ à°§à±à°¯à°¾à°¨ à°¸à°®à°¾à°§à°¿', 'à°ªà±‚à°°à±à°£ à°µà°¿à°¶à±à°°à°¾à°‚à°¤à°¿ & à°†à°¤à±à°® à°šà±ˆà°¤à°¨à±à°¯ à°…à°¨à±à°¸à°‚à°§à°¾à°¨à°‚', 4, 1);

-- Documents attached to Subtopics
INSERT INTO documents (id, subtopic_id, title, storage_path, original_filename, file_size, mime_type, is_published, allow_download) VALUES
(1, 1, 'à°‡à°·à±‡ à°¤à±à°µà°¾ - à°µà±‡à°¦ à°®à°‚à°¤à±à°°à°‚ & à°¤à°¾à°¤à±à°ªà°°à±à°¯à°‚', 'storage/pdfs/ishe_tva.pdf', 'ishe_tva.pdf', 145200, 'application/pdf', 1, 1),
(2, 2, 'à°†à°ª à°‰à°¨à±à°¦à°¨à±à°¤à± - à°ªà°µà°¿à°¤à±à°° à°œà°² à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/aapa_undantu.pdf', 'aapa_undantu.pdf', 132400, 'application/pdf', 1, 1),
(3, 3, 'à°¦à±‡à°µà°¸à±à°¯ à°¤à±à°µà°¾ - à°¸à°µà°¿à°¤à±ƒ à°¦à±‡à°µà°¤à°¾ à°®à°‚à°¤à±à°° à°µà°¿à°§à°¿', 'storage/pdfs/devasya_tva.pdf', 'devasya_tva.pdf', 158900, 'application/pdf', 1, 1),
(4, 4, 'à°†à°¦à°¦à±‡ - à°¹à°µà°¿à°°à± à°—à±à°°à°¹à°£ à°ªà±à°°à°•à±à°°à°¿à°¯', 'storage/pdfs/aadade.pdf', 'aadade.pdf', 121000, 'application/pdf', 1, 1),
(5, 5, 'à°¦à±‡à°µà°¾à°¸à±à°°à°¾à°ƒ - à°¦à±‡à°µà°¾à°¸à±à°° à°¸à°‚à°—à±à°°à°¾à°® à°…à°‚à°¤à°°à°¾à°°à±à°¥à°‚', 'storage/pdfs/devaasuraah.pdf', 'devaasuraah.pdf', 178500, 'application/pdf', 1, 1),
(6, 6, 'à°¸à°¨à±à°¤à±à°µà°¾ à°¸à°¿à°žà±à°šà°¾à°®à°¿ - à°¶à°¾à°‚à°¤à°¿ à°®à°‚à°¤à±à°°à°‚', 'storage/pdfs/santva_sinchaami.pdf', 'santva_sinchaami.pdf', 142100, 'application/pdf', 1, 1),
(7, 7, 'à°ªà°¾à°• à°¯à°œà±à°žà°‚ - à°µà±ˆà°¦à°¿à°• à°—à±ƒà°¹à±à°¯ à°¸à±‚à°¤à±à°°à°¾à°²à±', 'storage/pdfs/paaka_yajnam.pdf', 'paaka_yajnam.pdf', 195600, 'application/pdf', 1, 1),
(8, 8, 'à°…à°¨à±à°®à°¤à±à°¯à±ˆ - à°…à°¨à±à°®à°¤à°¿ à°¸à±‚à°•à±à°¤à°®à±', 'storage/pdfs/anumatyai.pdf', 'anumatyai.pdf', 139000, 'application/pdf', 1, 1),
(9, 9, 'à°…à°—à±à°¨à°¿à°®à±€à°³à±‡ - à°‹à°—à±à°µà±‡à°¦ à°ªà±à°°à°¾à°°à°‚à°­ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/agnimile.pdf', 'agnimile.pdf', 148200, 'application/pdf', 1, 1),
(10, 10, 'à°µà°¾à°¯à± à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/vayu_suktam.pdf', 'vayu_suktam.pdf', 138000, 'application/pdf', 1, 1),
(11, 11, 'à°‡à°‚à°¦à±à°°à°µà°¾à°¯à± à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/indravayu_suktam.pdf', 'indravayu_suktam.pdf', 141000, 'application/pdf', 1, 1),
(12, 12, 'à°®à°¿à°¤à±à°°à°¾à°µà°°à±à°£ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/mitravaruna_suktam.pdf', 'mitravaruna_suktam.pdf', 152000, 'application/pdf', 1, 1),
(13, 13, 'à°…à°¶à±à°µà°¿à°¨à±€ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/ashvina_suktam.pdf', 'ashvina_suktam.pdf', 134000, 'application/pdf', 1, 1),
(14, 14, 'à°ªà±à°°à°¾à°œà°¾à°ªà°¤à±à°¯ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/prajapatya_suktam.pdf', 'prajapatya_suktam.pdf', 146000, 'application/pdf', 1, 1),
(15, 15, 'à°¸à±Œà°®à±à°¯ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/saumya_suktam.pdf', 'saumya_suktam.pdf', 139000, 'application/pdf', 1, 1),
(16, 16, 'à°µà±ˆà°¶à±à°µà°¦à±‡à°µ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/vaishvadeva_suktam.pdf', 'vaishvadeva_suktam.pdf', 155000, 'application/pdf', 1, 1),
(17, 17, 'à°¸à°°à°¸à±à°µà°¤à±€ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/sarasvati_suktam.pdf', 'sarasvati_suktam.pdf', 162000, 'application/pdf', 1, 1),
(18, 18, 'à°°à°¾à°œà°¸à±‚à°¯ à°µà°¿à°§à°¿ à°—à±à°°à°‚à°¥à°‚', 'storage/pdfs/rajasuya_vidhi.pdf', 'rajasuya_vidhi.pdf', 170000, 'application/pdf', 1, 1),
(19, 19, 'à°¦à°¿à°—à±à°µà°¿à°œà°¯ à°ªà±à°°à°¾à°°à±à°¥à°¨ à°ªà°¤à±à°°à°‚', 'storage/pdfs/digvijaya_prarthana.pdf', 'digvijaya_prarthana.pdf', 140000, 'application/pdf', 1, 1),
(20, 20, 'à°°à°¤à±à°¨à°¿ à°¹à°µà°¿à°¸à±à°¸à±à°² à°µà°¿à°µà°°à°£', 'storage/pdfs/ratni_havis.pdf', 'ratni_havis.pdf', 148000, 'application/pdf', 1, 1),
(21, 21, 'à°µà°¾à°°à±à°¤à±à°°à°˜à±à°¨ à°¶à°¸à±à°¤à±à°°à°‚', 'storage/pdfs/vartraghna_shastram.pdf', 'vartraghna_shastram.pdf', 152000, 'application/pdf', 1, 1),
(22, 22, 'à°…à°—à±à°¨à°¿à°šà°¯à°¨ à°•à±à°°à°®à°®à±', 'storage/pdfs/agnichayana_kramam.pdf', 'agnichayana_kramam.pdf', 185000, 'application/pdf', 1, 1),
(23, 23, 'à°‡à°·à±à°Ÿà°•à°¾ à°ªà±‚à°œà°¨à°®à±', 'storage/pdfs/ishtaka_pujanam.pdf', 'ishtaka_pujanam.pdf', 143000, 'application/pdf', 1, 1),
(24, 24, 'à°¶à°¤à°°à±‚à°¦à±à°°à±€à°¯ à°µà°¿à°­à°¾à°—à°‚', 'storage/pdfs/shatarudriya_vibhagam.pdf', 'shatarudriya_vibhagam.pdf', 198000, 'application/pdf', 1, 1),
(25, 25, 'à°µà°¸à±‹à°°à±à°§à°¾à°° à°®à°‚à°¤à±à°°à°¾à°²à±', 'storage/pdfs/vasordhara_mantralu.pdf', 'vasordhara_mantralu.pdf', 165000, 'application/pdf', 1, 1),
(26, 26, 'à°…à°¶à±à°µà°®à±‡à°§ à°¸à°‚à°•à°²à±à°ªà°‚', 'storage/pdfs/ashvamedha_sankalpam.pdf', 'ashvamedha_sankalpam.pdf', 180000, 'application/pdf', 1, 1),
(27, 27, 'à°¬à±à°°à°¹à±à°®à±‹à°¦à±à°¯ à°šà°°à±à°š', 'storage/pdfs/brahmodya_charcha.pdf', 'brahmodya_charcha.pdf', 162000, 'application/pdf', 1, 1),
(28, 28, 'à°…à°µà°­à±ƒà°¥ à°¸à±à°¨à°¾à°¨ à°µà°¿à°§à°¿', 'storage/pdfs/avabhritha_snana.pdf', 'avabhritha_snana.pdf', 154000, 'application/pdf', 1, 1),
(29, 29, 'à°¸à±Œà°¤à±à°°à°¾à°®à°£à°¿ à°¯à°¾à°— à°µà°¿à°§à°¿', 'storage/pdfs/sautramani_yagam.pdf', 'sautramani_yagam.pdf', 168000, 'application/pdf', 1, 1),
(30, 30, 'à°¶à±à°¦à±à°§à°¿ à°•à±à°°à°¤à±à°µà±', 'storage/pdfs/shuddhi_kratuvu.pdf', 'shuddhi_kratuvu.pdf', 142000, 'application/pdf', 1, 1),
(31, 31, 'à°¸à°°à±à°µà°¤à±‹à°®à±à°– à°¶à°¾à°‚à°¤à°¿ à°®à°‚à°¤à±à°°à°¾à°²à±', 'storage/pdfs/shanti_mantralu.pdf', 'shanti_mantralu.pdf', 159000, 'application/pdf', 1, 1),
(32, 32, 'à°¸à°¤à±à°°à°¯à°¾à°— à°µà°¿à°§à°¿', 'storage/pdfs/satrayaga_vidhi.pdf', 'satrayaga_vidhi.pdf', 175000, 'application/pdf', 1, 1),
(33, 33, 'à°¸à±‹à°®à°¯à°¾à°— à°ªà±à°°à°•à±à°°à°¿à°¯', 'storage/pdfs/somayaga_prakriya.pdf', 'somayaga_prakriya.pdf', 164000, 'application/pdf', 1, 1),
(34, 34, 'à°¹à°µà°¿à°°à±à°¯à°œà±à°ž à°¶à°¾à°¸à±à°¤à±à°°à°‚', 'storage/pdfs/haviryajna_shastram.pdf', 'haviryajna_shastram.pdf', 172000, 'application/pdf', 1, 1),
(35, 35, 'à°…à°—à±à°¨à°¿à°·à±à°Ÿà±‹à°® à°ªà±‚à°°à±à°£à°¾à°¹à±à°¤à°¿', 'storage/pdfs/agnishtoma_purnahuti.pdf', 'agnishtoma_purnahuti.pdf', 158000, 'application/pdf', 1, 1),
(36, 36, 'à°‰à°•à±à°¥à±à°¯ à°•à±à°°à°¤à± à°—à°¾à°¨à°‚', 'storage/pdfs/ukthya_kratu.pdf', 'ukthya_kratu.pdf', 149000, 'application/pdf', 1, 1),
(37, 37, 'à°·à±‹à°¡à°¶à°¿ à°ªà±à°°à°•à°°à°£à°‚', 'storage/pdfs/shodashi_prakaranam.pdf', 'shodashi_prakaranam.pdf', 160000, 'application/pdf', 1, 1),
(38, 38, 'à°µà°¾à°œà°ªà±‡à°¯ à°°à°¥à°¾à°°à±‹à°¹à°£ à°®à°‚à°¤à±à°°à°‚', 'storage/pdfs/vajapeya_ratha.pdf', 'vajapeya_ratha.pdf', 155000, 'application/pdf', 1, 1),
(39, 39, 'à°¸à±à°°à°¾ à°—à±à°°à°¹ à°¨à°¿à°¯à°®à°¾à°²à±', 'storage/pdfs/sura_graha.pdf', 'sura_graha.pdf', 147000, 'application/pdf', 1, 1),
(40, 40, 'à°›à°¤à±à°° à°§à°¾à°°à°£ à°•à±à°°à°®à°‚', 'storage/pdfs/chhatra_dharana.pdf', 'chhatra_dharana.pdf', 151000, 'application/pdf', 1, 1),
(41, 41, 'à°¦à°°à±à°­à°¾à°­à°¿à°·à±‡à°• à°®à°¹à°¾ à°ªà±à°°à°¾à°¶à°¸à±à°¤à±à°¯à°‚', 'storage/pdfs/darbhabhishekam.pdf', 'darbhabhishekam.pdf', 144000, 'application/pdf', 1, 1),
(42, 42, 'à°¬à±à°°à°¹à±à°®à°¯à°œà±à°ž à°•à°²à±à°ªà°‚', 'storage/pdfs/brahmayajna_kalpam.pdf', 'brahmayajna_kalpam.pdf', 167000, 'application/pdf', 1, 1),
(43, 43, 'à°ªà°¿à°¤à±ƒà°®à±‡à°§ à°¸à±‚à°•à±à°¤à°‚', 'storage/pdfs/pitrimedha_suktam.pdf', 'pitrimedha_suktam.pdf', 158000, 'application/pdf', 1, 1),
(44, 44, 'à°¬à±à°°à°¾à°¹à±à°®à±€ à°®à±à°¹à±‚à°°à±à°¤à°‚ - à°†à°¯à±à°°à±à°µà±‡à°¦ à°œà±€à°µà°¨à°¶à±ˆà°²à°¿ à°®à°¾à°°à±à°—à°¦à°°à±à°¶à°¿à°¨à°¿', 'storage/pdfs/brahmi_muhurtam.pdf', 'brahmi_muhurtam.pdf', 165400, 'application/pdf', 1, 1),
(45, 45, 'à°¦à°‚à°¤à°§à°¾à°µà°¨ à°µà°¿à°§à°¿', 'storage/pdfs/dantadhawana_vidhi.pdf', 'dantadhawana_vidhi.pdf', 138000, 'application/pdf', 1, 1),
(46, 46, 'à°…à°­à±à°¯à°‚à°—à°¨ à°¸à±à°¨à°¾à°¨ à°µà°¿à°§à°¾à°¨à°‚', 'storage/pdfs/abhyangana_snanam.pdf', 'abhyangana_snanam.pdf', 152000, 'application/pdf', 1, 1),
(47, 47, 'à°¸à°¾à°¤à±à°µà°¿à°•à°¾à°¹à°¾à°° à°¸à±‚à°¤à±à°°à°¾à°²à±', 'storage/pdfs/satvikahara_sutralu.pdf', 'satvikahara_sutralu.pdf', 160000, 'application/pdf', 1, 1),
(48, 48, 'à°µà°¸à°‚à°¤ à°‹à°¤à± à°œà±€à°µà°¨ à°µà°¿à°§à°¾à°¨à°‚', 'storage/pdfs/vasanta_ritucharya.pdf', 'vasanta_ritucharya.pdf', 145000, 'application/pdf', 1, 1),
(49, 49, 'à°—à±à°°à±€à°·à±à°® à°‹à°¤à± à°¸à°‚à°°à°•à±à°·à°£ à°®à°¾à°°à±à°—à°¦à°°à±à°¶à°¿à°¨à°¿', 'storage/pdfs/grishma_ritucharya.pdf', 'grishma_ritucharya.pdf', 149000, 'application/pdf', 1, 1),
(50, 50, 'à°µà°°à±à°· à°‹à°¤à± à°†à°°à±‹à°—à±à°¯ à°œà°¾à°—à±à°°à°¤à±à°¤à°²à±', 'storage/pdfs/varsha_ritucharya.pdf', 'varsha_ritucharya.pdf', 153000, 'application/pdf', 1, 1),
(51, 51, 'à°¹à±‡à°®à°‚à°¤ à°‹à°¤à± à°¬à°²à±‹à°ªà±‡à°¤à°‚', 'storage/pdfs/hemanta_ritucharya.pdf', 'hemanta_ritucharya.pdf', 147000, 'application/pdf', 1, 1),
(52, 52, 'à°¤à±à°²à°¸à±€ à°¦à°¿à°µà±à°¯ à°”à°·à°§ à°—à±à°£à°¾à°²à±', 'storage/pdfs/tulasi_mahimah.pdf', 'tulasi_mahimah.pdf', 168000, 'application/pdf', 1, 1),
(53, 53, 'à°…à°¶à±à°µà°—à°‚à°§ à°ªà±à°°à°¾à°¶à°¸à±à°¤à±à°¯à°‚ & à°ªà±à°°à°¯à±‹à°œà°¨à°¾à°²à±', 'storage/pdfs/ashwagandha_prashastyam.pdf', 'ashwagandha_prashastyam.pdf', 174000, 'application/pdf', 1, 1),
(54, 54, 'à°¤à±à°°à°¿à°«à°² à°šà±‚à°°à±à°£ à°µà°¿à°§à°¿ & à°‰à°ªà°¯à±‹à°—à°¾à°²à±', 'storage/pdfs/triphala_churnam.pdf', 'triphala_churnam.pdf', 162000, 'application/pdf', 1, 1),
(55, 55, 'à°—à±à°¡à±‚à°šà±€ (à°¤à°¿à°ªà±à°ªà°¤à±€à°—) à°¸à°‚à°œà±€à°µà°¨à°¿', 'storage/pdfs/guduchi_sanjeevani.pdf', 'guduchi_sanjeevani.pdf', 159000, 'application/pdf', 1, 1),
(56, 56, 'à°¨à°¾à°¡à±€à°¶à±‹à°§à°¨ à°ªà±à°°à°¾à°£à°¾à°¯à°¾à°® à°¸à°¾à°§à°¨', 'storage/pdfs/nadishodhana_pranayama.pdf', 'nadishodhana_pranayama.pdf', 182000, 'application/pdf', 1, 1),
(57, 57, 'à°­à±à°°à°¾à°®à°°à±€ à°ªà±à°°à°¾à°£à°¾à°¯à°¾à°® à°µà°¿à°§à°¾à°¨à°‚', 'storage/pdfs/bhramari_pranayama.pdf', 'bhramari_pranayama.pdf', 166000, 'application/pdf', 1, 1),
(58, 58, 'à°¸à±‚à°°à±à°¯à°¨à°®à°¸à±à°•à°¾à°° à°¸à°®à°—à±à°° à°ªà°¦à±à°§à°¤à°¿', 'storage/pdfs/suryanamaskara_samagram.pdf', 'suryanamaskara_samagram.pdf', 195000, 'application/pdf', 1, 1),
(59, 59, 'à°¶à°µà°¾à°¸à°¨ à°§à±à°¯à°¾à°¨ à°°à°¹à°¸à±à°¯à°‚', 'storage/pdfs/shavasana_dhyanam.pdf', 'shavasana_dhyanam.pdf', 156000, 'application/pdf', 1, 1);
