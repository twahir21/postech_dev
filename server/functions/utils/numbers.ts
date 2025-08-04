// numbers.ts
type NumberMap = Record<string, number>;

const BASE: NumberMap = {
  sifuri: 0,
  moja: 1,
  mbili: 2,
  tatu: 3,
  nne: 4,
  tano: 5,
  sita: 6,
  saba: 7,
  nane: 8,
  tisa: 9,
  kumi: 10,
  ishirini: 20,
  thelathini: 30,
  arobaini: 40,
  arubaini: 40,
  hamsini: 50,
  sitini: 60,
  sabini: 70,
  thembani: 80,
  tisini: 90
};

const MULTIPLIERS: NumberMap = {
  mia: 100,
  elfu: 1000,
  laki: 100000,
  milioni: 1000000
};

const FRACTIONS: NumberMap = {
  'nusu': 0.5,
  'robo': 0.25,
  'robo tatu': 0.75,
  'nusu na robo': 0.75
};

export function swahiliToNumber(text: string): number | null {
  const phrase = text
    .toLowerCase()
    .replace(/[_'",.?]/g, ' ')  // replace undesired characters with space
    .replace(/\s+/g, ' ')      // normalize multiple spaces
    .trim();

    console.log(phrase);


  // Direct match for known compound fractions
  if (FRACTIONS[phrase]) {
    return FRACTIONS[phrase];
  }

  const words = phrase.split(/\s+/);
  let total = 0;
  let currentValue = 0;
  let i = 0;

  while (i < words.length) {
    const word = words[i];
    let consumedWords = 1;

    // Skip "na" and unknown words
    if (word === 'na') {
      i++;
      continue;
    }

    // Try to match multi-word fractions first (e.g., "robo tatu")
    if (i + 1 < words.length) {
      const twoWordPhrase = `${word} ${words[i + 1]}`;
      if (twoWordPhrase in FRACTIONS) {
        total += FRACTIONS[twoWordPhrase];
        i += 2;
        continue;
      }
    }

    // Match single-word fractions
    if (word in FRACTIONS) {
      total += FRACTIONS[word];
      i++;
      continue;
    }

    // Match pure numbers (digits)
    if (!isNaN(parseFloat(word))) {
      total += parseFloat(word);
      i++;
      continue;
    }

    // Match base numbers
    if (word in BASE) {
      currentValue += BASE[word];
      i++;
      continue;
    }

    // Match multipliers with lookahead
    if (word in MULTIPLIERS) {
      const multiplier = MULTIPLIERS[word];
      let multiplierValue = 1;

      // Check if next word is a number (e.g., "mia mbili" → 200)
      if (i + 1 < words.length && words[i + 1] in BASE) {
        multiplierValue = BASE[words[i + 1]];
        consumedWords = 2;
      }
      // Or if we have accumulated currentValue (e.g., "mbili mia" → 200)
      else if (currentValue > 0) {
        multiplierValue = currentValue;
        currentValue = 0;
      }

      total += multiplierValue * multiplier;
      i += consumedWords;
      continue;
    }

    // Unknown word - skip but preserve current state
    i++;
  }

  // Add any remaining current value
  return total + currentValue;
}
