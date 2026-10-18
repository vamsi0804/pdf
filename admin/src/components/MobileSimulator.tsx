// admin/src/components/MobileSimulator.tsx
import React, { useState, useEffect } from 'react';
import { Category, Chapter, Subtopic, AppSettings } from '../types';
import { api } from '../services/api';
import { ChevronDown, FileText, ArrowLeft, RefreshCw, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface MobileSimulatorProps {
  categories: Category[];
  activeCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  settings: AppSettings;
  refreshTrigger: number;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  settings,
  refreshTrigger
}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Load chapters when category changes
  useEffect(() => {
    if (!activeCategoryId) return;
    setLoading(true);
    api.getChapters(activeCategoryId, false)
      .then(data => {
        setChapters(data);
        if (data.length > 0) {
          // If previous chapter still exists in new category, keep it; otherwise select first
          const exists = data.find(c => c.id === activeChapterId);
          if (!exists) {
            setActiveChapterId(data[0].id);
          }
        } else {
          setActiveChapterId(null);
          setSubtopics([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategoryId, refreshTrigger]);

  // Load subtopics when chapter changes
  useEffect(() => {
    if (!activeChapterId) {
      setSubtopics([]);
      return;
    }
    api.getSubtopics(activeChapterId, false)
      .then(data => {
        setSubtopics(data);
      })
      .catch(console.error);
  }, [activeChapterId, refreshTrigger]);

  const handleSubtopicClick = (sub: Subtopic) => {
    setActiveSubtopic(sub);
    setPdfModalOpen(true);
  };

  const bgImage = settings.background_image || '/assets/backgrounds/traditional_bg.jpg';

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
      <div className="w-[360px] h-[740px] bg-[#120803] rounded-[42px] p-3 shadow-2xl border-4 border-[#3D2010] relative flex flex-col overflow-hidden">
        
        {/* Device Speaker & Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#0a0502] rounded-full z-30 flex items-center justify-center">
          <div className="w-10 h-1 bg-[#1a0e06] rounded-full mr-2"></div>
          <div className="w-2.5 h-2.5 bg-[#1f1007] rounded-full"></div>
        </div>

        {/* Screen Container */}
        <div className="w-full h-full rounded-[32px] overflow-hidden relative flex flex-col bg-[#F3D9A0] select-none text-[#FFF5D0]">
          
          {/* Background Illustration & Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
            style={{ 
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Subtle warm devotional gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3A1E0B]/35 via-transparent to-[#2B150A]/70 pointer-events-none" />

          {/* Status Bar */}
          <div className="relative z-20 h-7 px-4 pt-1 flex justify-between items-center text-[10px] font-semibold text-[#FFE799] drop-shadow">
            <span>12:07</span>
            <div className="flex items-center space-x-1.5 text-[9px]">
              <span>3.00 KB/s</span>
              <span>5G</span>
              <span>32%</span>
            </div>
          </div>

          {/* LEVEL 1: Three Main Wooden Signboard Buttons with Increased Top Margin */}
          <div className="relative z-20 px-3 pt-3 pb-3">
            <div className="grid grid-cols-3 gap-1.5">
              {categories.slice(0, 3).map((cat) => {
                const isSelected = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`relative group px-1 py-1.5 rounded transition-transform active:scale-95 flex flex-col items-center justify-center min-h-[46px] ${
                      isSelected
                        ? 'ring-2 ring-[#FFE58F] shadow-lg shadow-[#000]/60'
                        : 'opacity-95 hover:opacity-100'
                    }`}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(180deg, #9C5D26 0%, #75451F 50%, #4D2B12 100%)'
                        : 'linear-gradient(180deg, #7C471D 0%, #5D3313 50%, #3F200A 100%)',
                      border: '2px solid #2B150A',
                      borderRadius: '4px',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,235,175,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)'
                    }}
                  >
                    {/* Signboard Top Pegs */}
                    <div className="absolute -top-1.5 left-2 w-1.5 h-2 bg-[#2B150A] rounded-t-sm" />
                    <div className="absolute -top-1.5 right-2 w-1.5 h-2 bg-[#2B150A] rounded-t-sm" />
                    
                    {/* Signboard Bottom Pegs */}
                    <div className="absolute -bottom-1.5 left-2 w-1.5 h-2 bg-[#2B150A] rounded-b-sm" />
                    <div className="absolute -bottom-1.5 right-2 w-1.5 h-2 bg-[#2B150A] rounded-b-sm" />

                    <span 
                      className="font-bold text-[13px] tracking-wide text-center leading-tight line-clamp-1"
                      style={{
                        color: isSelected ? '#FFF8D6' : '#FFE899',
                        textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(231,198,90,0.5)'
                      }}
                    >
                      {cat.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN CONTENT AREA: Two-Column Layout */}
          <div className="relative z-20 flex-1 flex overflow-hidden px-1">
            
            {/* LEFT COLUMN: Numbered Chapters (~32% Width) */}
            <div className="w-[32%] flex flex-col pr-1 border-r border-[#4A260E]/50">
              
              {/* Traditional Golden Chevron Downward Motif */}
              <div className="flex flex-col items-center py-1 select-none">
                <div className="flex flex-col items-center -space-y-2 opacity-85">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[9px] border-t-[#C89B3C]" />
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[9px] border-t-[#A66A32]" />
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[9px] border-t-[#75451F]" />
                </div>
              </div>

              {/* Scrollable Chapter Planks */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 pb-2">
                {chapters.map((chap) => {
                  const isSelected = chap.id === activeChapterId;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => setActiveChapterId(chap.id)}
                      className={`w-full text-left px-1.5 py-2.5 transition-all duration-150 flex items-center justify-center rounded-sm ${
                        isSelected
                          ? 'ring-1.5 ring-[#FFE58F] shadow-md shadow-[#000]/70'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(90deg, #5C3212 0%, #7E451C 50%, #4E270A 100%)'
                          : 'linear-gradient(90deg, #4A250B 0%, #361906 100%)',
                        border: '1.5px solid #231005',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,230,160,0.2)'
                      }}
                    >
                      <span
                        className="font-bold text-[12px] text-center leading-snug break-words"
                        style={{
                          color: isSelected ? '#FFF8D6' : '#E8D2A0',
                          textShadow: '0 1px 3px #000, 0 0 2px #000'
                        }}
                      >
                        {chap.title}
                      </span>
                    </button>
                  );
                })}

                {chapters.length === 0 && !loading && (
                  <div className="text-[10px] text-center text-[#E7C65A] py-6 px-1 italic">
                    అధ్యాయాలు లేవు
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Wooden Subtopic Buttons (~68% Width) */}
            <div className="w-[68%] flex flex-col pl-1.5 relative overflow-hidden">
              
              {/* Vertical Dark Wood Spine on Left */}
              <div className="absolute left-1.5 top-0 bottom-0 w-2.5 bg-gradient-to-r from-[#241105] via-[#46230C] to-[#1C0D04] rounded-sm border border-[#160A03] z-10" />

              {/* Scrollable Subtopic Buttons */}
              <div className="flex-1 overflow-y-auto space-y-2 pl-3.5 pr-0.5 pb-2 pt-0.5">
                {subtopics.map((sub) => {
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubtopicClick(sub)}
                      className="w-full relative group text-left transition-all duration-150 active:scale-[0.98] flex items-center"
                      style={{
                        background: 'linear-gradient(180deg, #7D491F 0%, #572F12 50%, #3C1E0A 100%)',
                        border: '2px solid #241105',
                        borderRadius: '4px 18px 18px 4px',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,235,175,0.3)',
                        minHeight: '44px',
                        padding: '6px 8px 6px 14px'
                      }}
                    >
                      {/* Luminous Turquoise Dot / Rivet Connected to Spine */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-20">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-[#082D36]"
                          style={{
                            background: 'radial-gradient(circle at 35% 35%, #7DE5F7 0%, #168FA8 60%, #084350 100%)',
                            boxShadow: '0 0 5px rgba(22,143,168,0.8), 0 1px 2px rgba(0,0,0,0.8)'
                          }}
                        />
                      </div>

                      {/* Subtopic Telugu Title */}
                      <div className="flex-1 pr-1">
                        <span
                          className="font-bold text-[14px] leading-tight block"
                          style={{
                            color: '#D8E8A0', // Pale sage green from reference
                            textShadow: '0 1px 2px #000, 0 0 3px rgba(0,0,0,0.9)'
                          }}
                        >
                          {sub.title}
                        </span>
                        {sub.description && (
                          <span className="text-[9px] text-[#E8D9B5] line-clamp-1 opacity-80 mt-0.5">
                            {sub.description}
                          </span>
                        )}
                      </div>

                      {/* PDF Indicator Icon */}
                      <div className="shrink-0 pl-1">
                        <FileText className="w-3.5 h-3.5 text-[#E7C65A] opacity-75 group-hover:opacity-100" />
                      </div>
                    </button>
                  );
                })}

                {subtopics.length === 0 && (
                  <div className="text-[11px] text-center text-[#FFE58F] py-10 px-2 bg-[#2B150A]/60 rounded-md border border-[#52290D]/50 mt-4">
                    ఈ అధ్యాయంలో విషయాలు లేవు
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* BOTTOM BAR: Traditional Auxiliary Buttons with Increased Bottom Margin */}
          <div className="relative z-20 px-3 pt-3 pb-4 border-t border-[#4A260E]/50 flex flex-col space-y-2">
            <div className="grid grid-cols-3 gap-1 mb-1">
              <button 
                onClick={() => alert('ప్రాతిశాఖ్య: వైదిక స్వర శాస్త్ర & వ్యాకరణ సూత్రాలు')}
                className="py-1 px-1 bg-gradient-to-b from-[#693915] to-[#40200A] border border-[#231105] rounded-full text-[10px] font-bold text-[#E8D2A0] text-center shadow active:scale-95 hover:brightness-110 truncate"
              >
                ప్రాతిశాఖ్య
              </button>
              <button 
                onClick={() => alert('ప్రశ్నల వివరములు: వేద మంత్ర అధ్యయన వివరాలు')}
                className="py-1 px-1 bg-gradient-to-b from-[#693915] to-[#40200A] border border-[#231105] rounded-full text-[10px] font-bold text-[#E8D2A0] text-center shadow active:scale-95 hover:brightness-110 truncate"
              >
                ప్రశ్నల వివరములు
              </button>
              <button 
                onClick={() => alert('అనధ్యాయములు: వేద అధ్యయనం నిషిద్ధమైన పర్వదినాలు')}
                className="py-1 px-1 bg-gradient-to-b from-[#693915] to-[#40200A] border border-[#231105] rounded-full text-[10px] font-bold text-[#E8D2A0] text-center shadow active:scale-95 hover:brightness-110 truncate"
              >
                అనధ్యాయములు
              </button>
            </div>

            {/* Author Credit */}
            <div className="text-[9px] text-[#2B150A] font-extrabold tracking-wider text-left pl-1">
              {settings.footer_credit || 'V B S Sarma Kompella'}
            </div>
          </div>

          {/* IN-APP PDF READER MODAL (Direct PDF Viewer with Generous Safe Margins) */}
          {pdfModalOpen && activeSubtopic && (
            <div className="absolute inset-0 z-50 bg-[#140903] flex flex-col animate-fade-in pt-8 pb-6 px-3">
              {/* PDF Top App Bar with Wooden Gradient & Breathing Space */}
              <div className="h-12 bg-gradient-to-r from-[#4E270A] to-[#2B150A] px-3 flex items-center justify-between border border-[#6E3C14] rounded-lg shadow-md mb-2 flex-shrink-0">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="flex items-center space-x-1.5 text-[#FFE58F] active:scale-95 px-2 py-1 bg-[#1C0D04]/60 rounded border border-[#6E3C14]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-xs font-bold">వెనుకకు</span>
                </button>
                <div className="flex-1 px-2 text-center truncate">
                  <span className="text-xs font-bold text-[#FFF5D0]">
                    {activeSubtopic.title}
                  </span>
                </div>
                {activeSubtopic.has_document === 1 && activeSubtopic.document_id && (
                  <a
                    href={api.getDocumentStreamUrl(activeSubtopic.document_id) + '?download=1'}
                    className="p-1.5 text-[#FFE58F] bg-[#168FA8] hover:bg-[#0E6C80] rounded border border-[#084350] active:scale-95"
                    title="డౌన్‌లోడ్ (Download)"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* PDF Viewer Body - Directly Renders Actual PDF */}
              <div className="flex-1 bg-[#1C0D04] rounded-lg overflow-hidden border border-[#6E3C14] flex flex-col relative mb-2 shadow-inner">
                {activeSubtopic.has_document === 1 && activeSubtopic.document_id ? (
                  <iframe
                    src={api.getDocumentViewUrl(activeSubtopic.document_id)}
                    className="w-full h-full border-0 bg-[#FFFDF5]"
                    title={activeSubtopic.title}
                  />
                ) : (
                  <div className="text-center py-16 px-4 bg-[#3E2211] rounded-lg border border-[#6B3B18] m-auto">
                    <FileText className="w-8 h-8 text-[#E7C65A] mx-auto mb-2 opacity-60" />
                    <p className="text-xs text-[#FFE58F] font-bold">
                      ఈ అంశానికి సంబంధించి దస్త్రం (PDF) ఇంకా జోడించబడలేదు.
                    </p>
                    <p className="text-[10px] text-[#D2AC82] mt-1">
                      నిర్వాహక వేదిక (Admin Panel) ద్వారా PDF ను అప్‌లోడ్ చేయవచ్చు.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Safe Area Status Bar */}
              <div className="h-8 bg-[#2B150A] px-3 flex items-center justify-between border border-[#6E3C14] rounded-lg flex-shrink-0 text-[10px]">
                <span className="text-[#FFE58F] font-bold truncate max-w-[170px]">
                  {activeSubtopic.title}
                </span>
                <span className="text-[#D2AC82]">
                  {activeSubtopic.has_document === 1 ? '📄 ప్రత్యక్ష PDF' : 'దస్త్రం లేదు'}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
