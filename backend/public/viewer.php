<?php
// backend/public/viewer.php - Self-contained high-performance PDF Viewer (No Node.js needed)
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/Database.php';

$docId = isset($_GET['id']) ? intval($_GET['id']) : 1;
$db = Database::getConnection();

$stmt = $db->prepare("SELECT d.*, s.title as subtopic_title, ch.title as chapter_title FROM documents d 
    LEFT JOIN subtopics s ON s.id = d.subtopic_id 
    LEFT JOIN chapters ch ON ch.id = s.chapter_id 
    WHERE d.id = ?");
$stmt->execute([$docId]);
$doc = $stmt->fetch();

$title = $doc ? ($doc['subtopic_title'] ?? $doc['title']) : 'వేద గ్రంథం';
$chapter = $doc ? ($doc['chapter_title'] ?? '') : '';
$streamUrl = "/api/documents/{$docId}/stream";
?>
<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=4.0, user-scalable=yes">
  <title><?= htmlspecialchars($title) ?> - PDF వీక్షణి</title>
  <script src="/js/pdf.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
      background-color: #1A0D05;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Telugu", sans-serif;
      overflow-x: hidden;
      color: #FFF5D0;
    }
    #top-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: linear-gradient(to right, #4E270A, #2B150A);
      border-bottom: 2px solid #75451F;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    }
    .doc-meta {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 8px;
    }
    .doc-title {
      font-size: 13px;
      font-weight: bold;
      color: #FFF5D0;
      line-height: 1.2;
    }
    .doc-chapter {
      font-size: 10px;
      color: #E7C65A;
      opacity: 0.9;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn {
      background: #3D2010;
      color: #FFE58F;
      border: 1px solid #75451F;
      border-radius: 6px;
      padding: 5px 9px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: all 0.15s ease;
      touch-action: manipulation;
    }
    .btn:active {
      transform: scale(0.95);
      background: #5A2F0F;
    }
    .btn-download {
      background: #168FA8;
      border-color: #084350;
      color: #FFFFFF;
    }
    #viewport {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 8px 48px 8px;
      min-height: calc(100vh - 55px);
    }
    .page-wrapper {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 100%;
    }
    .page-badge {
      font-size: 11px;
      color: #D2AC82;
      margin-bottom: 6px;
      background: rgba(0,0,0,0.4);
      padding: 2px 10px;
      border-radius: 10px;
      border: 1px solid #4A2810;
    }
    canvas {
      max-width: 100%;
      height: auto !important;
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.7);
      background: #FFFDF5;
    }
    #loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 16px;
      text-align: center;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(231, 198, 90, 0.2);
      border-top-color: #E7C65A;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    #error-state {
      display: none;
      background: #3D1C08;
      border: 1px solid #75451F;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      max-width: 400px;
      margin: 40px auto;
    }
    #error-state a {
      color: #FFE58F;
      text-decoration: underline;
      display: inline-block;
      margin-top: 12px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div id="top-bar">
    <div class="doc-meta">
      <div class="doc-title"><?= htmlspecialchars($title) ?></div>
      <?php if (!empty($chapter)): ?>
        <div class="doc-chapter"><?= htmlspecialchars($chapter) ?></div>
      <?php endif; ?>
    </div>
    <div class="controls">
      <button class="btn" onclick="zoom(-0.2)" title="Zoom Out">−</button>
      <button class="btn" onclick="resetZoom()" id="zoom-label">100%</button>
      <button class="btn" onclick="zoom(0.2)" title="Zoom In">+</button>
      <a href="<?= $streamUrl ?>?download=1" class="btn btn-download" title="డౌన్‌లోడ్">⬇</a>
    </div>
  </div>

  <div id="viewport">
    <div id="loading-state">
      <div class="spinner"></div>
      <div>దస్త్రం తెరవబడుతోంది... (Loading PDF)</div>
    </div>

    <div id="error-state">
      <p style="color:#FFA39E;font-size:13px;line-height:1.5;">
        PDF నేరుగా తెరవడంలో ఆలస్యం జరుగుతోంది. దయచేసి క్రింది లింక్ ద్వారా డౌన్‌లోడ్ చేసుకోండి:
      </p>
      <a href="<?= $streamUrl ?>?download=1" class="btn btn-download" style="margin-top:14px;">
        ⬇️ PDF ను డౌన్‌లోడ్ చేయండి
      </a>
    </div>

    <div id="pdf-container"></div>
  </div>

  <script>
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
    }

    let currentPdf = null;
    let baseScale = (window.innerWidth < 600) ? 1.3 : 1.6;
    let currentScale = baseScale;

    function renderPages() {
      if (!currentPdf) return;
      const container = document.getElementById('pdf-container');
      container.innerHTML = '';

      for (let pageNum = 1; pageNum <= currentPdf.numPages; pageNum++) {
        currentPdf.getPage(pageNum).then(function(page) {
          const wrapper = document.createElement('div');
          wrapper.className = 'page-wrapper';

          if (currentPdf.numPages > 1) {
            const badge = document.createElement('div');
            badge.className = 'page-badge';
            badge.innerText = 'పుట ' + pageNum + ' / ' + currentPdf.numPages;
            wrapper.appendChild(badge);
          }

          const viewport = page.getViewport({ scale: currentScale });
          const canvas = document.createElement('canvas');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          };

          page.render(renderContext);
          wrapper.appendChild(canvas);
          container.appendChild(wrapper);
        });
      }
    }

    function zoom(delta) {
      currentScale = Math.max(0.8, Math.min(currentScale + delta, 3.5));
      const pct = Math.round((currentScale / baseScale) * 100);
      document.getElementById('zoom-label').innerText = pct + '%';
      renderPages();
    }

    function resetZoom() {
      currentScale = baseScale;
      document.getElementById('zoom-label').innerText = '100%';
      renderPages();
    }

    // Load PDF
    const loadingTask = pdfjsLib.getDocument('<?= $streamUrl ?>');
    loadingTask.promise.then(function(pdf) {
      currentPdf = pdf;
      document.getElementById('loading-state').style.display = 'none';
      renderPages();
    }).catch(function(err) {
      console.error('PDF error:', err);
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('error-state').style.display = 'block';
    });
  </script>
</body>
</html>
