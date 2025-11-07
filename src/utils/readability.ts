// Calculate Flesch Reading Ease score (0-100)
// Higher scores = easier to read
export const calculateReadabilityScore = (text: string): number => {
  if (!text.trim()) return 100;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0) return 100;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Simple syllable counter
const countSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  const vowels = 'aeiouy';
  let syllableCount = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }

  // Subtract silent 'e' at the end
  if (word.endsWith('e')) {
    syllableCount--;
  }

  return Math.max(1, syllableCount);
};

export const getReadabilityLabel = (score: number): { label: string; color: string; description: string } => {
  if (score >= 90) {
    return {
      label: 'Very Easy',
      color: 'text-green-600',
      description: 'Easily understood by 11-year-olds'
    };
  } else if (score >= 80) {
    return {
      label: 'Easy',
      color: 'text-green-500',
      description: 'Conversational English for consumers'
    };
  } else if (score >= 70) {
    return {
      label: 'Fairly Easy',
      color: 'text-lime-600',
      description: 'Easily understood by 13-year-olds'
    };
  } else if (score >= 60) {
    return {
      label: 'Standard',
      color: 'text-yellow-600',
      description: 'Easily understood by 15-year-olds'
    };
  } else if (score >= 50) {
    return {
      label: 'Fairly Difficult',
      color: 'text-orange-500',
      description: 'High school level'
    };
  } else if (score >= 30) {
    return {
      label: 'Difficult',
      color: 'text-orange-600',
      description: 'College level'
    };
  } else {
    return {
      label: 'Very Difficult',
      color: 'text-red-600',
      description: 'College graduate level'
    };
  }
};
