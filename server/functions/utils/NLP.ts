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