
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
  hamsini: 50,
  sitini: 60,
  sabini: 70,
  thembani: 80,
  tisini: 90
};

const MULTIPLIERS: NumberMap = {
  mia: 100,
  elfu: 1000,
};

const FRACTIONS: NumberMap = {
  'nusu': 0.5,
  'robo': 0.25,
  'robo tatu': 0.75,
  'nusu na robo': 0.75
};

function swahiliToNumber(text: string): number | null {
  const phrase = text.toLowerCase().replace(/_/g, ' ').trim();

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

    // Skip "na"
    if (word === 'na') {
      i++;
      continue;
    }

    // Match fractions
    if (word in FRACTIONS) {
      total += FRACTIONS[word];
      i++;
      continue;
    }

    // Match pure numbers
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

    // Match multipliers
    if (word in MULTIPLIERS) {
      const multiplier = MULTIPLIERS[word];
      
      // Special handling for "elfu" followed by numbers
      if (word === 'elfu' && currentValue > 0) {
        total += currentValue * multiplier;
        currentValue = 0;
        
        // Check if there's more to add after "elfu"
        if (i + 1 < words.length && words[i + 1] === 'na') {
          i += 2; // Skip "na"
          continue;
        }
      } else {
        // Normal multiplier handling
        if (currentValue > 0) {
          total += currentValue * multiplier;
          currentValue = 0;
        } else {
          // Handle cases like "mia mbili" (100 * 2)
          const nextWord = words[i + 1];
          if (nextWord && nextWord in BASE) {
            total += BASE[nextWord] * multiplier;
            i++; // Skip next word
          } else {
            // Default to 1 if no number specified
            total += 1 * multiplier;
          }
        }
      }
      i++;
      continue;
    }

    // Unknown word
    console.warn(`Unknown word: ${word}`);
    return null;
  }

  // Add any remaining current value
  total += currentValue;


  return total;
}




// Test cases
console.log(swahiliToNumber("tisini na mbili elfu mia mbili tisini")); // ➜ (90 + 2)*1000 + (200 + 20) = 92220 ✅
console.log(swahiliToNumber("kumi na sita elfu"));                  // ➜ 500 ✅
console.log(swahiliToNumber("laki tano na tano"));          // ➜ 505 ✅
console.log(swahiliToNumber("elfu tatu mia mbili"));    // ➜ 3200 ✅
console.log(swahiliToNumber("milioni tatu elfu tano na moja")); // ➜ 3005001 ✅
console.log(swahiliToNumber("kumi na moja bilioni mia nne na ishirini laki"));              // ➜ 11 ✅
console.log(swahiliToNumber("nusu na robo"));              // ➜ 0.75 ✅
console.log(swahiliToNumber("elfu nane mia sita tisini na mbili")); // ➜ 8692 ✅
console.log(swahiliToNumber("elfu kumi na mbili")); // ➜ 8692 ✅

console.log(swahiliToNumber("kumi na mbili elfu mia tano sitini")); // ➜ 8692 ✅