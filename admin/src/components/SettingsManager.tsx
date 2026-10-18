// admin/src/components/SettingsManager.tsx
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { api } from '../services/api';
import { Sliders, Image, Check, RefreshCw } from 'lucide-react';

interface SettingsManagerProps {
  settings: AppSettings;
  onRefresh: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onRefresh }) => {
  const [appTitle, setAppTitle] = useState(settings.app_title || 'సాంప్రదాయిక జ్ఞాన తరంగిణి');
  const [appSubtitle, setAppSubtitle] = useState(settings.app_subtitle || 'వేద సంప్రదాయ & ఆయుర్వేద విజ్ఞాన గ్రంథాలు');
  const [footerCredit, setFooterCredit] = useState(settings.footer_credit || 'V B S Sarma Kompella');
  const [primaryWood, setPrimaryWood] = useState(settings.primary_wood_color || '#75451F');
  const [accentColor, setAccentColor] = useState(settings.accent_color || '#168FA8');
  const [textColor, setTextColor] = useState(settings.text_color || '#D8E8A0');
  const [saving, setSaving] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        app_title: appTitle,
        app_subtitle: appSubtitle,
        footer_credit: footerCredit,
        primary_wood_color: primaryWood,
        accent_color: accentColor,
        text_color: textColor
      });
      alert('అమరికలు విజయవంతంగా భద్రపరచబడ్డాయి! (Settings saved successfully)');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingBg(true);
    try {
      await api.uploadBackground(file);
      alert('నేపథ్య చిత్రం విజయవంతంగా మార్చబడింది! (Background updated)');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Background upload failed');
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <div className="bg-[#241308] border border-[#542E13] rounded-xl p-5 shadow-lg space-y-6">
      <div className="pb-3 border-b border-[#43230C]">
        <h2 className="text-xl font-bold text-[#FFE58F] flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-[#E7C65A]" />
          <span>యాప్ రూపకల్పన &amp; అమరికలు (Visual &amp; App Settings)</span>
        </h2>
        <p className="text-xs text-[#D2AC82] mt-0.5">
          యాప్ శీర్షికలు, కొయ్య రంగులు, సాంప్రదాయిక నేపథ్య చిత్రాలు మరియు కర్తృత్వ వివరాల మార్పులు.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
              యాప్ ప్రధాన శీర్షిక (App Title)
            </label>
            <input
              type="text"
              value={appTitle}
              onChange={e => setAppTitle(e.target.value)}
              className="w-full bg-[#1C0D04] border border-[#6E3C14] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
              ఉప శీర్షిక (Subtitle)
            </label>
            <input
              type="text"
              value={appSubtitle}
              onChange={e => setAppSubtitle(e.target.value)}
              className="w-full bg-[#1C0D04] border border-[#6E3C14] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
              రచయిత / సంపాదక కర్తృత్వం (Footer Credit)
            </label>
            <input
              type="text"
              value={footerCredit}
              onChange={e => setFooterCredit(e.target.value)}
              className="w-full bg-[#1C0D04] border border-[#6E3C14] rounded px-3 py-2 text-sm text-[#FFF5D0] focus:outline-none"
            />
          </div>

          {/* Color Palettes */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-[#D2AC82] mb-1">
                కొయ్య రంగు (Wood)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={primaryWood}
                  onChange={e => setPrimaryWood(e.target.value)}
                  className="w-8 h-8 rounded border border-[#6E3C14] bg-transparent cursor-pointer"
                />
                <span className="text-xs text-[#FFF5D0]">{primaryWood}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#D2AC82] mb-1">
                నీలి బిళ్ళ (Accent)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#6E3C14] bg-transparent cursor-pointer"
                />
                <span className="text-xs text-[#FFF5D0]">{accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#D2AC82] mb-1">
                అక్షరాల రంగు (Text)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={e => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#6E3C14] bg-transparent cursor-pointer"
                />
                <span className="text-xs text-[#FFF5D0]">{textColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#75451F] hover:bg-[#8D5426] text-[#FFF5D0] font-bold rounded-lg text-xs shadow flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'భద్రపరుస్తోంది...' : 'అమరికలు భద్రపరచు'}</span>
          </button>
        </div>
      </form>

      {/* Background artwork management */}
      <div className="pt-4 border-t border-[#43230C]">
        <h3 className="text-sm font-bold text-[#E7C65A] mb-2 flex items-center space-x-2">
          <Image className="w-4 h-4 text-[#168FA8]" />
          <span>సాంప్రదాయిక నేపథ్య చిత్రం (Background Artwork)</span>
        </h3>
        <p className="text-xs text-[#D2AC82] mb-3">
          యాప్‌లో వెనుకభాగంలో కనిపించే సంప్రదాయ చిత్రపటాన్ని మార్చవచ్చు (JPG, PNG, WEBP).
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1C0D04] p-3 rounded-lg border border-[#6E3C14]">
          <div className="w-24 h-36 rounded-md overflow-hidden border border-[#A66A32] shadow-md bg-[#000] shrink-0">
            <img
              src={settings.background_image || '/assets/backgrounds/traditional_bg.jpg'}
              alt="Current Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xs text-[#FFF5D0] font-semibold">
              ప్రస్తుత నేపథ్య చిత్రం: {settings.background_image || 'సాంప్రదాయిక చిత్రపటం'}
            </p>
            <p className="text-[11px] text-[#A66A32]">
              కొత్త చిత్రాన్ని అప్‌లోడ్ చేసిన వెంటనే మొబైల్ స్క్రీన్‌పై మరియు సిమ్యులేటర్‌లో స్వయంచాలకంగా ప్రతిబింబిస్తుంది.
            </p>
            <div>
              <input
                type="file"
                id="bgUploadInput"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBgUpload}
                className="hidden"
              />
              <label
                htmlFor="bgUploadInput"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#8D5426] hover:bg-[#A66A32] text-[#FFF5D0] rounded text-xs font-bold cursor-pointer"
              >
                <Image className="w-3.5 h-3.5" />
                <span>{uploadingBg ? 'అప్‌లోడ్ అవుతోంది...' : 'నూతన చిత్రాన్ని ఎంచుకోండి'}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
