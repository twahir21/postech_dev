import { swahiliToNumber } from "./numbers";

const actions = [
  {
    name: 'kukopesha',
    keywords: [
        'kopesha', 'kopeshwa', 
        'azima', 'azimishwa', 'azimwa',
        'daiwa', 'deni', 'ninamdai', 'nitamdai', 'namdai', 'nimemdai',
        'chukua mkopo',
        'amekopa', 'alikopa', 'atakopa', 'amekopa', 'namkopa'
    ],
  },
  {
    name: 'kuuza',
    keywords: ['kuuza', 'kuuzia', 'uza', 'uzia', 'uzwa'],
  },
  {
    name: 'kununua',
    keywords: ['kununua', 'nunua', 'nimenunua', 'nimenunuliwa'],
  },
  {
    name: 'kutumia',
    keywords: ['kutumia', 'nimetumia', 'tumia', 'chukua'],
  },
];

const discounts  = [
    {
        name: 'punguzo',
        keywords: ['nimemtolea', 'punguzo', 'nimempunguzia']
    }
];

const usedFor = [
    {
        name: 'kwa ajili ya',
        keywords: [ 
            'ili itumike kwenye', 
            'ili nitumie kwenye', 
            'kwa ajili ya', 
            'ili itumiwe kwenye',
            'ili kitumike kwenye',
            'ili utumiwe kwenye',
        ]
    }
]

export const extractAction = (str: string, prd: string, customer: string) => {
    let workingStr = str; // Create a mutable copy of the original string


    // Step 1: Remove customer and product names first
    workingStr = workingStr.replace(new RegExp(customer, 'gi'), '');
    workingStr = workingStr.replace(new RegExp(prd, 'gi'), '');
    workingStr = workingStr.replace(/\s{2,}/g, ' ').trim(); // Clean extra spaces

    const lowerStr = workingStr.toLowerCase();
    let detectedAction: string = "kuuza"; // Default to "kuuza" if no action found
    let discountValue: string | null = null;
    let discountNumber: number | null = null;
    let usedForValue: string | null = null;
    let usedForWhat: string = "nyumbani";
    let usedForAmount: number | null = null;

    // Step 2: Detect and remove action
    for (const action of actions) {
        const matched = action.keywords.find(keyword => lowerStr.includes(keyword));
        if (matched) {
            detectedAction = action.name;
            workingStr = workingStr.replace(new RegExp(matched, 'gi'), '');
            workingStr = workingStr.replace(/\s{2,}/g, ' ').trim();
            break;
        }
    }

    // Step 3: Detect and remove discount (and everything after it)
    for (const discount of discounts) {
        for (const keyword of discount.keywords) {
            const keywordIndex = lowerStr.indexOf(keyword);
            if (keywordIndex >= 0) {
                discountValue = discount.name;
                discountNumber = swahiliToNumber(workingStr.slice(keywordIndex + keyword.length).trim());
                workingStr = workingStr.substring(0, keywordIndex).trim(); // Keep only left side
                break;
            }
        }
        if (discountValue) break;
    }

    // 4. Special case for "kutumia"
    if (detectedAction === 'kutumia') {
        // Step 1: Combine all keywords into a regex pattern (e.g., "kwa ajili ya|ili itumike kwenye|...")
        const keywordPattern = new RegExp(
            usedFor[0].keywords
                .map(keyword => keyword.replace(/\s+/g, '\\s+')) // Handle spaces in keywords
                .join('|'),
            'i' // Case-insensitive
        );

        // Step 2: Find the first matching keyword
        const match = workingStr.match(keywordPattern);
        if (match) {
            usedForValue = usedFor[0].name;
            const matchedKeyword = match[0];
            const keywordIndex = workingStr.toLowerCase().indexOf(matchedKeyword.toLowerCase());

            // Step 3: Extract RHS (remaining text after keyword)
            const remainingText = workingStr
                .slice(keywordIndex + matchedKeyword.length)
                .trim()
                .replace(/^(na|ya|kwenye)\s*/i, ''); // Remove connecting words

            // Step 4: Assign the full remaining phrase (e.g., "msiba wa kaka")
            usedForWhat = remainingText || "nyumbani";

            // Step 5: Extract LHS (usedForAmount)
            const lhs = workingStr.substring(0, keywordIndex).trim();
            usedForAmount = swahiliToNumber(lhs);
        }
    }
    return {
        action: detectedAction,
        discount: discountValue ? discountNumber : null,
        quantity: swahiliToNumber(workingStr) || 1, // Default to 1 if no quantity found
        usedFor: usedForValue ? 
                  {
                    usedForWhat,
                    usedForAmount,
                  }
                  : null,
    };
};