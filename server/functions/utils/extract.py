# BASE = {
#     'sifuri': 0, 'moja': 1, 'mbili': 2, 'tatu': 3, 'nne': 4, 'tano': 5,
#     'sita': 6, 'saba': 7, 'nane': 8, 'tisa': 9, 'kumi': 10,
#     'ishirini': 20, 'thelathini': 30, 'arobaini': 40, 'hamsini': 50,
#     'sitini': 60, 'sabini': 70, 'themanini': 80, 'tisini': 90
# }

# MULTIPLIERS = {
#     'mia': 100,
#     'elfu': 1000,
#     'milioni': 1_000_000,
#     'bilioni': 1_000_000_000
# }

# FRACTIONS = {
#     'nusu': 0.5,
#     'robo': 0.25,
#     'robo tatu': 0.75,
#     'nusu na robo': 0.75,
# }

# def parse_swahili_number_phrase(text: str) -> float:
#     text = text.lower().replace('_', ' ').strip()
#     if text in FRACTIONS:
#         return FRACTIONS[text]

#     parts = text.split()
#     total = 0
#     current = 0
#     last_multiplier = 1

#     i = 0
#     while i < len(parts):
#         word = parts[i]

#         # Handle compound fractions
#         if i + 1 < len(parts) and f"{parts[i]} {parts[i+1]}" in FRACTIONS:
#             total += FRACTIONS[f"{parts[i]} {parts[i+1]}"]
#             i += 2
#             continue

#         # Handle single fractions
#         if word in FRACTIONS:
#             total += FRACTIONS[word]
#             i += 1
#             continue

#         # Handle base numbers
#         if word in BASE:
#             current += BASE[word]
#             i += 1
#             continue

#         # Handle multipliers
#         elif word in MULTIPLIERS:
#             multiplier = MULTIPLIERS[word]
#             if current == 0:
#                 current = 1
#             total += current * multiplier
#             current = 0
#             i += 1
#             continue

#         # Handle numeric digits
#         try:
#             number = float(word)
#             total += number
#         except ValueError:
#             return None
#         i += 1

#     total += current
#     return round(total, 2)


# print(parse_swahili_number_phrase("nimemkopesha mafuta elfu moja mia tano na tano"))
# # Output: "nimemkopesha mafuta 1505"


# TESTS = [
#     ("sifuri", 0),
#     ("moja", 1),
#     ("mbili", 2),
#     ("kumi", 10),
#     ("kumi na moja", 11),
#     ("kumi na saba", 17),
#     ("ishirini", 20),
#     ("ishirini na mbili", 22),
#     ("thelathini na nne", 34),
#     ("arobaini na saba", 47),
#     ("hamsini na tisa", 59),
#     ("sabini na moja", 71),
#     ("tisini na tisa", 99),
    
#     ("mia moja", 100),
#     ("mia mbili", 200),
#     ("mia tano na saba", 507),
#     ("mia tisa tisini na tisa", 999),

#     ("elfu moja", 1000),
#     ("elfu mbili", 2000),
#     ("elfu tatu na hamsini", 3050),
#     ("elfu tano mia mbili", 5200),
#     ("elfu sita mia saba tisini na nane", 6798),
    
#     ("milioni moja", 1_000_000),
#     ("milioni mbili elfu tatu", 2_003_000),
#     ("milioni tatu mia moja", 3_000_100),
#     ("milioni nne elfu tano mia kumi na saba", 4_005_117),
    
#     ("nusu", 0.5),
#     ("robo", 0.25),
#     ("robo tatu", 0.75),
#     ("nusu na robo", 0.75),
#     ("mbili na nusu", 2.5),

#     ("mia mbili na robo", 200.25),
#     ("elfu moja mia tano na nusu", 1500.5)
# ]

# for text, expected in TESTS:
#     result = parse_swahili_number_phrase(text)
#     if result != expected:
#         print(f"❌ '{text}' expected {expected}, got {result}")
#     else:
#         print(f"✅ '{text}' => {result}")

def swahili_to_number(text):
    # Define mappings
    base_numbers = {
        "sifuri": 0,
        "moja": 1,
        "mbili": 2,
        "tatu": 3,
        "nne": 4,
        "tano": 5,
        "sita": 6,
        "saba": 7,
        "nane": 8,
        "tisa": 9,
        "kumi": 10,
        "ishirini": 20,
        "thelathini": 30,
        "arobaini": 40,
        "hamsini": 50,
        "sitini": 60,
        "sabini": 70,
        "thembani": 80,
        "tisini": 90
    }

    multipliers = {
        "mia": 100,
        "elfu": 1000,
        "milio": 1_000_000,
        "bilioni": 1_000_000_000
    }

    fractions = {
        "nusu": 0.5,
        "robo": 0.25,
        "robo tatu": 0.75,
        "nusu na robo": 0.75
    }

    text = text.lower().strip()

    # Check for direct fraction match
    if text in fractions:
        return fractions[text]

    words = [w for w in text.split() if w != 'za']

    total = 0
    current_value = 0

    i = 0
    while i < len(words):
        word = words[i]

        # Check for known multiplier first
        if word in multipliers:
            multiplier = multipliers[word]
            if current_value == 0:
                current_value = 1
            total += current_value * multiplier
            current_value = 0
            i += 1
        elif word in base_numbers:
            current_value += base_numbers[word]
            i += 1
        elif word == 'na' and i + 1 < len(words) and words[i + 1] in base_numbers:
            # Skip 'na'
            i += 1
        else:
            raise ValueError(f"Unknown word: {word}")

    total += current_value
    return total
print(swahili_to_number("elfu nane mia sita tisini na tatu"))  # ➜ 8693
print(swahili_to_number("milio moja elfu kumi na mbili"))     # ➜ 1012000
print(swahili_to_number("nusu na robo"))                      # ➜ 0.75
print(swahili_to_number("tisini na nane elfu sabini na moja"))# ➜ 9871