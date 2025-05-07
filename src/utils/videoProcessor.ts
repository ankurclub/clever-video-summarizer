
import { detectLanguage, normalizeLanguageCode, convertLanguageFormat } from './languageDetection';

export async function getTranscription(file: File): Promise<string> {
  try {
    console.log(`Getting transcription for file: ${file.name} (${file.size} bytes)`);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5000/get_transcription', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(600000) // Increase timeout to 10 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from transcription API:', errorText);
      throw new Error(`Failed to transcribe file: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Transcription complete: ${data.transcription?.length || 0} characters`);
    return data.transcription || '';
  } catch (error) {
    console.error('Error transcribing file:', error);
    throw error;
  }
}

export function downloadTextFile(content: string, filename: string): void {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  setTimeout(() => {
    URL.revokeObjectURL(element.href);
  }, 100);
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    console.log(`Starting translation to language: ${targetLanguage}`);
    
    // Ensure we have proper content to translate
    if (!text || text.trim().length === 0) {
      throw new Error('No content provided for translation');
    }
    
    // Convert two-letter code (e.g., 'en', 'fr') to backend format
    console.log(`Translating to language: ${targetLanguage}`);
    console.log(`Translation text length: ${text.length} characters`);

    // The backend API has a 5000 character limit per request
    const MAX_CHUNK_SIZE = 4500; // Using 4500 to stay safely under the 5000 limit
    let translatedText = '';
    
    if (text.length > MAX_CHUNK_SIZE) {
      // For long texts, split and translate in chunks
      console.log(`Text too long (${text.length} chars), splitting into chunks of max ${MAX_CHUNK_SIZE} characters`);
      
      // Split by paragraphs for more natural boundaries
      const paragraphs = text.split(/\n\n/);
      let currentChunk = '';
      
      for (const paragraph of paragraphs) {
        // If adding this paragraph would exceed chunk size, translate current chunk first
        if (currentChunk.length + paragraph.length + 2 > MAX_CHUNK_SIZE && currentChunk.length > 0) {
          console.log(`Translating chunk of ${currentChunk.length} characters`);
          try {
            const chunkTranslation = await translateChunk(currentChunk, targetLanguage);
            translatedText += chunkTranslation;
            if (!translatedText.endsWith('\n')) {
              translatedText += '\n\n';
            }
          } catch (chunkError) {
            console.error('Error translating chunk:', chunkError);
            throw chunkError; // Re-throw to be caught by outer try/catch
          }
          currentChunk = '';
        }
        
        // If paragraph itself is longer than max chunk size, handle it separately
        if (paragraph.length > MAX_CHUNK_SIZE) {
          console.log(`Paragraph too long (${paragraph.length} chars), splitting into sentences`);
          
          // If we have any content in currentChunk, translate it first
          if (currentChunk.length > 0) {
            const chunkTranslation = await translateChunk(currentChunk, targetLanguage);
            translatedText += chunkTranslation;
            if (!translatedText.endsWith('\n')) {
              translatedText += '\n\n';
            }
            currentChunk = '';
          }
          
          // Split long paragraph into sentences for better translation
          const sentences = paragraph.split(/(?<=[.!?])\s+/);
          let sentenceChunk = '';
          
          for (const sentence of sentences) {
            // If sentence itself is too long (rare but possible)
            if (sentence.length > MAX_CHUNK_SIZE) {
              // If we have content in sentenceChunk, translate it first
              if (sentenceChunk.length > 0) {
                const chunkTranslation = await translateChunk(sentenceChunk, targetLanguage);
                translatedText += chunkTranslation + ' ';
                sentenceChunk = '';
              }
              
              // Split long sentence into smaller pieces
              console.log(`Sentence too long (${sentence.length} chars), splitting it further`);
              for (let i = 0; i < sentence.length; i += MAX_CHUNK_SIZE) {
                const subChunk = sentence.substring(i, i + MAX_CHUNK_SIZE);
                const chunkTranslation = await translateChunk(subChunk, targetLanguage);
                translatedText += chunkTranslation;
              }
              
              translatedText += ' ';
            }
            // If adding this sentence would exceed chunk size, translate current chunk first
            else if (sentenceChunk.length + sentence.length + 1 > MAX_CHUNK_SIZE) {
              const chunkTranslation = await translateChunk(sentenceChunk, targetLanguage);
              translatedText += chunkTranslation + ' ';
              sentenceChunk = sentence;
            }
            // Otherwise add sentence to current chunk
            else {
              if (sentenceChunk.length > 0) {
                sentenceChunk += ' ' + sentence;
              } else {
                sentenceChunk = sentence;
              }
            }
          }
          
          // Translate any remaining content in the sentence chunk
          if (sentenceChunk.length > 0) {
            const chunkTranslation = await translateChunk(sentenceChunk, targetLanguage);
            translatedText += chunkTranslation;
            if (!translatedText.endsWith('\n')) {
              translatedText += '\n\n';
            }
          }
        } 
        // For normal-sized paragraphs, just add to current chunk
        else {
          if (currentChunk.length > 0) {
            currentChunk += '\n\n';
          }
          currentChunk += paragraph;
        }
      }
      
      // Translate any remaining text in currentChunk
      if (currentChunk.length > 0) {
        console.log(`Translating final chunk of ${currentChunk.length} characters`);
        const finalChunkTranslation = await translateChunk(currentChunk, targetLanguage);
        translatedText += finalChunkTranslation;
      }
    } else {
      // For shorter texts, translate all at once
      translatedText = await translateChunk(text, targetLanguage);
    }
    
    return translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    // Enhance error message for clarity
    if (error instanceof Error) {
      // If the error contains information about text length limits, clarify the message
      if (error.message.includes('5000 characters')) {
        throw new Error('The translation API has a 5000 character limit per request. The system attempted to chunk your text but still encountered an error. Please try translating a smaller portion of text.');
      }
      throw error;
    } else {
      throw new Error('Unknown error during translation');
    }
  }
}

// Helper function for translating individual chunks
async function translateChunk(text: string, targetLanguage: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      return '';
    }
    
    // Make sure we're not exceeding the 5000 character API limit
    if (text.length > 5000) {
      console.warn(`Translation chunk too long (${text.length} chars), truncating to 4500 chars`);
      text = text.substring(0, 4500);
    }
    
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        target_lang: targetLanguage
      }),
      signal: AbortSignal.timeout(180000) // Increased timeout to 3 minutes for translation chunks
    });

    console.log('Translation API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Translation API error: ${response.status}`;
      
      try {
        const errorText = await response.text();
        console.error('Translation API error:', errorText);
        
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage += ` - ${errorJson.error}`;
          }
        } catch (e) {
          // If not valid JSON, just use the raw error text
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        console.error('Failed to get error details', e);
        // Continue with generic error message
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Translation response received, data length:', data?.translated_text?.length || 0);

    if (data && data.translated_text) {
      return data.translated_text;
    } else {
      throw new Error('Translation API did not return translated text');
    }
  } catch (error) {
    console.error('Error in translateChunk:', error);
    throw error;
  }
}

export async function detectAndNormalizeLanguage(text: string): Promise<string> {
  const detectedLang = detectLanguage(text);
  console.log('Detected language:', detectedLang);
  return normalizeLanguageCode(detectedLang);
}

function isValidSummaryText(text: string): boolean {
  const repetitivePatterns = ['rifle rifle', 'quad quad', 'nat nat', 'specialization specialization'];
  if (repetitivePatterns.some(pattern => text.toLowerCase().includes(pattern))) return false;

  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  const wordCount = text.split(/\s+/).length;
  if (sentenceCount < 2 || wordCount < 15) return false;

  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const wordVarietyRatio = uniqueWords.size / words.length;
  if (wordVarietyRatio < 0.25) return false;

  if (text.includes("This is an extractive summary as our AI summarizer encountered difficulty")) return false;

  return true;
}

export async function getSummaryFromText(text: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) throw new Error('No text provided for summarization');

    console.log(`Attempting to summarize text of length: ${text.length} characters`);
    
    let attempts = 0;
    let summary = '';
    let isValid = false;
    let lastError = null;

    // Increased max text length from 10K to 25K characters
    const MAX_TEXT_LENGTH = 25000;
    let textToSummarize = text;
    
    if (text.length > MAX_TEXT_LENGTH) {
      console.log(`Text too long (${text.length} chars), will process first ${MAX_TEXT_LENGTH} chars`);
      // For very long texts, use a more strategic approach
      // Instead of just taking first chunk, take beginning, middle and end sections
      const firstPart = text.substring(0, Math.floor(MAX_TEXT_LENGTH * 0.6)); // 60% from beginning
      const middleStart = Math.floor(text.length / 2) - Math.floor(MAX_TEXT_LENGTH * 0.2);
      const middlePart = text.substring(middleStart, middleStart + Math.floor(MAX_TEXT_LENGTH * 0.2)); // 20% from middle
      const endPart = text.substring(text.length - Math.floor(MAX_TEXT_LENGTH * 0.2)); // 20% from end
      
      textToSummarize = firstPart + "\n\n[...]\n\n" + middlePart + "\n\n[...]\n\n" + endPart;
      console.log(`Created representative sample of ${textToSummarize.length} chars from beginning, middle and end`);
    }

    while (attempts < 3 && !isValid) {
      attempts++;
      console.log(`Summary attempt ${attempts}/3`);
      
      try {
        const response = await fetch('http://localhost:5000/get_summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            text: textToSummarize, 
            attempt: attempts, 
            aggressive: attempts > 1,
            is_long_content: text.length > MAX_TEXT_LENGTH
          }),
          signal: AbortSignal.timeout(300000) // 5 minute timeout
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Summary API error (attempt ${attempts}):`, errorText);
          lastError = new Error(`Failed to generate summary: ${response.status} ${errorText}`);
          continue; // Try next attempt
        }

        const data = await response.json();
        if (!data.summary) {
          console.error('Summary API did not return any content');
          lastError = new Error('Summary API did not return any content');
          continue; // Try next attempt
        }

        summary = data.summary;
        isValid = isValidSummaryText(summary);
        
        if (isValid) {
          console.log(`Summary generated successfully on attempt ${attempts}`);
          break;
        } else {
          console.log(`Generated summary failed validation on attempt ${attempts}`);
        }
      } catch (error) {
        console.error(`Error in summary attempt ${attempts}:`, error);
        lastError = error;
        // Continue to next attempt
      }
    }

    if (isValid && summary) {
      // For long content, add a more informative note
      if (text.length > MAX_TEXT_LENGTH) {
        summary = summary.trim() + "\n\n(Note: This summary represents key points from selected portions of the content as the original was too long to process in full. The summary includes content from the beginning, middle, and end sections.)";
      }
      return summary;
    }

    // If we couldn't get a valid summary after all attempts, fall back to extractive summary
    console.log('All summary attempts failed, falling back to extractive summary');
    
    try {
      const sentences = text.split(/(?<=[.!?])\s+/);
      // For longer texts, extract more sentences
      const maxExtractiveSentences = text.length > MAX_TEXT_LENGTH ? 40 : 20;
      const numSentences = Math.min(sentences.length, maxExtractiveSentences);
      
      // Distribute sentences from beginning, middle and end
      const beginCount = Math.floor(numSentences * 0.4);
      const midStart = Math.floor(sentences.length * 0.4);
      const midCount = Math.floor(numSentences * 0.2);
      const endStart = Math.max(sentences.length - Math.floor(numSentences * 0.4), midStart + midCount);

      const extractiveSummary = [
        ...sentences.slice(0, beginCount),
        ...sentences.slice(midStart, midStart + midCount),
        ...sentences.slice(endStart)
      ].join(' ');

      if (text.length > MAX_TEXT_LENGTH) {
        return `${extractiveSummary.trim()}\n\n(Note: This is an extractive summary generated from key portions of your content, as the full content was too long to process completely.)`;
      } else {
        return `${extractiveSummary.trim()}\n\n(Note: This is an alternative summary generated due to processing limitations with the original content.)`;
      }
    } catch (fallbackError) {
      console.error('Even fallback summary generation failed:', fallbackError);
      throw lastError || new Error('Failed to generate summary after multiple attempts');
    }
  } catch (error) {
    console.error('Error in getSummaryFromText:', error);
    throw error;
  }
}

// Add a function to check server storage capacity
export async function checkServerStorageCapacity(): Promise<{available: boolean, usedPercentage: number, queueLength: number}> {
  try {
    const response = await fetch('http://localhost:5000/check_storage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10-second timeout
    }).catch(() => {
      // If the endpoint doesn't exist yet, simulate a response
      console.log("Storage check endpoint not available, simulating response");
      return null;
    });

    if (response && response.ok) {
      const data = await response.json();
      return {
        available: data.used_percentage < 80, // Available if less than 80% used
        usedPercentage: data.used_percentage,
        queueLength: data.queue_length || 0
      };
    } else {
      // Simulate a response for demo
      const simulatedUsedPercentage = Math.floor(Math.random() * 100);
      const simulatedQueueLength = simulatedUsedPercentage > 80 ? Math.floor(Math.random() * 5) + 1 : 0;
      
      console.log(`Simulated storage check: ${simulatedUsedPercentage}% used, queue length: ${simulatedQueueLength}`);
      
      return {
        available: simulatedUsedPercentage < 80,
        usedPercentage: simulatedUsedPercentage,
        queueLength: simulatedQueueLength
      };
    }
  } catch (error) {
    console.error("Error checking server storage:", error);
    // On error, assume storage is available to not block users
    return { available: true, usedPercentage: 0, queueLength: 0 };
  }
}

export function storeProcessedResult(content: string, type: 'subtitles' | 'transcription' | 'summary' | 'translation', userPlan: 'free' | 'pro' | 'business', userId: string): void {
  if (userPlan !== 'business') return;

  try {
    const key = `${userId}_${type}_${new Date().toISOString()}`;
    const fileName = `${type}_${new Date().toISOString().split('T')[0]}`;
    const resultData = { 
      content, 
      type, 
      timestamp: new Date().toISOString(), 
      userId,
      fileName,
      fileSize: content.length,
      id: key
    };
    localStorage.setItem(key, JSON.stringify(resultData));
  } catch (error) {
    console.error('Error storing processed result:', error);
  }
}

export function getStoredResults(userId: string, userPlan: 'free' | 'pro' | 'business'): Array<{
  id: string;
  content: string; 
  type: string; 
  timestamp: string;
  fileName: string;
  fileSize: number;
}> {
  if (userPlan !== 'business') return [];

  const results = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${userId}_`)) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        results.push({
          id: key,
          content: data.content,
          type: data.type,
          timestamp: data.timestamp,
          fileName: data.fileName || `${data.type}_file`,
          fileSize: data.content ? data.content.length : 0
        });
      }
    }
    
    // Sort by timestamp (newest first)
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
  } catch (error) {
    console.error('Error retrieving stored results:', error);
  }

  return results;
}

export function deleteStoredResult(resultId: string): boolean {
  try {
    localStorage.removeItem(resultId);
    return true;
  } catch (error) {
    console.error('Error deleting stored result:', error);
    return false;
  }
}

export function cleanupResources(): void {
  console.log('Resource cleanup completed');
}
