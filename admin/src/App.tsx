// admin/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Category, AppSettings, AdminStats, User } from './types';
import { api } from './services/api';
import { CategoryManager } from './components/CategoryManager';
import { ChapterManager } from './components/ChapterManager';
import { SubtopicManager } from './components/SubtopicManager';
import { DocumentManager } from './components/DocumentManager';
import { SettingsManager } from './components/SettingsManager';
import { MobileSimulator } from './components/MobileSimulator';
import { LoginModal } from './components/LoginModal';
import { 
  Layers, 
  BookOpen, 
  Bookmark, 
  FileText, 
  Sliders, 
  Smartphone, 
  HardDrive, 
  LogOut, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'chapters' | 'subtopics' | 'documents' | 'settings'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    app_title: 'సాంప్రదాయిక జ్ఞాన తరంగిణి',
    app_subtitle: 'వేద సంప్రదాయ & ఆయుర్వేద విజ్ఞాన గ్రంథాలు',
    footer_credit: 'V B S Sarma Kompella'
  });
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(!api.getToken());
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [showSimulator, setShowSimulator] = useState<boolean>(true);
  const [preselectedSubtopicId, setPreselectedSubtopicId] = useState<number | null>(null);

  const refreshAll = async () => {
    try {
      const [cats, setts, st] = await Promise.all([
        api.getCategories(true),
        api.getSettings(),
        api.getToken() ? api.getStats().catch(() => null) : Promise.resolve(null)
      ]);
      setCategories(cats);
      setSettings(setts);
      if (st) setStats(st);
      if (cats.length > 0 && !activeCategoryId) {
        setActiveCategoryId(cats[0].id);
      }
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshAll();

    const handleUnauthorized = () => {
      setUser(null);
      setShowLogin(true);
    };

    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  const handleLogout = () => {
    api.setToken(null);
    setUser(null);
    setShowLogin(true);
  };

  const handleOpenUploadForSubtopic = (subtopicId: number) => {
    setPreselectedSubtopicId(subtopicId);
    setActiveTab('documents');
  };

  return (
    <div className="min-h-screen bg-[#160D06] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-gradient-to-r from-[#241308] via-[#361909] to-[#241308] border-b-2 border-[#542E13] sticky top-0 z-40 shadow-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-[#8D5426] to-[#4A250B] border-2 border-[#FFE58F] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#FFE58F]" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-[#FFE58F] tracking-wide flex items-center space-x-2">
                <span>సాంప్రదాయిక జ్ఞాన నిర్వాహక వేదిక</span>
                <span className="text-[10px] bg-[#168FA8] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-normal">
                  Admin v1.0
                </span>
              </h1>
              <p className="text-xs text-[#D2AC82]">
                Traditional Telugu Knowledge &amp; PDF Reader App Management
              </p>
            </div>
          </div>

          {/* Quick Stats & User Profile */}
          <div className="flex items-center space-x-4">
            {stats && (
              <div className="hidden lg:flex items-center space-x-3 text-xs bg-[#1C0D04] px-3 py-1.5 rounded-lg border border-[#43230C]">
                <div className="text-center">
                  <span className="block text-[#D2AC82] text-[10px]">విభాగాలు</span>
                  <span className="font-bold text-[#FFE58F]">{stats.categories_count}</span>
                </div>
                <div className="w-px h-6 bg-[#43230C]" />
                <div className="text-center">
                  <span className="block text-[#D2AC82] text-[10px]">అధ్యాయాలు</span>
                  <span className="font-bold text-[#FFE58F]">{stats.chapters_count}</span>
                </div>
                <div className="w-px h-6 bg-[#43230C]" />
                <div className="text-center">
                  <span className="block text-[#D2AC82] text-[10px]">విషయాలు</span>
                  <span className="font-bold text-[#FFE58F]">{stats.subtopics_count}</span>
                </div>
                <div className="w-px h-6 bg-[#43230C]" />
                <div className="text-center">
                  <span className="block text-[#D2AC82] text-[10px]">PDFలు</span>
                  <span className="font-bold text-[#168FA8]">{stats.documents_count}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showSimulator
                  ? 'bg-[#168FA8] text-white shadow-md'
                  : 'bg-[#2A160A] text-[#D2AC82] hover:bg-[#3D2010]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>మొబైల్ ప్రివ్యూ</span>
            </button>

            <button
              onClick={refreshAll}
              className="p-1.5 text-[#D2AC82] hover:text-[#FFE58F] bg-[#2A160A] rounded-lg border border-[#43230C]"
              title="రిఫ్రెష్ చేయండి"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {api.getToken() && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#43230C] hover:bg-red-900/60 text-red-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>నిష్క్రమణ</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs Bar */}
      <nav className="bg-[#1C0D04] border-b border-[#3A1E0B] px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-1 py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-[#75451F] text-[#FFF5D0] shadow-md border border-[#9C5D26]'
                : 'text-[#D2AC82] hover:text-[#FFF] hover:bg-[#2A160A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. ప్రధాన విభాగాలు (Categories)</span>
          </button>

          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'chapters'
                ? 'bg-[#75451F] text-[#FFF5D0] shadow-md border border-[#9C5D26]'
                : 'text-[#D2AC82] hover:text-[#FFF] hover:bg-[#2A160A]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. అధ్యాయాలు (Chapters)</span>
          </button>

          <button
            onClick={() => setActiveTab('subtopics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'subtopics'
                ? 'bg-[#75451F] text-[#FFF5D0] shadow-md border border-[#9C5D26]'
                : 'text-[#D2AC82] hover:text-[#FFF] hover:bg-[#2A160A]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>3. ఉప-విషయాలు (Subtopics)</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'documents'
                ? 'bg-[#75451F] text-[#FFF5D0] shadow-md border border-[#9C5D26]'
                : 'text-[#D2AC82] hover:text-[#FFF] hover:bg-[#2A160A]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>4. PDF దస్త్రాలు (Documents)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-[#75451F] text-[#FFF5D0] shadow-md border border-[#9C5D26]'
                : 'text-[#D2AC82] hover:text-[#FFF] hover:bg-[#2A160A]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>5. రూపకల్పన &amp; అమరికలు (Settings)</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Management Panels */}
        <div className="flex-1 min-w-0">
          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              onRefresh={refreshAll}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
            />
          )}

          {activeTab === 'chapters' && (
            <ChapterManager
              categories={categories}
              activeCategoryId={activeCategoryId}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'subtopics' && (
            <SubtopicManager
              categories={categories}
              activeCategoryId={activeCategoryId}
              onRefresh={refreshAll}
              onOpenUploadForSubtopic={handleOpenUploadForSubtopic}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentManager
              categories={categories}
              preselectedSubtopicId={preselectedSubtopicId}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsManager
              settings={settings}
              onRefresh={refreshAll}
            />
          )}
        </div>

        {/* Right Column: Live Mobile UI Emulator */}
        {showSimulator && (
          <aside className="w-full lg:w-[390px] shrink-0 flex flex-col items-center">
            <div className="sticky top-24 w-full flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-[360px] mb-2 px-2">
                <span className="text-xs font-bold text-[#E7C65A] flex items-center space-x-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#168FA8]" />
                  <span>లైవ్ మొబైల్ అనుకరణ (Live Preview)</span>
                </span>
                <span className="text-[10px] text-[#A66A32]">
                  సజీవ మార్పులు
                </span>
              </div>

              <MobileSimulator
                categories={categories}
                activeCategoryId={activeCategoryId}
                onSelectCategory={setActiveCategoryId}
                settings={settings}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </aside>
        )}
      </main>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onSuccess={(u) => {
            setUser(u);
            setShowLogin(false);
            refreshAll();
          }}
        />
      )}
    </div>
  );
};
