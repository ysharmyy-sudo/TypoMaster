import Sanscript from '@indic-transliteration/sanscript';
import type { TypingLanguage } from '../constants/typingLanguages';

export const getSanscriptScheme = (lang: TypingLanguage): string | null => {
  switch (lang) {
    case 'english':
      return null;

    // Devanagari
    case 'hindi_inscript':
    case 'hindi_remington':
    case 'marathi':
    case 'sanskrit':
    case 'nepali':
      return 'devanagari';

    // Major scripts
    case 'punjabi':
      return 'gurmukhi';
    case 'gujarati':
      return 'gujarati';
    case 'bengali':
      return 'bengali';
    case 'assamese':
      return 'assamese';
    case 'odia':
      return 'oriya';
    case 'tamil':
      return 'tamil';
    case 'telugu':
      return 'telugu';
    case 'kannada':
      return 'kannada';
    case 'malayalam':
      return 'malayalam';

    // Minority scripts (supported by Sanscript)
    case 'santali':
      return 'ol_chiki';
    case 'manipuri':
      return 'manipuri';
    case 'dogri_takri':
      return 'takri';
    case 'lepcha':
      return 'lepcha';
    case 'tibetan':
      return 'tibetan';
    case 'limbu':
      return 'limbu';

    // Perso-Arabic (not supported by Sanscript)
    case 'urdu':
    case 'kashmiri':
      return null;
  }
};

export const transliterateToSelectedLanguage = (romanText: string, lang: TypingLanguage): string => {
  const scheme = getSanscriptScheme(lang);
  if (!scheme) return romanText;

  // 'itrans' is ASCII-friendly and works well for quick typing (namaste -> नमस्ते).
  return Sanscript.t(romanText, 'itrans', scheme);
};

