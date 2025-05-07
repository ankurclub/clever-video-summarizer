
import { franc } from 'franc';

export const languageOptions = [
  { value: 'en', label: 'English', code: 'eng' },
  { value: 'zh', label: 'Chinese', code: 'cmn' },
  { value: 'hi', label: 'Hindi', code: 'hin' },
  { value: 'es', label: 'Spanish', code: 'spa' },
  { value: 'ar', label: 'Arabic', code: 'ara' },
  { value: 'fr', label: 'French', code: 'fra' },
  { value: 'bn', label: 'Bengali', code: 'ben' },
  { value: 'pt', label: 'Portuguese', code: 'por' },
  { value: 'ru', label: 'Russian', code: 'rus' },
  { value: 'id', label: 'Indonesian', code: 'ind' },
  { value: 'ur', label: 'Urdu', code: 'urd' },
  { value: 'de', label: 'German', code: 'deu' },
  { value: 'ja', label: 'Japanese', code: 'jpn' },
];

// This function attempts to detect language and returns a language code
export const detectLanguage = (text: string): string => {
  if (!text || text.length < 10) {
    console.log('Text too short for reliable detection, defaulting to English');
    return 'en';
  }
  
  const detectedLangCode = franc(text);
  console.log('Detected language code from franc:', detectedLangCode);
  
  // Handle 'und' (undefined) result from franc
  if (detectedLangCode === 'und') {
    console.log('Language detection uncertain, defaulting to English');
    return 'en';
  }
  
  // Find the language in our options list
  const foundLanguage = languageOptions.find(lang => lang.code === detectedLangCode);
  console.log('Matched to language option:', foundLanguage);
  
  // Return detected language or default to English
  return foundLanguage?.value || 'en';
};

// Get display name for a language code
export const getLanguageLabel = (value: string | null): string => {
  if (!value) return "Select language";
  
  const language = languageOptions.find(lang => lang.value === value);
  if (language) {
    return language.label;
  }
  
  // Try matching three-letter code if no direct match found
  const languageByCode = languageOptions.find(lang => lang.code === value);
  if (languageByCode) {
    return languageByCode.label;
  }
  
  return 'Unknown';
};

// Convert language code format (e.g., from 'en' to 'eng' or vice versa)
export const convertLanguageFormat = (code: string, toThreeLetters: boolean = false): string => {
  if (!code) return toThreeLetters ? 'eng' : 'en';
  
  console.log(`Converting language code: ${code}, to three letters: ${toThreeLetters}`);
  
  // If converting to three-letter code
  if (toThreeLetters) {
    const language = languageOptions.find(lang => lang.value === code);
    console.log('Found language for conversion:', language);
    return language?.code || 'eng'; // Default to 'eng' if not found
  }
  
  // If converting to two-letter code
  const language = languageOptions.find(lang => lang.code === code);
  console.log('Found language for conversion:', language);
  return language?.value || 'en'; // Default to 'en' if not found
};

// For use with video processor to ensure consistent language format
export const normalizeLanguageCode = (langCode: string | null): string => {
  if (!langCode) return 'en';
  
  // Check if it's already a two-letter code in our options
  if (languageOptions.some(lang => lang.value === langCode)) {
    return langCode;
  }
  
  // Check if it's a three-letter code and convert
  const language = languageOptions.find(lang => lang.code === langCode);
  if (language) {
    return language.value;
  }
  
  // Default to English if we can't match
  console.log(`Could not normalize language code ${langCode}, defaulting to English`);
  return 'en';
};
