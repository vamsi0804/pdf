// admin/src/components/DocumentManager.tsx
import React, { useState, useEffect } from 'react';
import { Document, Subtopic, Chapter, Category } from '../types';
import { api } from '../services/api';
import { Upload, FileText, Trash2, Eye, Download, Check, AlertCircle, X } from 'lucide-react';

interface DocumentManagerProps {
  categories: Category[];
  preselectedSubtopicId?: number | null;
  onRefresh: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  categories,
  preselectedSubtopicId,
  onRefresh
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<number | null>(preselectedSubtopicId || null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [allowDownload, setAllowDownload] = useState(1);
  const [isPublished, setIsPublished] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const loadDocuments = async () => {
    try {
      const data = await api.getDocuments(undefined, true);
      setDocuments(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const loadAllSubtopics = async () => {
    try {
      const allSubs: Subtopic[] = [];
      for (const cat of categories) {
        const chaps = await api.getChapters(cat.id, true);
        for (const ch of chaps) {
          const subs = await api.getSubtopics(ch.id, true);
          allSubs.push(...subs);
        }
      }
      setSubtopics(allSubs);
      if (preselectedSubtopicId) {
        setSelectedSubtopicId(preselectedSubtopicId);
      } else if (allSubs.length > 0 && !selectedSubtopicId) {
        setSelectedSubtopicId(allSubs[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
    if (categories.length > 0) {
      loadAllSubtopics();
    }
  }, [categories, preselectedSubtopicId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('దయచేసి .pdf ఫైల్‌ను మాత్రమే ఎంచుకోండి');
        return;
      }
      setFile(selected);
      setErrorMsg(null);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubtopicId) {
      setErrorMsg('దయచేసి ఉప-విషయాన్ని ఎంచుకోండి');
      return;
    }
    if (!file) {
      setErrorMsg('దయచేసి PDF ఫైల్‌ను ఎంచుకోండి');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('subtopic_id', selectedSubtopicId.toString());
    formData.append('pdf_file', file);
    formData.append('title', title);
    formData.append('allow_download', allowDownload.toString());
    formData.append('is_published', isPublished.toString());

    try {
      await api.uploadDocument(formData);
      setFile(null);
      setTitle('');
      await loadDocuments();
      onRefresh();
      alert('PDF విజయవంతంగా అప్‌లోడ్ చేయబడింది!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('ఈ PDF ను శాశ్వతంగా తొలగించాలనుకుంటున్నారా? (Delete PDF?)')) return;
    try {
      await api.deleteDocument(id);
      await loadDocuments();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting document');
    }
  };

  const totalBytes = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-[#241308] border border-[#542E13] rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-bold text-[#FFE58F] flex items-center space-x-2 mb-1">
          <Upload className="w-5 h-5 text-[#E7C65A]" />
          <span>నూతన PDF అప్‌లోడ్ (Upload Document)</span>
        </h2>
        <p className="text-xs text-[#D2AC82] mb-4">
          ఉప-విషయానికి సంబంధించిన PDF గ్రంథం లేదా ప్రవచన పత్రాన్ని జత చేయండి.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-800 rounded text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
                ఉప-విషయాన్ని ఎంచుకోండి (Subtopic) *
              </label>
              <select
                value={selectedSubtopicId || ''}
                onChange={e => setSelectedSubtopicId(Number(e.target.value))}
                className="w-full bg-[#1C0D04] border border-[#6E3C14] rounded px-3 py-2 text-sm text-[#FFE58F] font-medium focus:outline-none"
              >
                {subtopics.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title} ({sub.chapter_title || 'అధ్యాయం'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
                దస్త్ర శీర్షిక (Document Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ఉదా: ఇషే త్వా - వేద మంత్రం & తాత్పర్యం"
                className="w-full bg-[#1C0D04] border border-[#6E3C14] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
              />
            </div>
          </div>

          {/* Drag & Drop File Input */}
          <div className="border-2 border-dashed border-[#6E3C14] hover:border-[#E7C65A] bg-[#1A0E05] rounded-xl p-6 text-center transition-colors">
            <input
              type="file"
              id="pdfUpload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="pdfUpload" className="cursor-pointer flex flex-col items-center">
              <FileText className="w-10 h-10 text-[#E7C65A] mb-2" />
              <span className="text-sm font-bold text-[#FFE58F]">
                {file ? file.name : 'PDF ఫైల్‌ను ఇక్కడ లాగి వదలండి లేదా ఎంచుకోండి'}
              </span>
              <span className="text-xs text-[#A66A32] mt-1">
                {file ? `${Math.round(file.size / 1024)} KB - సిద్ధంగా ఉంది` : 'గరిష్ట పరిమాణం: 50 MB (.pdf మాత్రమే)'}
              </span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 text-xs text-[#FFF5D0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDownload === 1}
                  onChange={e => setAllowDownload(e.target.checked ? 1 : 0)}
                  className="rounded bg-[#2A160A] border-[#52290D] text-[#E7C65A]"
                />
                <span>డౌన్‌లోడ్ అనుమతించు (Allow Download)</span>
              </label>

              <label className="flex items-center space-x-1.5 text-xs text-[#FFF5D0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished === 1}
                  onChange={e => setIsPublished(e.target.checked ? 1 : 0)}
                  className="rounded bg-[#2A160A] border-[#52290D] text-[#E7C65A]"
                />
                <span>ప్రచురించు (Publish)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="px-6 py-2 bg-[#75451F] hover:bg-[#8D5426] disabled:opacity-50 text-[#FFF5D0] font-bold rounded-lg text-xs shadow flex items-center space-x-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'అప్‌లోడ్ అవుతోంది...' : 'PDF అప్‌లోడ్ చేయండి'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-[#241308] border border-[#542E13] rounded-xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#43230C]">
          <div>
            <h2 className="text-xl font-bold text-[#FFE58F] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#E7C65A]" />
              <span>అప్‌లోడ్ అయిన PDF దస్త్రాలు ({documents.length})</span>
            </h2>
            <p className="text-xs text-[#D2AC82] mt-0.5">
              మొత్తం నిల్వ పరిమాణం: {(totalBytes / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C0D04] text-[#D2AC82] uppercase text-[10px] tracking-wider border-b border-[#43230C]">
              <tr>
                <th className="py-2.5 px-3">శీర్షిక (Title)</th>
                <th className="py-2.5 px-3">విభాగం & అధ్యాయం</th>
                <th className="py-2.5 px-3">పరిమాణం</th>
                <th className="py-2.5 px-3">డౌన్‌లోడ్</th>
                <th className="py-2.5 px-3 text-right">చర్యలు</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A1E0B]">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-[#2C170B] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-sm text-[#FFF5D0]">{doc.title}</div>
                    <div className="text-[11px] text-[#A66A32]">{doc.original_filename}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-xs text-[#E7C65A] font-semibold">{doc.subtopic_title}</div>
                    <div className="text-[10px] text-[#C89B3C]">{doc.chapter_title} • {doc.category_title}</div>
                  </td>
                  <td className="py-3 px-3 text-[#D2AC82]">
                    {Math.round(doc.file_size / 1024)} KB
                  </td>
                  <td className="py-3 px-3">
                    {doc.allow_download === 1 ? (
                      <span className="text-emerald-400 font-semibold">అవును</span>
                    ) : (
                      <span className="text-amber-400">పరిమితం</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 text-[#168FA8] hover:text-[#7DE5F7] rounded hover:bg-[#1C0D04]"
                      title="పరిశీలించండి (Preview)"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={api.getDocumentStreamUrl(doc.id) + '?download=1'}
                      className="p-1.5 text-[#E7C65A] hover:text-white rounded hover:bg-[#1C0D04] inline-block"
                      title="డౌన్‌లోడ్"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-red-400 hover:text-red-200 rounded hover:bg-[#1C0D04]"
                      title="తొలగించండి"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#A66A32]">
                    దస్త్రాలు ఏవీ లేవు. పై ఫారమ్ ద్వారా PDF ను అప్‌లోడ్ చేయండి.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#1C0D04] border border-[#6E3C14] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="h-12 bg-[#2B150A] px-4 flex items-center justify-between border-b border-[#4E270A]">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#E7C65A]" />
                <span className="font-bold text-sm text-[#FFF5D0]">{previewDoc.title}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-[#D2AC82] hover:text-white rounded-lg hover:bg-[#3D2010]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-[#26150B] p-2">
              <iframe
                src={api.getDocumentStreamUrl(previewDoc.id)}
                className="w-full h-full rounded border-0"
                title={previewDoc.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
