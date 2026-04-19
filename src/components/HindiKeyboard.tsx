import { useState } from 'react';
import { Info } from 'lucide-react';

export type HindiLayout = 'inscript' | 'remington';

type KeyData = {
  key: string;
  normal: string;
  shift: string;
};

// ─── Inscript Layout (GoI Standard / Mangal / Unicode) ───────────────────────
const INSCRIPT: KeyData[][] = [
  [
    { key: '`', normal: '॰', shift: 'ॐ' },
    { key: '1', normal: '१', shift: '!' },
    { key: '2', normal: '२', shift: '@' },
    { key: '3', normal: '३', shift: '#' },
    { key: '4', normal: '४', shift: '$' },
    { key: '5', normal: '५', shift: '%' },
    { key: '6', normal: '६', shift: '^' },
    { key: '7', normal: '७', shift: '&' },
    { key: '8', normal: '८', shift: '*' },
    { key: '9', normal: '९', shift: '(' },
    { key: '0', normal: '०', shift: ')' },
    { key: '-', normal: '-', shift: '_' },
    { key: '=', normal: 'ृ', shift: 'ॄ' },
  ],
  [
    { key: 'Q', normal: 'ौ', shift: 'औ' },
    { key: 'W', normal: 'ै', shift: 'ऐ' },
    { key: 'E', normal: 'ा', shift: 'आ' },
    { key: 'R', normal: 'ी', shift: 'ई' },
    { key: 'T', normal: 'ू', shift: 'ऊ' },
    { key: 'Y', normal: 'ब', shift: 'भ' },
    { key: 'U', normal: 'ह', shift: 'ङ' },
    { key: 'I', normal: 'ग', shift: 'घ' },
    { key: 'O', normal: 'द', shift: 'ध' },
    { key: 'P', normal: 'ज', shift: 'झ' },
    { key: '[', normal: 'ड', shift: 'ढ' },
    { key: ']', normal: '़', shift: 'ञ' },
    { key: '\\', normal: 'ँ', shift: 'ं' },
  ],
  [
    { key: 'A', normal: 'ो', shift: 'ओ' },
    { key: 'S', normal: 'े', shift: 'ए' },
    { key: 'D', normal: '्', shift: 'अ' },
    { key: 'F', normal: 'ि', shift: 'इ' },
    { key: 'G', normal: 'ु', shift: 'उ' },
    { key: 'H', normal: 'प', shift: 'फ' },
    { key: 'J', normal: 'र', shift: 'ऋ' },
    { key: 'K', normal: 'क', shift: 'ख' },
    { key: 'L', normal: 'त', shift: 'थ' },
    { key: ';', normal: 'च', shift: 'छ' },
    { key: "'", normal: 'ट', shift: 'ठ' },
  ],
  [
    { key: 'Z', normal: 'ॅ', shift: 'ॆ' },
    { key: 'X', normal: 'ं', shift: 'ः' },
    { key: 'C', normal: 'म', shift: 'ण' },
    { key: 'V', normal: 'न', shift: 'ञ' },
    { key: 'B', normal: 'व', shift: 'भ' },
    { key: 'N', normal: 'ल', shift: 'ळ' },
    { key: 'M', normal: 'स', shift: 'श' },
    { key: ',', normal: ',', shift: 'ष' },
    { key: '.', normal: '.', shift: '।' },
    { key: '/', normal: 'य', shift: '?' },
  ],
];

// ─── Remington Gail Layout (Typewriter based / UP-Bihar-MP state exams) ───────
const REMINGTON_GAIL: KeyData[][] = [
  [
    { key: '`', normal: '', shift: '' },
    { key: '1', normal: '१', shift: '!' },
    { key: '2', normal: '२', shift: '@' },
    { key: '3', normal: '३', shift: '#' },
    { key: '4', normal: '४', shift: '$' },
    { key: '5', normal: '५', shift: '%' },
    { key: '6', normal: '६', shift: '^' },
    { key: '7', normal: '७', shift: '&' },
    { key: '8', normal: '८', shift: '*' },
    { key: '9', normal: '९', shift: '(' },
    { key: '0', normal: '०', shift: ')' },
    { key: '-', normal: '-', shift: '्' },
    { key: '=', normal: 'ज्ञ', shift: 'क्ष' },
  ],
  [
    { key: 'Q', normal: 'ौ', shift: 'क्ष' },
    { key: 'W', normal: 'ा', shift: 'ञ' },
    { key: 'E', normal: 'म', shift: 'ण' },
    { key: 'R', normal: 'त', shift: 'थ' },
    { key: 'T', normal: 'ज', shift: 'झ' },
    { key: 'Y', normal: 'ब', shift: 'भ' },
    { key: 'U', normal: 'ु', shift: 'ू' },
    { key: 'I', normal: 'ि', shift: 'ी' },
    { key: 'O', normal: 'ो', shift: 'ओ' },
    { key: 'P', normal: 'प', shift: 'फ' },
    { key: '[', normal: 'ड', shift: 'ढ' },
    { key: ']', normal: 'ृ', shift: 'ॄ' },
    { key: '\\', normal: 'ः', shift: 'ँ' },
  ],
  [
    { key: 'A', normal: 'अ', shift: 'आ' },
    { key: 'S', normal: 'स', shift: 'श' },
    { key: 'D', normal: 'ह', shift: 'ध' },
    { key: 'F', normal: '्', shift: 'ॅ' },
    { key: 'G', normal: 'ग', shift: 'घ' },
    { key: 'H', normal: 'य', shift: 'ष' },
    { key: 'J', normal: 'र', shift: 'ऋ' },
    { key: 'K', normal: 'क', shift: 'ख' },
    { key: 'L', normal: 'ल', shift: 'ळ' },
    { key: ';', normal: 'च', shift: 'छ' },
    { key: "'", normal: 'ट', shift: 'ठ' },
  ],
  [
    { key: 'Z', normal: 'ज्ञ', shift: '' },
    { key: 'X', normal: 'ं', shift: 'ः' },
    { key: 'C', normal: 'व', shift: 'श' },
    { key: 'V', normal: 'न', shift: 'ण' },
    { key: 'B', normal: 'ब', shift: 'भ' },
    { key: 'N', normal: 'ञ', shift: 'ँ' },
    { key: 'M', normal: 'म', shift: '' },
    { key: ',', normal: ',', shift: '?' },
    { key: '.', normal: '.', shift: '।' },
    { key: '/', normal: 'र', shift: '' },
  ],
];

// Color-code key type for quick recognition
const getKeyType = (normal: string, shift: string, layout: HindiLayout): string => {
  const matras = ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ृ', 'ॄ'];
  const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'ऋ', 'ॐ'];
  const specials = ['्', 'ं', 'ः', 'ँ', '़', 'ॅ'];

  if (matras.includes(normal) || matras.includes(shift)) return 'matra';
  if (vowels.includes(normal) || vowels.includes(shift)) return 'vowel';
  if (specials.includes(normal) || specials.includes(shift)) return 'special';
  if (!normal && !shift) return 'empty';
  // number keys
  if (/^[0-9]$/.test(normal) || /^[१-९०]$/.test(normal)) return 'number';
  return 'consonant';
};

const KEY_TYPE_COLORS: Record<string, string> = {
  matra: 'border-violet-300 bg-violet-50 hover:border-violet-500',
  vowel: 'border-emerald-300 bg-emerald-50 hover:border-emerald-500',
  special: 'border-amber-300 bg-amber-50 hover:border-amber-500',
  consonant: 'border-sky-200 bg-sky-50 hover:border-sky-500',
  number: 'border-slate-200 bg-slate-50 hover:border-slate-400',
  empty: 'border-slate-100 bg-slate-50 opacity-40',
};

interface HindiKeyboardProps {
  layout: HindiLayout;
  onLayoutChange?: (l: HindiLayout) => void;
  showLayoutToggle?: boolean;
  compact?: boolean;
}

const HindiKeyboard = ({
  layout,
  onLayoutChange,
  showLayoutToggle = true,
  compact = false,
}: HindiKeyboardProps) => {
  const [isShift, setIsShift] = useState(false);
  const [clickedKey, setClickedKey] = useState<KeyData | null>(null);

  const rows = layout === 'inscript' ? INSCRIPT : REMINGTON_GAIL;

  const handleKeyClick = (k: KeyData) => {
    setClickedKey(prev => (prev?.key === k.key ? null : k));
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-5xl mx-auto'}`}>

      {/* Layout + Shift Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {showLayoutToggle && (
          <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            {(['inscript', 'remington'] as HindiLayout[]).map((l) => (
              <button
                key={l}
                onClick={() => { onLayoutChange?.(l); setClickedKey(null); }}
                className={`px-4 py-2 text-sm font-bold transition-all ${
                  layout === l
                    ? 'bg-black text-white'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                {l === 'inscript' ? 'Inscript (Mangal)' : 'Remington Gail'}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsShift(s => !s)}
          className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
            isShift
              ? 'bg-sky-500 border-sky-500 text-black'
              : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400'
          }`}
        >
          ⇧ Shift {isShift ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Clicked Key Detail Panel */}
      {clickedKey && (
        <div className="mb-4 bg-black text-white rounded-2xl px-6 py-4 flex items-center gap-6 animate-pulse-once">
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Normal</p>
              <p className="text-5xl font-bold text-sky-400 leading-none" style={{ fontFamily: 'sans-serif' }}>
                {clickedKey.normal || '—'}
              </p>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Shift +</p>
              <p className="text-5xl font-bold text-emerald-400 leading-none" style={{ fontFamily: 'sans-serif' }}>
                {clickedKey.shift || '—'}
              </p>
            </div>
          </div>
          <div className="ml-auto text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Key</p>
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold text-white border-b-4 border-slate-600">
              {clickedKey.key}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Grid */}
      <div className="bg-slate-900 rounded-2xl p-4 space-y-2 overflow-x-auto">
        {/* Row offsets simulate real keyboard stagger */}
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex gap-1.5"
            style={{ paddingLeft: `${ri * (compact ? 6 : 10)}px` }}
          >
            {row.map((k) => {
              const type = getKeyType(k.normal, k.shift, layout);
              const isActive = clickedKey?.key === k.key;
              const displayChar = isShift ? k.shift : k.normal;

              return (
                <button
                  key={k.key}
                  onClick={() => handleKeyClick(k)}
                  className={`
                    relative flex-shrink-0 border-2 rounded-lg transition-all duration-150
                    ${compact ? 'w-9 h-10' : 'w-11 h-12'}
                    ${isActive
                      ? 'border-sky-500 bg-sky-50 scale-105 shadow-lg shadow-sky-200'
                      : KEY_TYPE_COLORS[type]
                    }
                    ${type === 'empty' ? 'cursor-default' : 'cursor-pointer hover:scale-105 hover:shadow-md'}
                  `}
                >
                  {/* Shift character — top right */}
                  <span className={`absolute top-0.5 right-1 ${compact ? 'text-[7px]' : 'text-[8px]'} text-slate-400 leading-none`}
                    style={{ fontFamily: 'sans-serif' }}>
                    {k.shift}
                  </span>
                  {/* Main character */}
                  <span className={`block text-center ${compact ? 'text-sm' : 'text-base'} font-bold text-slate-800 leading-none mt-2`}
                    style={{ fontFamily: 'sans-serif' }}>
                    {displayChar || ''}
                  </span>
                  {/* Physical key label — bottom */}
                  <span className={`absolute bottom-0.5 left-1 ${compact ? 'text-[7px]' : 'text-[8px]'} text-slate-400 font-mono leading-none`}>
                    {k.key}
                  </span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Spacebar */}
        <div style={{ paddingLeft: `${3 * (compact ? 6 : 10)}px` }}>
          <div className={`${compact ? 'w-48 h-8' : 'w-64 h-10'} mx-auto border-2 border-slate-600 bg-slate-700 rounded-lg flex items-center justify-center`}>
            <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Space</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {[
          { type: 'consonant', label: 'Consonant (व्यंजन)', color: 'bg-sky-100 border-sky-300' },
          { type: 'vowel', label: 'Vowel (स्वर)', color: 'bg-emerald-100 border-emerald-300' },
          { type: 'matra', label: 'Matra (मात्रा)', color: 'bg-violet-100 border-violet-300' },
          { type: 'special', label: 'Special (विशेष)', color: 'bg-amber-100 border-amber-300' },
        ].map(item => (
          <div key={item.type} className={`flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-bold text-slate-600 ${item.color}`}>
            <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
            {item.label}
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
        <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-500">
          Kisi bhi key par click karein uska Hindi character bade roop mein dekhne ke liye. 
          Shift button dababakar shift mappings dekhin. 
          {layout === 'inscript'
            ? ' Inscript layout GoI standard hai — SSC CGL, CHSL, Steno ke liye.'
            : ' Remington Gail layout purane typewriter par aadharit hai — UP/Bihar/MP state exams ke liye.'}
        </p>
      </div>
    </div>
  );
};

export default HindiKeyboard;
