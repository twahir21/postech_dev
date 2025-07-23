import { eq, ilike } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { customers, products } from "../../database/schema/shop";

// swahili-nlp.ts
const fetchProducts = async (
  shopId: string
): Promise<{ success: boolean; message: string; name: string [] }> => {
  try {
    // 1. Fuzzy search for product names (case-insensitive, partial match)
    const result = await mainDb
      .select({
        name: products.name,
      })
      .from(products)
      .where(eq(products.shopId, shopId))

    if (result.length === 0) {
      return {
        success: false,
        name: [],
        message: `hakuna bidhaa kwenye mfumo.`,
      };
    }

    // 2. Return the closest match
    return {
      success: true,
      message: "Bidhaa imepatikana.",
      name: result.map((item) => item.name),
    };
  } catch (error) {
    return {
      success: false,
      name: [],
      message:
        error instanceof Error
          ? error.message
          : "Hitilafu imetokea wakati wa kutafuta bidhaa",
    };
  }
};

const fetchCustomers = async (
  shopId: string
): Promise<{ success: boolean; message: string; name: string[] }> => {
  try {
    // 1. Fuzzy search for product names (case-insensitive, partial match)
    const result = await mainDb
      .select({
        name: customers.name,
      })
      .from(customers)
      .where(eq(customers.shopId, shopId));

    if (result.length === 0) {
      return {
        success: false,
        name: [],
        message: `hakuna mteja kwenye mfumo.`,
      };
    }

    // 2. Return the closest match
    return {
      success: true,
      message: "Mteja amepatikana.",
      name: result.map((item) => item.name),
    };

  } catch (error) {
    return {
      success: false,
      name: [],
      message:
        error instanceof Error
          ? error.message
          : "Hitilafu imetokea wakati wa kutafuta mteja",
    };
  }
};

/**
 * Parses sentences starting with "nimetumia", extracting:
 * - action
 * - product or money
 * - quantity (default 1)
 * - activity (default "nyumbani")
 */
export function parseNimetumiaSentence(sentence: string): ParsedNimetumia {
  const normalized = sentence.toLowerCase().trim();
  const words = normalized.split(/\s+/);

  // Ensure action is "nimetumia" (or similar variant)
  const actionMatch = words[0]?.match(/nime(tumia|letumia|litumia)/);
  if (!actionMatch) {
    throw new Error('Sentensi lazima ianze na "nimetumia", "niletumia", n.k.');
  }

  const action = 'nimetumia';

  let activity = 'nyumbani';
  let product = 'nothing';
  let money: number = 0;
  let quantity: number = 1;
  console.log("nimetumia is processing ...")

  // Find index of "kwa ajili ya"
  const activityIndex = words.findIndex((w, i) => w === 'kwa' && words[i + 1] === 'ajili' && words[i + 2] === 'ya');

  if (activityIndex !== -1 && words[activityIndex + 3]) {
    activity = words.slice(activityIndex + 3).join(' ');
  }

  // Extract all words between action and activity
  const potentialProductOrMoneyWords = activityIndex !== -1
    ? words.slice(1, activityIndex) // words after "nimetumia", before "kwa ajili ya"
    : words.slice(1); // rest of sentence if no activity

  const phrase = potentialProductOrMoneyWords.join(' ').trim();

  // NEW: Check if phrase is already a simple numeric value
  const directNum = parseFloat(phrase);
  if (!isNaN(directNum)) {
    // It's a straight number → treat as money
    money = directNum;
    product = 'nothing';
  } else {
    // Try full Swahili number parsing
    const fullParse = swahiliToNumber(phrase);
    if (fullParse !== null && !isNaN(fullParse)) {
      // It's money in Swahili format
      money = fullParse;
      product = '';
    } else {
      // It's likely a product name + optional quantity
      let lastNumericIndex = -1;

      for (let i = potentialProductOrMoneyWords.length - 1; i >= 0; i--) {
        const part = potentialProductOrMoneyWords.slice(i).join(' ');
        const parsed = swahiliToNumber(part);

        if (parsed !== null && !isNaN(parsed)) {
          lastNumericIndex = i;
          quantity = parsed;
          break;
        }
      }

      if (lastNumericIndex > -1) {
        // Product is everything before numeric phrase
        product = potentialProductOrMoneyWords.slice(0, lastNumericIndex).join(' ') || 'hakijajulikani';
      } else {
        // No quantity found, assume product only, quantity = 1
        product = potentialProductOrMoneyWords.join(' ');
      }
    }
  }

  console.log("nimetumia datas ...: ", action, product.trim(), quantity, activity, money)
  return {
    action,
    product: product.trim() || 'haijajulikana',
    quantity: quantity || 1,
    activity,
    money
  };
}


const verbMap: Record<string, string> = {
  nimeuza: 'nimeuza', niliuza: 'nimeuza', nauza: 'nimeuza', nimemuuzia: "nimeuza",
  nimenunua: 'nimenunua', niliagiza: 'nimenunua', nimemnunulia: "nimenunua", nimeongeza: "nimenunua",
  nimetumia: 'nimetumia', nilitumia: 'nimetumia',
  nimekopesha: 'nimemkopesha', nilikopesha: 'nimemkopesha', ninamkopesha: 'nimemkopesha', namkopesha: 'nimemkopesha'
};

const similarity = (a: string, b: string) => {
  let matches = 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / len;
};

export async function detectSwahiliTransaction(text: string, shopId: string): Promise<ParsedTransaction> {
  const normalized = text.toLowerCase().trim();
  const words = normalized.split(/\s+/);

  // Step 1: Detect action
  const actionKey = Object.keys(verbMap).find(key => similarity(words[0], key) > 0.7);
  if (!actionKey) throw new Error("Hatua haijatambulika.");
  const action = verbMap[actionKey] as 'nimemkopesha' | 'nimeuza' | 'nimetumia' | 'nimenunua';

  if (action === 'nimetumia') parseNimetumiaSentence(normalized);

  // Step 2: Remove action from text
  const restOfText = normalized.replace(actionKey, '').trim();

  // Step 3: Load all customers and products
  const customers = (await fetchCustomers(shopId)).name; // string[]
  const products = (await fetchProducts(shopId)).name;   // string[]


  // Step 4: Match customer name (longest match)
  let customer: string | null = null;
  let afterCustomerText = restOfText;

  if (action === 'nimemkopesha') {
    for (const c of customers.sort((a, b) => b.length - a.length)) {
      if (restOfText.includes(c)) {
        customer = c;
        afterCustomerText = restOfText.replace(c, '').trim();
        break;
      }
    }
  }


  afterCustomerText = customer ? restOfText.replace(customer, '').trim() : restOfText;


// Step 5: Match product name (token matching and fuzzy scoring)
let product: string | null = null;
const normalizedText = afterCustomerText.toLowerCase();

const exactMatch = products.find(p => normalizedText.includes(p.toLowerCase()));

if (exactMatch) {
  product = exactMatch;
} else {
  // Try partial matches
  const partialMatches = products
    .map(p => ({ name: p, score: similarity(normalizedText, p.toLowerCase()) }))
    .filter(item => item.score > 0.5) // Adjust threshold
    .sort((a, b) => b.score - a.score);

  if (partialMatches.length === 1) {
    product = partialMatches[0].name;
  } else if (partialMatches.length > 1) {
    const names = partialMatches.map(p => `"${p.name}"`).join(", ");
    throw new Error(`Tafadhali fafanua bidhaa: ${names} zote zinafanana. Tafadhali taja bidhaa kamili.`);
  }
}

if (!product) {
  throw new Error("Bidhaa haijatambulika. Hakikisha jina lake lipo sahihi.");
}


  const afterProductText = afterCustomerText.replace(product, '').trim();
  const tokens = afterProductText.split(/\s+/);


  // Step 6: Extract quantity (before punguzo)
  const punguzoIndex = tokens.findIndex(w => w === 'punguzo');
  const quantityWords = punguzoIndex !== -1 ? tokens.slice(0, punguzoIndex) : tokens;
  let quantity = 1;
  for (const word of quantityWords.reverse()) {
    const num = parseFloat(word);
    console.log(word)
    if (word.length > 0 && isNaN(num))  throw new Error("Tafadhali weka idadi halali kwa namba (mfano: 2 au 4.5), si maneno kama 'tano'.");

    if (!isNaN(num)) {
      quantity = num;
      break;
    }
  }


  // Step 7: Extract punguzo (after punguzo)
  let punguzo = 0;
  if (punguzoIndex !== -1 && punguzoIndex + 1 < tokens.length) {
    const word = tokens[punguzoIndex + 1];
    punguzo = parseFloat(word);
    if (isNaN(punguzo)) {
      throw new Error("Tafadhali weka punguzo kama namba halali (mfano: 2, 5.5)");
    }
  }

  return {
    action,
    customer,
    product,
    quantity,
    punguzo
  };
}


interface ParsedTransaction {
  action: string;
  customer: string | null;
  product: string;
  quantity: number;
  punguzo: number;
}

type ParsedNimetumia = {
  action: string;
  product: string;
  quantity: number;
  money: number;
  activity: string;
};



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

