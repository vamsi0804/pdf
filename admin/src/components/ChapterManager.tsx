// admin/src/components/ChapterManager.tsx
import React, { useState, useEffect } from 'react';
import { Category, Chapter } from '../types';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, BookOpen } from 'lucide-react';

interface ChapterManagerProps {
  categories: Category[];
  activeCategoryId: number | null;
  onRefresh: () => void;
  onSelectChapter?: (id: number) => void;
}

export const ChapterManager: React.FC<ChapterManagerProps> = ({
  categories,
  activeCategoryId,
  onRefresh
}) => {
  const [selectedCatId, setSelectedCatId] = useState<number>(activeCategoryId || (categories[0]?.id || 1));
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [isPublished, setIsPublished] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeCategoryId) {
      setSelectedCatId(activeCategoryId);
    }
  }, [activeCategoryId]);

  const loadChapters = async () => {
    if (!selectedCatId) return;
    try {
      const data = await api.getChapters(selectedCatId, true);
      setChapters(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadChapters();
  }, [selectedCatId]);

  const startEdit = (chap: Chapter) => {
    setEditingId(chap.id);
    setTitle(chap.title);
    setDescription(chap.description || '');
    setChapterNumber(chap.chapter_number);
    setIsPublished(chap.is_published);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setChapterNumber(chapters.length + 1);
    setIsPublished(1);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('దయచేసి అధ్యాయం శీర్షికను నమోదు చేయండి (Chapter title required)');
    setLoading(true);
    try {
      if (isCreating) {
        await api.createChapter({
          category_id: selectedCatId,
          title,
          description,
          chapter_number: chapterNumber,
          display_order: chapters.length + 1,
          is_published: isPublished
        });
      } else if (editingId) {
        await api.updateChapter(editingId, {
          title,
          description,
          chapter_number: chapterNumber,
          is_published: isPublished
        });
      }
      cancelEdit();
      await loadChapters();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('ఈ అధ్యాయాన్ని తొలగించాలనుకుంటున్నారా? దీని కింద గల విషయాలు కూడా తొలగించబడతాయి. (Delete chapter?)')) return;
    try {
      await api.deleteChapter(id);
      await loadChapters();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting chapter');
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= chapters.length) return;

    const reordered = [...chapters];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    const payload = reordered.map((c, idx) => ({
      id: c.id,
      display_order: idx + 1
    }));

    try {
      await api.reorderChapters(payload);
      await loadChapters();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error reordering');
    }
  };

  return (
    <div className="bg-[#241308] border border-[#542E13] rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-[#43230C]">
        <div>
          <h2 className="text-xl font-bold text-[#FFE58F] flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#E7C65A]" />
            <span>అధ్యాయాల నిర్వహణ (Chapters)</span>
          </h2>
          <p className="text-xs text-[#D2AC82] mt-0.5">
            ఎడమ కాలమ్ లో నిలువుగా కనిపించే కొయ్య పలకల అధ్యాయాలు (Level 2)
          </p>
        </div>

        {/* Category selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs text-[#D2AC82] shrink-0 font-medium">విభాగం:</label>
          <select
            value={selectedCatId}
            onChange={e => setSelectedCatId(Number(e.target.value))}
            className="bg-[#1C0D04] border border-[#6E3C14] rounded-lg px-3 py-1.5 text-xs text-[#FFE58F] font-bold focus:outline-none"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.chapters_count ?? 0})
              </option>
            ))}
          </select>
          {!isCreating && !editingId && (
            <button
              onClick={() => {
                setIsCreating(true);
                setTitle('');
                setDescription('');
                setChapterNumber(chapters.length + 1);
                setIsPublished(1);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#75451F] hover:bg-[#8D5426] text-[#FFF5D0] rounded-lg text-xs font-semibold shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>నూతన అధ్యాయం</span>
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <div className="mb-5 p-4 bg-[#1C0D04] rounded-lg border border-[#6E3C14] space-y-3">
          <h3 className="text-sm font-bold text-[#E7C65A]">
            {isCreating ? 'క్రొత్త అధ్యాయాన్ని జోడించండి' : 'అధ్యాయాన్ని సవరించండి'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#D2AC82] mb-1">
                అధ్యాయ సంఖ్య (Number)
              </label>
              <input
                type="number"
                min="1"
                value={chapterNumber}
                onChange={e => setChapterNumber(parseInt(e.target.value) || 1)}
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#D2AC82] mb-1">
                తెలుగు శీర్షిక (Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ఉదా: 1 వ అష్టము లేదా 1వ అధ్యాయం..."
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-[#D2AC82] mb-1">
                వివరణ (Description)
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="ఈ అధ్యాయం వివరాలు..."
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="chapPub"
              checked={isPublished === 1}
              onChange={e => setIsPublished(e.target.checked ? 1 : 0)}
              className="rounded bg-[#2A160A] border-[#52290D] text-[#E7C65A]"
            />
            <label htmlFor="chapPub" className="text-xs text-[#FFF5D0]">
              ప్రచురించు (Published)
            </label>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={cancelEdit}
              className="px-3 py-1.5 bg-[#3A1E0B] hover:bg-[#4E270A] text-[#D2AC82] rounded text-xs"
            >
              రద్దు (Cancel)
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 bg-[#8D5426] hover:bg-[#A66A32] text-[#FFF5D0] font-bold rounded text-xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? 'భద్రపరుస్తోంది...' : 'భద్రపరచు (Save)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-2">
        {chapters.map((chap, idx) => (
          <div
            key={chap.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-[#1D0E05] border-[#43230C] hover:border-[#6C3914] transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded bg-[#52290D] text-[#FFE58F] font-bold text-xs flex items-center justify-center shrink-0 border border-[#75451F]">
                {chap.chapter_number}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base text-[#FFF5D0]">{chap.title}</span>
                  {chap.is_published === 0 && (
                    <span className="bg-amber-900/60 text-amber-200 text-[10px] px-1.5 py-0.5 rounded">
                      డ్రాఫ్ట్
                    </span>
                  )}
                </div>
                {chap.description && (
                  <p className="text-xs text-[#C89B3C] line-clamp-1 mt-0.5">{chap.description}</p>
                )}
                <span className="text-[11px] text-[#A66A32]">
                  విషయాలు (Subtopics): {chap.subtopics_count ?? 0}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => moveOrder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 text-[#D2AC82] hover:text-[#FFF] disabled:opacity-30 rounded hover:bg-[#2F180A]"
                title="పైకి జరపండి"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveOrder(idx, 'down')}
                disabled={idx === chapters.length - 1}
                className="p-1.5 text-[#D2AC82] hover:text-[#FFF] disabled:opacity-30 rounded hover:bg-[#2F180A]"
                title="క్రిందికి జరపండి"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(chap)}
                className="p-1.5 text-[#E7C65A] hover:text-white rounded hover:bg-[#2F180A]"
                title="సవరించండి"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(chap.id)}
                className="p-1.5 text-red-400 hover:text-red-200 rounded hover:bg-[#2F180A]"
                title="తొలగించండి"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {chapters.length === 0 && (
          <div className="text-center py-8 text-[#A66A32] text-sm">
            ఈ విభాగంలో అధ్యాయాలు లేవు. నూతన అధ్యాయాన్ని జోడించండి.
          </div>
        )}
      </div>
    </div>
  );
};
