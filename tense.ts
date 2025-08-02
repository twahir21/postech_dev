const str = 'mama juma alikopeshwa pipi za 50 lita sitini na saba na nusu na robo nimemtolea shilingi elfu hamisini na saba';

const actions = [
  {
    name: 'lend',
    keywords: ['kopesh', 'kopesha', 'kopeshwa'],
  },
  {
    name: 'order',
    keywords: ['azima', 'azimishwa', 'azimwa'],
  },
  {
    name: 'debt',
    keywords: ['daiwa', 'deni', 'nimemdai', 'nitamdai', 'namdai', 'ninamdai'],
  },
  {
    name: 'loan',
    keywords: ['mkopo', 'amekopa', 'alikopa', 'atakopa', 'namkopa'],
  },
];

const lowerStr = str.toLowerCase();

let detectedAction: string | null = null;

for (const action of actions) {
  const matched = action.keywords.find(keyword => lowerStr.includes(keyword));
  if (matched) {
    console.log(`✅ Action is: "${action.name}" (matched keyword: "${matched}")`);
    detectedAction = action.name;
    break; // stop at first match
  }
}

if (!detectedAction) {
  console.log("⚠️ No matching action found.");
}
