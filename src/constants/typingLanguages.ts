export type TypingScript =
  | 'latin'
  | 'devanagari'
  | 'gurmukhi'
  | 'gujarati'
  | 'bengali_assamese'
  | 'odia'
  | 'tamil'
  | 'telugu'
  | 'kannada'
  | 'malayalam'
  | 'perso_arabic'
  | 'ol_chiki'
  | 'meitei_mayek'
  | 'takri'
  | 'lepcha'
  | 'tibetan'
  | 'sirijonga';

export type TypingLanguage =
  | 'english'
  | 'hindi_inscript'
  | 'hindi_remington'
  | 'marathi'
  | 'sanskrit'
  | 'nepali'
  | 'punjabi'
  | 'gujarati'
  | 'bengali'
  | 'assamese'
  | 'odia'
  | 'tamil'
  | 'telugu'
  | 'kannada'
  | 'malayalam'
  | 'urdu'
  | 'kashmiri'
  | 'santali'
  | 'manipuri'
  | 'dogri_takri'
  | 'lepcha'
  | 'tibetan'
  | 'limbu';

export type TypingLanguageOption = {
  id: TypingLanguage;
  label: string;
  sub: string;
  script: TypingScript;
  /** BCP-47 language tag used for <textarea lang=".."> */
  langTag: string;
  /** Text direction */
  dir: 'ltr' | 'rtl';
};

export const TYPING_LANGUAGE_OPTIONS: TypingLanguageOption[] = [
  { id: 'english', label: 'English', sub: 'Roman / Latin', script: 'latin', langTag: 'en', dir: 'ltr' },

  // Devanagari
  { id: 'hindi_inscript', label: 'Hindi — Inscript', sub: 'Devanagari', script: 'devanagari', langTag: 'hi', dir: 'ltr' },
  { id: 'hindi_remington', label: 'Hindi — Remington', sub: 'Devanagari', script: 'devanagari', langTag: 'hi', dir: 'ltr' },
  { id: 'marathi', label: 'Marathi', sub: 'Devanagari', script: 'devanagari', langTag: 'mr', dir: 'ltr' },
  { id: 'sanskrit', label: 'Sanskrit', sub: 'Devanagari', script: 'devanagari', langTag: 'sa', dir: 'ltr' },
  { id: 'nepali', label: 'Nepali', sub: 'Devanagari', script: 'devanagari', langTag: 'ne', dir: 'ltr' },

  // Other major scripts
  { id: 'punjabi', label: 'Punjabi', sub: 'Gurmukhi', script: 'gurmukhi', langTag: 'pa', dir: 'ltr' },
  { id: 'gujarati', label: 'Gujarati', sub: 'Gujarati', script: 'gujarati', langTag: 'gu', dir: 'ltr' },
  { id: 'bengali', label: 'Bengali', sub: 'Bengali-Assamese', script: 'bengali_assamese', langTag: 'bn', dir: 'ltr' },
  { id: 'assamese', label: 'Assamese', sub: 'Bengali-Assamese', script: 'bengali_assamese', langTag: 'as', dir: 'ltr' },
  { id: 'odia', label: 'Odia', sub: 'Odia', script: 'odia', langTag: 'or', dir: 'ltr' },
  { id: 'tamil', label: 'Tamil', sub: 'Tamil', script: 'tamil', langTag: 'ta', dir: 'ltr' },
  { id: 'telugu', label: 'Telugu', sub: 'Telugu', script: 'telugu', langTag: 'te', dir: 'ltr' },
  { id: 'kannada', label: 'Kannada', sub: 'Kannada', script: 'kannada', langTag: 'kn', dir: 'ltr' },
  { id: 'malayalam', label: 'Malayalam', sub: 'Malayalam', script: 'malayalam', langTag: 'ml', dir: 'ltr' },

  // Perso-Arabic / Nastaliq
  { id: 'urdu', label: 'Urdu', sub: 'Perso‑Arabic / Nastaliq', script: 'perso_arabic', langTag: 'ur', dir: 'rtl' },
  // Kashmiri is commonly written in Perso-Arabic in India
  { id: 'kashmiri', label: 'Kashmiri', sub: 'Perso‑Arabic / Nastaliq', script: 'perso_arabic', langTag: 'ks', dir: 'rtl' },

  // NE / minority scripts (range-based keyboard)
  { id: 'santali', label: 'Santali', sub: 'Ol Chiki', script: 'ol_chiki', langTag: 'sat', dir: 'ltr' },
  { id: 'manipuri', label: 'Manipuri', sub: 'Meitei Mayek', script: 'meitei_mayek', langTag: 'mni', dir: 'ltr' },
  { id: 'dogri_takri', label: 'Dogri (Old)', sub: 'Takri', script: 'takri', langTag: 'doi', dir: 'ltr' },
  { id: 'lepcha', label: 'Lepcha', sub: 'Lepcha', script: 'lepcha', langTag: 'lep', dir: 'ltr' },
  { id: 'tibetan', label: 'Tibetan', sub: 'Tibetan', script: 'tibetan', langTag: 'bo', dir: 'ltr' },
  { id: 'limbu', label: 'Limbu', sub: 'Sirijonga', script: 'sirijonga', langTag: 'lif', dir: 'ltr' },
];

export const getLanguageOption = (lang: TypingLanguage): TypingLanguageOption =>
  TYPING_LANGUAGE_OPTIONS.find(l => l.id === lang) ?? TYPING_LANGUAGE_OPTIONS[0];

const chunk = (arr: string[], size: number) => {
  const out: string[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const makeRangeChars = (start: number, end: number) => {
  const chars: string[] = [];
  for (let cp = start; cp <= end; cp++) {
    chars.push(String.fromCodePoint(cp));
  }
  // Keep only printable-ish characters (drop obvious whitespace and controls)
  return chars.filter((c) => c.trim().length > 0);
};

/**
 * simple-keyboard layout generator:
 * - returns { default: [...] } rows
 * - includes {bksp} and {space}
 */
export const getVirtualKeyboardLayout = (lang: TypingLanguage) => {
  // QWERTY (English)
  if (lang === 'english') {
    return {
      default: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'q w e r t y u i o p',
        'a s d f g h j k l',
        'z x c v b n m',
        '{space}',
      ],
    };
  }

  // Devanagari (Hindi/Marathi/Sanskrit/Nepali + Hindi layouts)
  if (['hindi_inscript', 'hindi_remington', 'marathi', 'sanskrit', 'nepali'].includes(lang)) {
    return {
      default: [
        'अ आ इ ई उ ऊ ए ऐ ओ औ {bksp}',
        'क ख ग घ ङ च छ ज झ ञ',
        'ट ठ ड ढ ण त थ द ध न',
        'प फ ब भ म य र ल व श ष स ह',
        'ा ि ी ु ू े ै ो ौ ् ं ः ँ ।',
        '{space}',
      ],
    };
  }

  if (lang === 'punjabi') {
    return {
      default: [
        'ੳ ਅ ੲ ਆ ਇ ਈ ਉ ਊ ਏ ਐ ਓ ਔ {bksp}',
        'ਕ ਖ ਗ ਘ ਙ ਚ ਛ ਜ ਝ ਞ',
        'ਟ ਠ ਡ ਢ ਣ ਤ ਥ ਦ ਧ ਨ',
        'ਪ ਫ ਬ ਭ ਮ ਯ ਰ ਲ ਵ ਸ ਹ ੜ',
        'ਾ ਿ ੀ ੁ ੂ ੇ ੈ ੋ ੌ ੍ ਂ ਃ ।',
        '{space}',
      ],
    };
  }

  if (lang === 'gujarati') {
    return {
      default: [
        'અ આ ઇ ઈ ઉ ઊ એ ઐ ઓ ઔ {bksp}',
        'ક ખ ગ ઘ ઙ ચ છ જ ઝ ઞ',
        'ટ ઠ ડ ઢ ણ ત થ દ ધ ન',
        'પ ફ બ ભ મ ય ર લ વ શ ષ સ હ ળ',
        'ા િ ી ુ ૂ ે ૈ ો ૌ ્ ં ઃ ।',
        '{space}',
      ],
    };
  }

  if (lang === 'bengali' || lang === 'assamese') {
    return {
      default: [
        'অ আ ই ঈ উ ঊ এ ঐ ও ঔ {bksp}',
        'ক খ গ ঘ ঙ চ ছ জ ঝ ঞ',
        'ট ঠ ড ঢ ণ ত থ দ ধ ন',
        'প ফ ব ভ ম য র ল শ ষ স হ',
        'া ি ী ু ূ ে ৈ ো ৌ ্ ং ঃ ঁ ।',
        '{space}',
      ],
    };
  }

  if (lang === 'odia') {
    return {
      default: [
        'ଅ ଆ ଇ ଈ ଉ ଊ ଏ ଐ ଓ ଔ {bksp}',
        'କ ଖ ଗ ଘ ଙ ଚ ଛ ଜ ଝ ଞ',
        'ଟ ଠ ଡ ଢ ଣ ତ ଥ ଦ ଧ ନ',
        'ପ ଫ ବ ଭ ମ ଯ ର ଲ ଳ ଶ ଷ ସ ହ',
        'ା ି ୀ ୁ ୂ େ ୈ ୋ ୌ ୍ ଂ ଃ ଁ ।',
        '{space}',
      ],
    };
  }

  if (lang === 'tamil') {
    return {
      default: [
        'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ {bksp}',
        'க ங ச ஞ ட ண த ந ப ம',
        'ய ர ல வ ழ ள ற ன',
        'ஜ ஷ ஸ ஹ',
        'ா ி ீ ு ூ ெ ே ை ொ ோ ௌ ் ।',
        '{space}',
      ],
    };
  }

  if (lang === 'telugu') {
    return {
      default: [
        'అ ఆ ఇ ఈ ఉ ఊ ఎ ఏ ఐ ఒ ఓ ఔ {bksp}',
        'క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ',
        'ట ఠ డ ఢ ణ త థ ద ధ న',
        'ప ఫ బ భ మ య ర ల వ శ ష స హ ళ',
        'ా ి ీ ు ూ ె ే ై ొ ో ౌ ్ ం ః ।',
        '{space}',
      ],
    };
  }

  if (lang === 'kannada') {
    return {
      default: [
        'ಅ ಆ ಇ ಈ ಉ ಊ ಎ ಏ ಐ ಒ ಓ ಔ {bksp}',
        'ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ',
        'ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ',
        'ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ',
        'ಾ ಿ ೀ ು ೂ ೆ ೇ ೈ ೊ ೋ ೌ ್ ಂ ಃ ।',
        '{space}',
      ],
    };
  }

  if (lang === 'malayalam') {
    return {
      default: [
        'അ ആ ഇ ഈ ഉ ഊ എ ഏ ഐ ഒ ഓ ഔ {bksp}',
        'ക ഖ ഗ ഘ ങ ച ഛ ജ ഝ ഞ',
        'ട ഠ ഡ ഢ ണ ത ഥ ദ ധ ന',
        'പ ഫ ബ ഭ മ യ ര ല വ ശ ഷ സ ഹ ള',
        'ാ ി ീ ു ൂ െ േ ൈ ൊ ോ ൌ ് ം ഃ ।',
        '{space}',
      ],
    };
  }

  // Urdu / Kashmiri (Perso-Arabic) — basic letter palette
  if (lang === 'urdu' || lang === 'kashmiri') {
    return {
      default: [
        '۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ ۰ {bksp}',
        'ا ب پ ت ٹ ث ج چ ح خ',
        'د ڈ ذ ر ڑ ز ژ س ش ص ض',
        'ط ظ ع غ ف ق ک گ ل م ن ں و ہ ھ ء ی ے',
        'َ ِ ُ ْ ّ ۔ ، ؟ ؛',
        '{space}',
      ],
    };
  }

  // Range-based keyboards for less common scripts
  const rangeByLang: Record<TypingLanguage, [number, number]> = {
    santali: [0x1c50, 0x1c7f], // Ol Chiki
    manipuri: [0xabc0, 0xabff], // Meitei Mayek
    dogri_takri: [0x11680, 0x116cf], // Takri
    lepcha: [0x1c00, 0x1c4f], // Lepcha
    tibetan: [0x0f00, 0x0fff], // Tibetan
    limbu: [0x1900, 0x194f], // Limbu (Sirijonga)
    // dummy (never hit)
    english: [0x0, 0x0],
    hindi_inscript: [0x0, 0x0],
    hindi_remington: [0x0, 0x0],
    marathi: [0x0, 0x0],
    sanskrit: [0x0, 0x0],
    nepali: [0x0, 0x0],
    punjabi: [0x0, 0x0],
    gujarati: [0x0, 0x0],
    bengali: [0x0, 0x0],
    assamese: [0x0, 0x0],
    odia: [0x0, 0x0],
    tamil: [0x0, 0x0],
    telugu: [0x0, 0x0],
    kannada: [0x0, 0x0],
    malayalam: [0x0, 0x0],
    urdu: [0x0, 0x0],
    kashmiri: [0x0, 0x0],
  };

  const [start, end] = rangeByLang[lang] ?? [0x0, 0x0];
  const chars = makeRangeChars(start, end);
  const rows = chunk(chars.slice(0, 60), 12).map(r => r.join(' '));

  return {
    default: [
      ...(rows.length ? rows : ['{bksp}']),
      '{bksp}',
      '{space}',
    ],
  };
};

export const makeDefaultPracticeText = (lang: TypingLanguage) => {
  if (lang === 'english') return 'Start typing here to begin the test.';
  if (lang === 'urdu' || lang === 'kashmiri') return 'یہاں ٹائپ کرنا شروع کریں۔';

  const layout = getVirtualKeyboardLayout(lang).default
    .join(' ')
    .replaceAll('{bksp}', '')
    .replaceAll('{space}', ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Build a short practice line from the available keys.
  return layout.slice(0, 200);
};

