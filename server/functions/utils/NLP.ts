export const NLP = (text: string): { product: string; quantity: number } => {
    const quantityWords: Record<string, number> = {
      robo: 0.25,
      nusu: 0.5,
      "robo tatu": 0.75,
      "nusu na robo": 0.75,
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
    };

    let normalized = text.toLowerCase().trim();

    // Combine compound phrases first
    normalized = normalized.replace(/nusu\s+na\s+robo/g, "nusu_robo");
    normalized = normalized.replace(/robo\s+tatu/g, "robo_tatu");

    const words = normalized.split(/\s+/);

    let quantity = 0;
    const foundQuantities: number[] = [];

    for (const word of words) {
      const clean = word.replace(/[^\w.]/g, "");

      if (!isNaN(Number(clean))) {
        foundQuantities.push(Number(clean));
        continue;
      }

      const key = clean.replace(/_/g, " ");
      if (quantityWords[key] !== undefined) {
        foundQuantities.push(quantityWords[key]);
      }
    }

    // Sum up quantities, default to 1
    quantity = foundQuantities.length > 0
      ? foundQuantities.reduce((a, b) => a + b, 0)
      : 1;

    // Remove quantity-related words to extract product name
    const quantityKeys = Object.keys(quantityWords).map(k => k.replace(/\s+/g, "_"));
    const productWords = words.filter((w) => {
      const wNorm = w.replace(/\s+/g, "_").replace(/[^\w]/g, "");
      return (
        !quantityKeys.includes(wNorm) &&
        isNaN(Number(wNorm))
      );
    });

    const product = productWords.join(" ").trim();

    console.log("🛒 Product:", product || "unknown", "| Qty:", quantity);

    return { product, quantity };
}

export const validateTransactionText = (text: string) => {
  const validActions = ['nimeuza', 'nimenunua', 'nimetumia', 'nimemkopesha'];
  const quantityMap = ['moja', 'mbili', 'tatu', 'nne', 'tano', 'sita', 'saba', 'nane', 'tisa', 'kumi', 'robo', 'nusu', 'robo tatu', 'nusu na robo'];
  const words = text.trim().toLowerCase().split(/\s+/);

  const errors: string[] = [];

  if (words.length < 3) {
    errors.push('Bonyeza kitufe cha ℹ️ kujua utaratibu. Sentensi sio sahihi');
    return { valid: false, errors };
  }

  const action = words[0];
  if (!validActions.includes(action)) {
    errors.push(`Hatua "${action}" si sahihi. Jaribu: ${validActions.join(', ')}`);
  }

  let customer = '';
  let product = '';
  let quantity = '';
  let discount = 0;

  if (action === 'nimemkopesha') {
    if (words.length < 4) {
      errors.push('Unapomkopesha, lazima uweke jina la mteja, bidhaa, na kiasi.');
    } else {
      customer = words[1];
      product = words[2];
      quantity = words[3];
    }
  } else {
    product = words[1];
    quantity = words[2];
  }

  // Validate quantity
  const isNumericQty = !isNaN(Number(quantity));
  const swahiliParsedQty = parseSwahiliNumber(quantity);

  if (!quantityMap.includes(quantity) && !isNumericQty && swahiliParsedQty == null) {
    errors.push(`Kiasi "${quantity}" si sahihi. Tumia neno kama "moja", "kumi na mbili" au namba. Iwe chini ya 9,999`);
  }


  // Optional punguzo
  const punguzoIndex = words.findIndex((w) => w === 'punguzo');
  if (punguzoIndex !== -1) {
    const nextWord = words[punguzoIndex + 1];
    if (!nextWord || isNaN(Number(nextWord))) {
      errors.push(`Punguzo lipo lakini halina thamani sahihi (mfano: punguzo 200).`);
    } else {
      discount = Number(nextWord);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    parsed: {
      action,
      customer,
      product,
      quantity,
      discount
    }
  };
};


const baseNumbers: Record<string, number> = {
  moja: 1, mbili: 2, tatu: 3, nne: 4, tano: 5,
  sita: 6, saba: 7, nane: 8, tisa: 9, kumi: 10,
  ishirini: 20, thelathini: 30, arobaini: 40,
  hamsini: 50, sitini: 60, sabini: 70,
  themanini: 80, tisini: 90
};

const multipliers: Record<string, number> = {
  mia: 100,
  elfu: 1000,
};

export function parseSwahiliNumber(input: string): number | null {
  const words = input.toLowerCase().split(/\s+na\s+|\s+/); // supports both "na" and spaces
  let total = 0;
  let temp = 0;
  let lastMultiplier = 1;

  for (let word of words) {
    if (multipliers[word]) {
      // Commit current temp before multiplier
      if (temp === 0) temp = 1; // e.g., "mia" = "mia moja"
      total += temp * multipliers[word];
      temp = 0;
      lastMultiplier = multipliers[word];
    } else if (baseNumbers[word] != null) {
      temp += baseNumbers[word];
    } else {
      return null; // invalid word
    }
  }

  total += temp; // commit any remaining units
  return total || null;
}
