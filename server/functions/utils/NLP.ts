// swahili-nlp.ts

const verbMap: Record<string, string> = {
  nimeuza: 'nimeuza', niliuza: 'nimeuza', nauza: 'nimeuza', nimemuuzia: "nimeuza",
  nimenunua: 'nimenunua', niliagiza: 'nimenunua', nimemnunulia: "nimenunua",
  nimetumia: 'nimetumia', nilitumia: 'nimetumia',
  nimekopesha: 'nimemkopesha', nilikopesha: 'nimemkopesha', ninamkopesha: 'nimemkopesha'
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
  let actionIndex = -1;

  for (let i = 0; i < words.length; i++) {
    for (const key in verbMap) {
      if (similarity(words[i], key) > 0.7) {
        action = verbMap[key];
        actionIndex = i;
        break;
      }
    }
    if (action) break;
  }

  if (!action) throw new Error("Hatua (action) haijatambulika. Tafadhali ongea tena kwa utaratibu.");

  // 2. Detect Punguzo
  let punguzo = 0;
  const punguzoIndex = words.findIndex(w => w === 'punguzo');

  if (punguzoIndex !== -1 && punguzoIndex + 1 < words.length) {
    const parsed = swahiliToNumber(words.slice(punguzoIndex + 1).join(' '));
    if (typeof parsed !== 'number' || isNaN(parsed) || parsed > 10000) {
      throw new Error("Punguzo haijatambulika au kama ni zaidi ya 10,000 andika kwa tarakimu.");
    }
    punguzo = parsed;
  }

  // 3. Determine position of quantity (right before 'punguzo' or at end)
  let quantity: number = 1;
  let quantityIndex = -1;

  for (let i = words.length - 1; i >= 0; i--) {
    if (i === punguzoIndex || words[i] === 'punguzo') continue;
    const parsed = swahiliToNumber(words[i]);
    if (typeof parsed === 'number' && !isNaN(parsed)) {
      quantity = parsed;
      quantityIndex = i;
      break;
    }
  }

  // 4. Extract customer (only if action is 'nimemkopesha')
  let customer: string | null = null;
  let productStart = actionIndex + 1;

  if (action === 'nimemkopesha') {
    if (words.length < 3) {
      throw new Error("Sentensi ya mkopo lazima iwe na angalau maneno 4: hatua, mteja na bidhaa.");
    }
    customer = words[actionIndex + 1];
    if (!customer || customer === 'punguzo') {
      throw new Error("Mteja hajatajwa vizuri. Tafadhali sema jina la mteja mara baada ya 'nimemkopesha'.");
    }
    productStart++; // Product starts after customer
  }

  // 5. Build product from remaining words between productStart -> quantityIndex/punguzoIndex
  const productEnd = quantityIndex !== -1
    ? quantityIndex
    : punguzoIndex !== -1
    ? punguzoIndex
    : words.length;

  const productWords = words.slice(productStart, productEnd);
  const product = productWords.join(' ').trim();

  if (!product || product.length < 2) {
    throw new Error("Bidhaa haijatambulika vizuri. Tafadhali ongea tena kwa utaratibu.");
  }

  return {
    action,
    customer,
    product,
    quantity,
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

