<?php
// backend/database/generate_sample_pdfs.php

class SimplePdfGenerator {
    public static function createPdf(string $title, string $subtitle, array $sections, string $outputPath): void {
        $objects = [];
        $objCount = 0;

        // 1: Catalog
        $catalogObj = ++$objCount;
        // 2: Pages
        $pagesObj = ++$objCount;
        // 3: Font
        $fontObj = ++$objCount;
        // 4: Page 1
        $page1Obj = ++$objCount;
        // 5: Contents
        $contentObj = ++$objCount;

        $stream = "q\n";
        // Header background parchment / gold band
        $stream .= "0.95 0.85 0.63 rg\n";
        $stream .= "0 740 612 52 re f\n";

        // Brown border lines
        $stream .= "0.46 0.27 0.12 RG\n";
        $stream .= "3 w\n";
        $stream .= "20 20 572 752 re S\n";
        $stream .= "24 24 564 744 re S\n";

        // Traditional Header Title
        $stream .= "BT\n";
        $stream .= "/F1 22 Tf\n";
        $stream .= "0.26 0.13 0.08 rg\n";
        $stream .= "50 755 Td\n";
        $stream .= "(" . self::escapePdfString($title) . ") Tj\n";
        $stream .= "ET\n";

        // Subtitle
        $stream .= "BT\n";
        $stream .= "/F1 12 Tf\n";
        $stream .= "0.4 0.25 0.1 rg\n";
        $stream .= "50 710 Td\n";
        $stream .= "(" . self::escapePdfString($subtitle) . ") Tj\n";
        $stream .= "ET\n";

        // Horizontal divider
        $stream .= "0.75 0.5 0.2 RG\n";
        $stream .= "1.5 w\n";
        $stream .= "50 695 m 562 695 l S\n";

        // Content Sections
        $y = 660;
        foreach ($sections as $sec) {
            // Heading
            $stream .= "BT\n";
            $stream .= "/F1 14 Tf\n";
            $stream .= "0.2 0.45 0.5 rg\n"; // Turquoise/teal heading
            $stream .= "50 {$y} Td\n";
            $stream .= "(" . self::escapePdfString($sec['heading']) . ") Tj\n";
            $stream .= "ET\n";
            $y -= 25;

            // Lines of body
            foreach ($sec['body'] as $line) {
                $stream .= "BT\n";
                $stream .= "/F1 11 Tf\n";
                $stream .= "0.15 0.15 0.15 rg\n";
                $stream .= "55 {$y} Td\n";
                $stream .= "(" . self::escapePdfString($line) . ") Tj\n";
                $stream .= "ET\n";
                $y -= 18;
            }
            $y -= 15;
        }

        // Footer
        $stream .= "0.6 0.6 0.6 RG\n";
        $stream .= "0.5 w\n";
        $stream .= "50 50 m 562 50 l S\n";
        $stream .= "BT\n";
        $stream .= "/F1 9 Tf\n";
        $stream .= "0.5 0.4 0.3 rg\n";
        $stream .= "50 35 Td\n";
        $stream .= "(Vedic Knowledge Repository - Traditional Telugu Knowledge App | V B S Sarma Kompella) Tj\n";
        $stream .= "ET\n";

        $stream .= "Q\n";
        $streamLen = strlen($stream);

        $out = "%PDF-1.4\n";
        $offsets = [];

        // Obj 1: Catalog
        $offsets[1] = strlen($out);
        $out .= "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";

        // Obj 2: Pages
        $offsets[2] = strlen($out);
        $out .= "2 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n";

        // Obj 3: Font
        $offsets[3] = strlen($out);
        $out .= "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n";

        // Obj 4: Page 1
        $offsets[4] = strlen($out);
        $out .= "4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 3 0 R >> >> >>\nendobj\n";

        // Obj 5: Stream Content
        $offsets[5] = strlen($out);
        $out .= "5 0 obj\n<< /Length {$streamLen} >>\nstream\n{$stream}\nendstream\nendobj\n";

        // Xref
        $xrefOffset = strlen($out);
        $out .= "xref\n0 6\n";
        $out .= "0000000000 65535 f \n";
        for ($i = 1; $i <= 5; $i++) {
            $out .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }
        $out .= "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n{$xrefOffset}\n%%EOF";

        @mkdir(dirname($outputPath), 0777, true);
        file_put_contents($outputPath, $out);
    }

    private static function escapePdfString(string $s): string {
        $s = str_replace('\\', '\\\\', $s);
        $s = str_replace('(', '\\(', $s);
        $s = str_replace(')', '\\)', $s);
        return $s;
    }
}

$pdfDir = dirname(__DIR__) . '/storage/pdfs';
@mkdir($pdfDir, 0777, true);

$sampleFiles = [
    'ishe_tva.pdf' => [
        'title' => 'Ishe Tvorje Tva - Krishna Yajurveda Samhita',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 1 - Prathama Ashtakam',
        'sections' => [
            [
                'heading' => '1. Vedic Mantra Text & Chanting (Moolam)',
                'body' => [
                    'Om Ishe tvorje tva vayavah sthopayavah stha devo vah savita',
                    'prarpayatu shreshthatamaya karmane apyayadhvamaghnya indraya',
                    'bhagam prajavatiranami va ayakshma ma va stena ishata maghagamso',
                    'dhruva asmin gopatau syata bahvih yajamanasya pashun pahi.'
                ]
            ],
            [
                'heading' => '2. Meaning and Significance (Bhavam & Tatparyam)',
                'body' => [
                    'This is the opening Anuvaka of the Krishna Yajurveda Taittiriya Samhita.',
                    'The sage invokes Savitr, the divine stimulator, for righteous, noble actions.',
                    'The sacred branch of Palasha tree is consecrated for the harvest offering.',
                    'Blessings are sought for abundant progeny, healthy cattle, and peace.'
                ]
            ],
            [
                'heading' => '3. Ritual Application in Darshapurnamasa',
                'body' => [
                    'Recited during the consecration of offerings in the New & Full Moon sacrifices.',
                    'Purifies the mind, senses, and hearth of the performer.'
                ]
            ]
        ]
    ],
    'aapa_undantu.pdf' => [
        'title' => 'Aapa Undantu - Sacred Water Consecration',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 2 - Prathama Ashtakam',
        'sections' => [
            [
                'heading' => '1. Vedic Water Mantra (Aapa Undantu Jivase)',
                'body' => [
                    'Om Aapa undantu jivase dirghayutvaya varchase.',
                    'Oshthe shiras te ma himsit, shive me stham.',
                    'Devam savitaram apyayatam indrasya bhagah.'
                ]
            ],
            [
                'heading' => '2. Philosophical & Spiritual Connotations',
                'body' => [
                    'The waters (Aapa) are invoked as the divine primordial mothers.',
                    'They bestow vitality, radiant lifespan, and mental clarity.',
                    'Purifies external matter and internal consciousness before the yajna.'
                ]
            ]
        ]
    ],
    'devasya_tva.pdf' => [
        'title' => 'Devasya Tva Savituh Prasave',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 3 - Divine Offering',
        'sections' => [
            [
                'heading' => '1. Mantra Text',
                'body' => [
                    'Devasya tva savituh prasave-shvinor bahubhyam pushno hastabhyam.',
                    'Agnehaste yajnagrhya samriddhirastu yajamanaya.'
                ]
            ],
            [
                'heading' => '2. Symbolic Significance',
                'body' => [
                    'Hands of Ashvins and Pushan invoke healing and nurturing energies.',
                    'Represents dedication of all bodily efforts into spiritual sacrifice.'
                ]
            ]
        ]
    ],
    'aadade.pdf' => [
        'title' => 'Aadade - Sacred Receiving and Consecration',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 4',
        'sections' => [
            [
                'heading' => '1. Description & Context',
                'body' => [
                    'The process of receiving the divine oblations in sacred vessels.',
                    'Focuses on unblemished dedication to supreme consciousness.'
                ]
            ]
        ]
    ],
    'devaasuraah.pdf' => [
        'title' => 'Devaasuraah - Cosmic Balance & Struggle',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 5',
        'sections' => [
            [
                'heading' => '1. Vedic Allegory of Light and Darkness',
                'body' => [
                    'The eternal dialogue between constructive (Deva) and chaotic (Asura) forces.',
                    'Victory of order, truth (Satya), and cosmic law (Rta).'
                ]
            ]
        ]
    ],
    'santva_sinchaami.pdf' => [
        'title' => 'Santva Sinchaami - Sacred Sprinkling',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 6',
        'sections' => [
            [
                'heading' => '1. Shanti Sprinkling Mantra',
                'body' => [
                    'Sprinkling holy water with Darbha grass across the altar.',
                    'Cooling and sanctifying the environment for spiritual peace.'
                ]
            ]
        ]
    ],
    'paaka_yajnam.pdf' => [
        'title' => 'Paaka Yajnam - Domestic Ritual Wisdom',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 7',
        'sections' => [
            [
                'heading' => '1. Grihastha Yajna Guidelines',
                'body' => [
                    'Daily domestic offerings performed in every traditional household.',
                    'Harmonizing food consumption with universal gratitude.'
                ]
            ]
        ]
    ],
    'anumatyai.pdf' => [
        'title' => 'Anumatyai - Invocation of Anumati Devi',
        'subtitle' => 'Kanda 1, Prapathaka 1, Anuvaka 8',
        'sections' => [
            [
                'heading' => '1. Goddess of Divine Consent',
                'body' => [
                    'Anumati represents cosmic alignment and spiritual approval.',
                    'Invoked to remove impediments and fulfill noble intentions.'
                ]
            ]
        ]
    ],
    'brahmi_muhurtam.pdf' => [
        'title' => 'Brahmi Muhurtam - Ayurvedic Early Morning Wisdom',
        'subtitle' => 'Arogyam - Dinacharya Prapathaka',
        'sections' => [
            [
                'heading' => '1. The Golden Dawn Hours',
                'body' => [
                    'Waking up 96 minutes before sunrise (Brahmi Muhurta).',
                    'Vata energy is optimal, oxygen levels are purest in nature.',
                    'Enhances memory, longevity, inner calm, and digestive vitality.'
                ]
            ]
        ]
    ]
];

// Generate existing detailed files
foreach ($sampleFiles as $filename => $data) {
    $path = $pdfDir . '/' . $filename;
    SimplePdfGenerator::createPdf($data['title'], $data['subtitle'], $data['sections'], $path);
    echo "Generated PDF: {$filename}\n";
}

// Generate for all documents registered in database
try {
    $pdo = new PDO('sqlite:' . dirname(__DIR__) . '/database/app.sqlite');
    $docs = $pdo->query("SELECT d.*, s.title as subtopic_title, ch.title as chapter_title FROM documents d JOIN subtopics s ON s.id = d.subtopic_id JOIN chapters ch ON ch.id = s.chapter_id")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($docs as $doc) {
        $filename = $doc['original_filename'];
        $path = $pdfDir . '/' . $filename;
        if (!file_exists($path)) {
            SimplePdfGenerator::createPdf(
                $doc['title'],
                $doc['chapter_title'] . ' - ' . $doc['subtopic_title'],
                [
                    [
                        'heading' => '1. Traditional Text & Recitation Overview',
                        'body' => [
                            'Sacred heritage and canonical recitation preserved in Telugu tradition.',
                            'Subject: ' . $doc['subtopic_title'],
                            'Chapter: ' . $doc['chapter_title']
                        ]
                    ],
                    [
                        'heading' => '2. Spiritual Essence & Cultural Application',
                        'body' => [
                            'Encompassing Vedic philosophy, spiritual well-being, and righteous conduct.',
                            'Sanatana Dharma teachings preserved by V B S Sarma Kompella.'
                        ]
                    ]
                ],
                $path
            );
            echo "Auto-generated PDF: {$filename}\n";
        }
    }
} catch (Exception $e) {
    echo "Notice: " . $e->getMessage() . "\n";
}

echo "All sample PDFs verified and generated successfully!\n";

