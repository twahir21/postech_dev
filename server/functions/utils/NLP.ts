// swahili-nlp.ts

const verbMap: Record<string, string> = {
  nimeuza: 'nimeuza', niliuza: 'nimeuza', nauza: 'nimeuza',
  nimenunua: 'nimenunua', niliagiza: 'nimenunua',
  nimetumia: 'nimetumia', nilitumia: 'nimetumia',
  nimemkopesha: 'nimemkopesha', nilikopesha: 'nimemkopesha', ninamkopesha: 'nimemkopesha'
};

const similarity = (a: string, b: string) => {
  let matches = 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / len;
};

export function detectSwahiliTransaction(text: string) {
  const normalized = text.toLowerCase().trim();
  const words = normalized.split(/\s+/);

  // 1. Detect Action
  let action = '';
  for (const word of words) {
    for (const key in verbMap) {
      if (similarity(word, key) > 0.7) {
        action = verbMap[key];
        break;
      }
    }
    if (action) break;
  }

  if (!action) throw new Error("Hatua (action) haijatambulika. Tafadhali ongea tena kwa utaratibu.");

  // 2. Detect Punguzo
  const punguzoMatch = normalized.match(/punguzo\s+([a-z0-9\s]+)/);
  let punguzo: number = 0;

  if (punguzoMatch) {
    const parsed = swahiliToNumber(punguzoMatch[1].trim());
    if (typeof parsed !== 'number' || isNaN(parsed)) {
      throw new Error("Kama punguzo ni juu ya 10,000 andika tarakimu, usitumie mic.");
    }
    punguzo = parsed;
  }

  // 3. Detect Unit + Quantity
  let unit = '';
  let quantity: string | null = null;
  let foundIndex = -1;

  for (let i = 0; i < words.length - 1; i++) {
    const parsed = swahiliToNumber(words[i + 1]);
    if (parsed !== null && !isNaN(parsed)) {
      unit = words[i];
      quantity = parsed.toString();
      foundIndex = i;
      break;
    }
  }

  if (quantity === null) {
    for (let i = 0; i < words.length; i++) {
      const parsed = swahiliToNumber(words[i]);
      if (parsed !== null && !isNaN(parsed)) {
        quantity = parsed.toString();
        foundIndex = i;
        break;
      }
    }
  }

  if (!quantity || isNaN(Number(quantity))) {
    throw new Error("Kiasi cha bidhaa hakijatambulika vizuri. Tafadhali ongea tena.");
  }

  // 4. Extract Product
  const afterAction = words.slice(1);
  const ignoreWords = ['punguzo', ...Object.keys(verbMap)];
  const filtered = afterAction.filter(w => !ignoreWords.includes(w));
  let product = filtered.join(' ');

  if (foundIndex > 0) {
    product = afterAction.slice(0, foundIndex).join(' ').trim();
  }

  if (!product || product.length < 2) {
    throw new Error("Bidhaa haijatambulika. Tafadhali ongea tena kwa utaratibu.");
  }

  // ✅ Output
  console.log('🛠 Action:', action);
  console.log('🛒 Product:', product);
  console.log('📏 Unit:', unit || 'Haijatajwa');
  console.log('🔢 Quantity:', quantity);
  console.log('💸 Punguzo:', punguzo);

  return {
    action,
    product,
    unit,
    quantity: Number(quantity),
    punguzo
  };
}


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

    // Enforce limit
  if (total > 10000) {
    console.warn(`Value exceeds 10,000: ${total}`);
    return null; // or throw new Error("Value too large");
  }

  return total;
}

