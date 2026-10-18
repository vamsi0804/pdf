// admin/src/components/CategoryManager.tsx
import React, { useState } from 'react';
import { Category } from '../types';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, X, Layers } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onRefresh: () => void;
  activeCategoryId: number | null;
  onSelectCategory: (id: number) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onRefresh,
  activeCategoryId,
  onSelectCategory
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(1);
  const [loading, setLoading] = useState(false);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setTitle(cat.title);
    setDescription(cat.description || '');
    setIsActive(cat.is_active);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setIsActive(1);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('దయచేసి శీర్షికను నమోదు చేయండి (Title required)');
    setLoading(true);
    try {
      if (isCreating) {
        await api.createCategory({
          title,
          description,
          is_active: isActive,
          display_order: categories.length + 1
        });
      } else if (editingId) {
        await api.updateCategory(editingId, {
          title,
          description,
          is_active: isActive
        });
      }
      cancelEdit();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('ఈ వర్గాన్ని తొలగించాలనుకుంటున్నారా? దీని కింద ఉన్న అన్ని అధ్యాయాలు మరియు విషయాలు కూడా తొలగించబడతాయి. (Delete this category?)')) return;
    try {
      await api.deleteCategory(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const reordered = [...categories];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    const payload = reordered.map((cat, idx) => ({
      id: cat.id,
      display_order: idx + 1
    }));

    try {
      await api.reorderCategories(payload);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error reordering');
    }
  };

  return (
    <div className="bg-[#241308] border border-[#542E13] rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#43230C]">
        <div>
          <h2 className="text-xl font-bold text-[#FFE58F] flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#E7C65A]" />
            <span>ప్రధాన విభాగాలు (Categories)</span>
          </h2>
          <p className="text-xs text-[#D2AC82] mt-0.5">
            యాప్‌లో ఎగువన కనిపించే 3 ప్రధాన కొయ్య బోర్డు బటన్ల నిర్వహణ
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => {
              setIsCreating(true);
              setTitle('');
              setDescription('');
              setIsActive(1);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#75451F] hover:bg-[#8D5426] text-[#FFF5D0] rounded-lg text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>నూతన విభాగం</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingId) && (
        <div className="mb-5 p-4 bg-[#1C0D04] rounded-lg border border-[#6E3C14] space-y-3">
          <h3 className="text-sm font-bold text-[#E7C65A]">
            {isCreating ? 'క్రొత్త విభాగం సృష్టించండి' : 'విభాగాన్ని సవరించండి'}
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
                placeholder="ఉదా: సంప్రదాయ, బ్రాహ్మణం, ఆరోగ్యం..."
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none focus:border-[#E7C65A]"
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
                placeholder="విభాగం వివరాలు..."
                className="w-full bg-[#2A160A] border border-[#52290D] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none focus:border-[#E7C65A]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="catActive"
              checked={isActive === 1}
              onChange={e => setIsActive(e.target.checked ? 1 : 0)}
              className="rounded bg-[#2A160A] border-[#52290D] text-[#E7C65A] focus:ring-0"
            />
            <label htmlFor="catActive" className="text-xs text-[#FFF5D0]">
              యాప్‌లో ప్రదర్శించు (Active)
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

      {/* Category List */}
      <div className="space-y-2">
        {categories.map((cat, idx) => {
          const isSelected = cat.id === activeCategoryId;
          return (
            <div
              key={cat.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-[#3A1E0B] border-[#E7C65A] shadow-md'
                  : 'bg-[#1D0E05] border-[#43230C] hover:border-[#6C3914]'
              }`}
            >
              <div 
                className="flex items-center space-x-3 cursor-pointer flex-1"
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="w-7 h-7 rounded bg-[#52290D] text-[#FFE58F] font-bold text-xs flex items-center justify-center shrink-0 border border-[#75451F]">
                  {cat.display_order}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-[#FFF5D0]">{cat.title}</span>
                    {isSelected && (
                      <span className="bg-[#168FA8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ఎంచుకోబడింది
                      </span>
                    )}
                    {cat.is_active === 0 && (
                      <span className="bg-red-900/60 text-red-200 text-[10px] px-1.5 py-0.5 rounded">
                        అచేతనం
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-[#C89B3C] line-clamp-1 mt-0.5">{cat.description}</p>
                  )}
                  <span className="text-[11px] text-[#A66A32]">
                    అధ్యాయాలు: {cat.chapters_count ?? 0}
                  </span>
                </div>
              </div>

              {/* Actions */}
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
                  disabled={idx === categories.length - 1}
                  className="p-1.5 text-[#D2AC82] hover:text-[#FFF] disabled:opacity-30 rounded hover:bg-[#2F180A]"
                  title="క్రిందికి జరపండి"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startEdit(cat)}
                  className="p-1.5 text-[#E7C65A] hover:text-white rounded hover:bg-[#2F180A]"
                  title="సవరించండి"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-red-400 hover:text-red-200 rounded hover:bg-[#2F180A]"
                  title="తొలగించండి"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center py-8 text-[#A66A32] text-sm">
            ప్రధాన విభాగాలు లేవు. క్రొత్త విభాగం జోడించండి.
          </div>
        )}
      </div>
    </div>
  );
};
