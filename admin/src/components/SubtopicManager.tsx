// admin/src/components/SubtopicManager.tsx
import React, { useState, useEffect } from 'react';
import { Category, Chapter, Subtopic } from '../types';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, Bookmark, FileText, Upload } from 'lucide-react';

interface SubtopicManagerProps {
  categories: Category[];
  activeCategoryId: number | null;
  onRefresh: () => void;
  onOpenUploadForSubtopic?: (subtopicId: number) => void;
}

export const SubtopicManager: React.FC<SubtopicManagerProps> = ({
  categories,
  activeCategoryId,
  onRefresh,
  onOpenUploadForSubtopic
}) => {
  const [selectedCatId, setSelectedCatId] = useState<number>(activeCategoryId || (categories[0]?.id || 1));
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapId, setSelectedChapId] = useState<number | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeCategoryId) {
      setSelectedCatId(activeCategoryId);
    }
  }, [activeCategoryId]);

  // Load chapters for category
  useEffect(() => {
    if (!selectedCatId) return;
    api.getChapters(selectedCatId, true).then(data => {
      setChapters(data);
      if (data.length > 0) {
        setSelectedChapId(data[0].id);
      } else {
        setSelectedChapId(null);
        setSubtopics([]);
      }
    });
  }, [selectedCatId]);

  // Load subtopics for chapter
  const loadSubtopics = async () => {
    if (!selectedChapId) return;
    try {
      const data = await api.getSubtopics(selectedChapId, true);
      setSubtopics(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSubtopics();
  }, [selectedChapId]);

  const startEdit = (sub: Subtopic) => {
    setEditingId(sub.id);
    setTitle(sub.title);
    setDescription(sub.description || '');
    setIsPublished(sub.is_published);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setIsPublished(1);
  };

  const handleSave = async () => {
    if (!title.trim() || !selectedChapId) return alert('శీర్షిక అవసరం (Title required)');
    setLoading(true);
    try {
      if (isCreating) {
        await api.createSubtopic({
          chapter_id: selectedChapId,
          title,
          description,
          display_order: subtopics.length + 1,
          is_published: isPublished
        });
      } else if (editingId) {
        await api.updateSubtopic(editingId, {
          title,
          description,
          is_published: isPublished
        });
      }
      cancelEdit();
      await loadSubtopics();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving subtopic');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('ఈ విషయాన్ని మరియు అనుసంధానించబడిన PDF ను తొలగించాలనుకుంటున్నారా? (Delete subtopic?)')) return;
    try {
      await api.deleteSubtopic(id);
      await loadSubtopics();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting subtopic');
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= subtopics.length) return;

    const reordered = [...subtopics];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    const payload = reordered.map((s, idx) => ({
      id: s.id,
      display_order: idx + 1
    }));

    try {
      await api.reorderSubtopics(payload);
      await loadSubtopics();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error reordering');
    }
  };

  return (
    <div className="bg-[#241308] border border-[#542E13] rounded-xl p-5 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 pb-3 border-b border-[#43230C]">
        <div>
          <h2 className="text-xl font-bold text-[#FFE58F] flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#168FA8]" />
            <span>ఉప-విషయాల నిర్వహణ (Subtopics)</span>
          </h2>
          <p className="text-xs text-[#D2AC82] mt-0.5">
            కుడి కాలమ్ లో గుండ్రని అంచులు &amp; నీలి బిళ్ళతో కనిపించే కొయ్య బటన్లు (Level 3)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <select
              value={selectedCatId}
              onChange={e => setSelectedCatId(Number(e.target.value))}
              className="bg-[#1C0D04] border border-[#6E3C14] rounded-lg px-2.5 py-1.5 text-xs text-[#FFE58F] font-bold focus:outline-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedChapId || ''}
              onChange={e => setSelectedChapId(Number(e.target.value))}
              className="bg-[#1C0D04] border border-[#6E3C14] rounded-lg px-2.5 py-1.5 text-xs text-[#FFE58F] font-bold focus:outline-none"
            >
              {chapters.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.title}</option>
              ))}
            </select>
          </div>
          {selectedChapId && !isCreating && !editingId && (
            <button
              onClick={() => {
                setIsCreating(true);
                setTitle('');
                setDescription('');
                setIsPublished(1);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#75451F] hover:bg-[#8D5426] text-[#FFF5D0] rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>నూతన విషయం</span>
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <div className="mb-5 p-4 bg-[#1C0D04] rounded-lg border border-[#6E3C14] space-y-3">
          <h3 className="text-sm font-bold text-[#E7C65A]">
            {isCreating ? 'క్రొత్త ఉప-విషయాన్ని జోడించండి' : 'విషయాన్ని సవరించండి'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#D2AC82] mb-1">
                తెలుగు శీర్షిక (Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ఉదా: ఇషే త్వా, ఆప ఉన్దన్తు..."
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#D2AC82] mb-1">
                వివరణ (Description)
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="విషయం గురించిన సంక్షిప్త వివరణ..."
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="subPub"
              checked={isPublished === 1}
              onChange={e => setIsPublished(e.target.checked ? 1 : 0)}
              className="rounded bg-[#2A160A] border-[#52290D] text-[#E7C65A]"
            />
            <label htmlFor="subPub" className="text-xs text-[#FFF5D0]">
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

      {/* Subtopics List */}
      <div className="space-y-2">
        {subtopics.map((sub, idx) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-[#1D0E05] border-[#43230C] hover:border-[#6C3914] transition-all"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3.5 h-3.5 rounded-full border border-[#082D36] shrink-0"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #7DE5F7 0%, #168FA8 60%, #084350 100%)',
                  boxShadow: '0 0 4px rgba(22,143,168,0.7)'
                }}
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base text-[#D8E8A0]">{sub.title}</span>
                  {sub.has_document === 1 ? (
                    <span className="bg-emerald-900/60 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-700/50">
                      <FileText className="w-2.5 h-2.5 mr-0.5" />
                      <span>PDF జోడించబడింది ({Math.round((sub.document_file_size || 0) / 1024)} KB)</span>
                    </span>
                  ) : (
                    <span className="bg-amber-900/40 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-700/30">
                      PDF లేదు
                    </span>
                  )}
                  {sub.is_published === 0 && (
                    <span className="bg-red-900/40 text-red-300 text-[10px] px-1.5 py-0.5 rounded">
                      అప్రచురితం
                    </span>
                  )}
                </div>
                {sub.description && (
                  <p className="text-xs text-[#C89B3C] line-clamp-1 mt-0.5">{sub.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2">
              {onOpenUploadForSubtopic && (
                <button
                  onClick={() => onOpenUploadForSubtopic(sub.id)}
                  className="px-2.5 py-1 text-xs bg-[#168FA8] hover:bg-[#127286] text-white rounded font-medium flex items-center space-x-1 mr-1"
                  title="PDF అప్‌లోడ్ చేయండి"
                >
                  <Upload className="w-3 h-3" />
                  <span>{sub.has_document === 1 ? 'మార్చు' : 'PDF వేయు'}</span>
                </button>
              )}
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
                disabled={idx === subtopics.length - 1}
                className="p-1.5 text-[#D2AC82] hover:text-[#FFF] disabled:opacity-30 rounded hover:bg-[#2F180A]"
                title="క్రిందికి జరపండి"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(sub)}
                className="p-1.5 text-[#E7C65A] hover:text-white rounded hover:bg-[#2F180A]"
                title="సవరించండి"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(sub.id)}
                className="p-1.5 text-red-400 hover:text-red-200 rounded hover:bg-[#2F180A]"
                title="తొలగించండి"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {subtopics.length === 0 && (
          <div className="text-center py-8 text-[#A66A32] text-sm">
            ఈ అధ్యాయంలో ఉప-విషయాలు లేవు. నూతన విషయాన్ని జోడించండి.
          </div>
        )}
      </div>
    </div>
  );
};
