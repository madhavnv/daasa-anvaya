import { NextResponse } from "next/server";

// Fallback registry for attribution prompt
const ANKITHA_CATALOG = [
  { ankita: "ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು", era: "1484–1564 CE" },
  { ankita: "ವಿಜಯ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವಿಜಯ ದಾಸರು", era: "1682–1755 CE" },
  { ankita: "ಗೋಪಾಲ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಗೋಪಾಲ ದಾಸರು", era: "1721–1762 CE" },
  { ankita: "ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಜಗನ್ನಾಥ ದಾಸರು", era: "1727–1809 CE" },
  { ankita: "ಹಯವದನ", composer: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು", era: "1480–1600 CE" },
  { ankita: "ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ", composer: "ಶ್ರೀ ಕನಕ ದಾಸರು", era: "1509–1609 CE" },
  { ankita: "ಗುರು ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಮಧ್ವಪತಿ ದಾಸರು", era: "16th Century" },
  { ankita: "ಗುರು ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಮೇಧಾವಿ ವೆಂಕಟರಮಣಾಚಾರ್ಯ", era: "19th Century" }
];

// Pre-cached canonical masterpieces for instant 20ms responses
const PRECACHED_MASTERPIECES: Record<string, any> = {
  narasimha: {
    titleKannada: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ",
    titleEnglish: "Sri Narasimha Suladi",
    composerKannada: "ಶ್ರೀ ವಿಜಯ ದಾಸರು",
    composerEnglish: "Sri Vijaya Dasaru (1682–1755 CE)",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    historicalContextKannada: "ವಿಜಯದಾಸರು ನರಸಿಂಹ ದೇವರ ಅಪಾರ ಭಕ್ತರು. ಪ್ರಹ್ಲಾದನಿಗೆ ಒಲಿದ ಭಕ್ತವತ್ಸಲ ನರಸಿಂಹನನ್ನು ಧ್ಯಾನಿಸುತ್ತಾ, ಸಕಲ ಸಂಸಾರ ಭಯ ಮತ್ತು ಅರಿಷಡ್ವರ್ಗಗಳ ನಿವಾರಣೆಗಾಗಿ ಧ್ರುವ, ಮಟ್ಟ, ರೂಪಕಾದಿ ಸಪ್ತತಾಳಗಳಲ್ಲಿ ರಚಿಸಿದ ಮಹೋನ್ನತ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Composed by Sri Vijaya Dasa invoking Lord Narasimha's transcendental ferocity toward adharma and ocean-like benevolence toward the surrendered devotee across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಮಾಲಿಕಾ / ಸಂಪ್ರದಾಯ ಸೂಳಾದಿ ರಾಗ",
    talaTradition: "ಧ್ರುವ ತಾಳಾದಿ ಸಪ್ತತಾಳ",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಧ್ರುವ ತಾಳ",
        originalTextKannada: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ\nಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ\nಮೂರು ಲೋಕದ ರಕ್ಷಕನೆ ಸದ್ಗುಣ\nಭೂರಿ ಮಹಿಮ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗ",
        originalTextTransliteration: "Veera simhane narasimhane daya\npaaraavaarane bhaya nivaarana nirguna\nmooru lokada rakshakane sadguna\nbhoori mahima sri vijaya vitthala narasinga",
        wordByWordBreakdown: [
          { kannadaWord: "ವೀರ ಸಿಂಹನೆ", transliteration: "veera simhane", meaningKannada: "ವೀರಾಗ್ರಣಿಯಾದ ದೈವಿಕ ಸಿಂಹವೇ", meaningEnglish: "Valiant divine lion" },
          { kannadaWord: "ದಯ ಪಾರಾವಾರನೆ", transliteration: "daya paaraavaarane", meaningKannada: "ಕರುಣೆಯ ಮಹಾಸಮುದ್ರವೇ", meaningEnglish: "Ocean of unconditioned mercy" },
          { kannadaWord: "ಭಯ ನಿವಾರಣ", transliteration: "bhaya nivaarana", meaningKannada: "ಸಂಸಾರದ ಭಯವನ್ನು ಹೊಡೆದೋಡಿಸುವವನೇ", meaningEnglish: "Dispeller of existential fear" },
          { kannadaWord: "ನಿರ್ಗುಣ", transliteration: "nirguna", meaningKannada: "ಪ್ರಾಕೃತ ತ್ರಿಗುಣ ರಹಿತನಾದವನೇ (ಸತ್ತ್ವ-ರಜಸ್-ತಮಸ್ಸು ಮೀರಿದವನು)", meaningEnglish: "Free from material gunas" },
          { kannadaWord: "ಭೂರಿ ಮಹಿಮ", transliteration: "bhoori mahima", meaningKannada: "ಅಪಾರ ಮಹಿಮೆಯುಳ್ಳವನೇ", meaningEnglish: "Possessor of boundless glory" }
        ],
        anvayaKannada: "ವೀರ ಸಿಂಹನೆ, ನಾರಸಿಂಹನೆ, ದಯೆಯ ಪಾರಾವಾರನೇ (ಸಮುದ್ರವೇ), ಭಯವನ್ನು ನಿವಾರಣೆ ಮಾಡುವವನೇ, ಪ್ರಾಕೃತ ತ್ರಿಗುಣ ರಹಿತನೇ (ನಿರ್ಗುಣನೇ), ಮೂರು ಲೋಕಗಳನ್ನು ಸಂರಕ್ಷಿಸುವವನೇ, ಅಪಾರ ಸದ್ಗುಣ-ಮಹಿಮೆಗಳುಳ್ಳ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗನೇ ನಿನಗೆ ನಮಸ್ಕಾರ.",
        anvayaEnglish: "O Valiant Lion, O Narasimha, an infinite ocean of grace, dispeller of all mortal dread, transcendent beyond worldly gunas, protector of the threefold cosmos, endowed with supreme attributes, O Vijaya Vittala Narasinga!",
        spiritualMeaningKannada: "ಭಗವಂತನ ನರಸಿಂಹ ರೂಪವು ಕೇವಲ ಉಗ್ರ ಸ್ವರೂಪವಲ್ಲ; ದುಷ್ಟರಿಗೆ ಆತ ಭಯಂಕರನಾದರೂ ಶರಣಾದ ಭಕ್ತರಿಗೆ ದಯಾಸಮುದ್ರ. ಪ್ರಾಕೃತ ಗುಣಗಳಿಲ್ಲದ ಅಪ್ರಾಕೃತ ದಿವ್ಯ ಮಂಗಳ ಮೂರ್ತಿ ಎಂಬುದನ್ನು ವಿಜಯದಾಸರು ಇಲ್ಲಿ ಸ್ಥಾಪಿಸಿದ್ದಾರೆ.",
        spiritualMeaningEnglish: "Reconciles the paradox of divine ferocity and tender protection. While terror-inducing to evil forces, the Lord is an infinite ocean of protection to the humble seeker."
      }
    ],
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರ ಈ ಸೂಳಾದಿಯು ನರಸಿಂಹ ತತ್ತ್ವದ ಸಮಗ್ರ ವಿವರಣೆ ನೀಡುತ್ತದೆ. ಭಗವಂತನು ಭಕ್ತರ ಭಯ ನಿವಾರಕನಾಗಿ, ಅಜ್ಞಾನ ಮತ್ತು ಅಹಂಕಾರವೆಂಬ ಹಿರಣ್ಯಕಶಿಪುವನ್ನು ಸೀಳಿ ಭಕ್ತ ಪ್ರಹ್ಲಾದನಿಗೆ ಜ್ಞಾನ ಭಕ್ತಿಯನ್ನು ಕರುಣಿಸಿದ ಮಹಾಮಹಿಮೆಯನ್ನು ಸ್ತುತಿಸುತ್ತದೆ.",
    comprehensiveSummaryEnglish: "A masterwork Suladi establishing the absolute sovereignty and accessibility of Lord Narasimha, bridging philosophical rigour with intense personal surrender.",
    modernTakeawayKannada: "ಬದುಕಿನಲ್ಲಿ ಎದುರಾಗುವ ಭಯ, ಅಸ್ಥಿರತೆ ಮತ್ತು ಅನ್ಯಾಯದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಕುಗ್ಗದೆ ಸತ್ಯದ ಮಾರ್ಗದಲ್ಲಿ ಧೃಢವಾಗಿ ನಿಲ್ಲಲು ಈ ಕೃತಿ ಆತ್ಮಸ್ಥೈರ್ಯ ನೀಡುತ್ತದೆ.",
    modernTakeawayEnglish: "Cultivates psychological resilience against fear and external tumult by rooting internal trust in higher righteous justice."
  },
  tarakka: {
    titleKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ (ಮುಂಡಿಗೆ)",
    titleEnglish: "Tarakka Bindige (Mundige)",
    composerKannada: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Sri Purandara Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ 'ಮುಂಡಿಗೆ' (ರೂಪಕ ಕವನ). ಮೇಲ್ನೋಟಕ್ಕೆ ಗೃಹಿಣಿಯೊಬ್ಬಳು ನೀರಿಗೆ ಹೋಗುವ ಜನಪದ ಕಥೆಯಂತೆ ಕಂಡರೂ, ಅಂತರಂಗದಲ್ಲಿ ಮಾನವ ದೇಹ, ಕುಂಡಲಿನೀ ಯೋಗ ಮತ್ತು ಸಂಸಾರ ಬಂಧನದ ಗೂಢಾರ್ಥವನ್ನು ಹೊಂದಿದೆ.",
    historicalContextEnglish: "One of Purandara Dasa's cryptic riddle-songs (Mundige). On the surface, a woman fetching water; inwardly, a yogic allegory on the mortal physical body and salvation.",
    compositionType: "ಮುಂಡಿಗೆ",
    ragaTradition: "ತಿಲಂಗ್ / ಭೈರವಿ / ಕಾಪಿ",
    talaTradition: "ಆದಿ ತಾಳ",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ\nಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು\nತಂದೆ ತಾಯಿಯಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆ",
        originalTextTransliteration: "Tarakka bindige neerige hogona baare cheluve\nbindige odedare ombattu thootu\ntande taayiyillada tabbali bindige",
        wordByWordBreakdown: [
          { kannadaWord: "ತಾರಕ್ಕ", transliteration: "tarakka", meaningKannada: "ತಾರಮ್ಮ / ಎಲೈ ಗೆಳತಿಯೇ", meaningEnglish: "O companion / lady" },
          { kannadaWord: "ಬಿಂದಿಗೆ", transliteration: "bindige", meaningKannada: "ನೀರಿನ ಕೊಡ (ಇಲ್ಲಿ ಮಾನವ ಶರೀರ)", meaningEnglish: "Water pot (here, the physical body)" },
          { kannadaWord: "ಒಂಬತ್ತು ತೂತು", transliteration: "ombattu thootu", meaningKannada: "ಒಂಬತ್ತು ದ್ವಾರಗಳುಳ್ಳದ್ದು (ಕಣ್ಣು, ಕಿವಿ, ಮೂಗು ಇತ್ಯಾದಿ ನವದ್ವಾರಗಳು)", meaningEnglish: "Nine orifices of the physical human vessel" },
          { kannadaWord: "ತಬ್ಬಲಿ ಬಿಂದಿಗೆ", transliteration: "tabbali bindige", meaningKannada: "ಆಶ್ರಯವಿಲ್ಲದ, ಅಶಾಶ್ವತವಾದ ಕಾಯ", meaningEnglish: "Orphaned/fragile vessel without eternal anchor" }
        ],
        anvayaKannada: "ಎಲೈ ಚೆಲುವೆಯಾದ ಜೀವಿಯೇ, ಬಿಂದಿಗೆಯನ್ನು ತಾ, ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ. ಆದರೆ ಈ ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತುಗಳಾಗುವಂಥದ್ದು, ಯಾವುದೇ ಸ್ಥಿರ ರಕ್ಷಕರಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆಯಿದು.",
        anvayaEnglish: "Bring the pitcher, O fair maiden, let us fetch water! Beware: if this pot cracks, it displays nine holes; it is an orphaned, transient vessel.",
        spiritualMeaningKannada: "ಬಿಂದಿಗೆ ಎಂದರೆ ಮಾನವ ದೇಹ. ನೀರು ಎಂದರೆ ಮೋಕ್ಷ ಅಥವಾ ಭಕ್ತಿರಸ. ದೇಹದಲ್ಲಿ ಎರಡು ಕಣ್ಣು, ಎರಡು ಕಿವಿ, ಎರಡು ನಾಸಿಕ, ಒಂದು ಬಾಯಿ, ಎರಡು ಮಲ-ಮೂತ್ರ ದ್ವಾರಗಳು ಸೇರಿ ಒಂಬತ್ತು ರಂಧ್ರಗಳಿವೆ (ನವದ್ವಾರ ಶರೀರ). ಇಂಥ ನಶ್ವರ ಶರೀರವನ್ನು ವಿಠ್ಠಲನ ಭಕ್ತಿಗೆ ಸಮರ್ಪಿಸಬೇಕು ಎಂಬುದು ದಾಸರ ಅಂತರಂಗ ಸಂದೇಶ.",
        spiritualMeaningEnglish: "The pot is the human physical frame. The nine perforations symbolize the nine body portals (Navadvaara). The song urges seekers to use this fragile vessel to fetch the living water of divine grace before it perishes."
      }
    ],
    metaphorsAndMundige: [
      {
        allegoryKannada: "ಬಿಂದಿಗೆ ಮತ್ತು ಒಂಬತ್ತು ತೂತು (Nine-holed Pot)",
        allegoryEnglish: "The Water Pot with Nine Holes",
        outerMeaningKannada: "ಹೆಣ್ಣುಮಗಳು ನದಿಗೆ ತೆಗೆದುಕೊಂಡು ಹೋಗುವ ಮಣ್ಣಿನ ಕೊಡ, ಅದು ಒಡೆದರೆ ಒಂಬತ್ತು ಭಾಗಗಳಾಗಿ ಒಡೆಯುತ್ತದೆ.",
        outerMeaningEnglish: "A clay pitcher brought to the river that will shatter into fragments.",
        esotericMeaningKannada: "ಭಗವದ್ಗೀತೆಯಲ್ಲಿ ಹೇಳಿರುವ 'ನವದ್ವಾರೇ ಪುರೇ ದೇಹೀ' ಎಂಬಂತೆ ಮಾನವನ ಶರೀರವೇ ಒಂಬತ್ತು ದ್ವಾರಗಳಿರುವ ಮಣ್ಣಿನ ಬಿಂದಿಗೆ. ಪ್ರಾಣ ಹೋದರೆ ದೇಹ ವ್ಯರ್ಥ.",
        esotericMeaningEnglish: "The human physical anatomy with its nine sense gates (eyes, ears, nostrils, mouth, excretory passages). The transient mortal container."
      }
    ],
    comprehensiveSummaryKannada: "ಪುರಂದರದಾಸರು ಜನಪದ ಗೀತೆಯ ಶೈಲಿಯಲ್ಲಿ ಅತಿ ಗಹನವಾದ ಶಾರೀರಿಕ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಸತ್ಯವನ್ನು ಮುಂಡಿಗೆಯ ರೂಪದಲ್ಲಿ ಅಡಗಿಸಿದ್ದಾರೆ. ದೇಹದ ಅನಿತ್ಯತೆಯನ್ನು ಅರಿತು ಭಗವದ್ಭಕ್ತಿಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳುವುದು ಇದರ ಸಂದೇಶ.",
    comprehensiveSummaryEnglish: "A sublime example of Dasa Mundige poetry where ordinary rural idioms veil profound Upanishadic concepts of physical impermanence and spiritual awakening.",
    modernTakeawayKannada: "ನಮ್ಮ ಬಾಹ್ಯ ಸೌಂದರ್ಯ ಹಾಗೂ ಲೌಕಿಕ ಸಂಪತ್ತಿನ ಬಗ್ಗೆ ಅಹಂಕಾರ ಪಡದೆ, ಸಿಕ್ಕಿರುವ ಅಲ್ಪಾಯುಷ್ಯದಲ್ಲಿ ಸಾರ್ಥಕ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಬೇಕು.",
    modernTakeawayEnglish: "Do not dwell on vanity or ephemeral appearances; recognize life's fragility and invest energy in meaningful endeavors."
  },
  manava: {
    titleKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
    titleEnglish: "Manava Janma Doddadu",
    composerKannada: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Sri Purandara Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಭಾವಿ ವೈರಾಗ್ಯ ಗೀತೆ. ಅಸಂಖ್ಯಾತ ಜೀವ ಜನ್ಮಗಳ ನಂತರ ಲಭಿಸಿದ ದುರ್ಲಭವಾದ ಮನುಷ್ಯ ಜನ್ಮವನ್ನು ವ್ಯರ್ಥ ವಿಷಯ ಸುಖಗಳಿಗೆ ಹಾಳುಮಾಡದೆ ಹರಿನಾಮ ಸ್ಮರಣೆಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳಬೇಕೆಂದು ಜನಸಾಮಾನ್ಯರಿಗೆ ಎಚ್ಚರಿಸುವ ಕೃತಿ.",
    historicalContextEnglish: "Purandara Dasa's timeless wake-up call articulating the immense rarity of conscious human embodiment and warning against dissipating it in mundane hedonism.",
    compositionType: "ಕೀರ್ತನೆ / ದೇವರನಾಮ",
    ragaTradition: "ರಾಗಮಾಲಿಕೆ / ಭೈರವಿ",
    talaTradition: "ಆದಿ ತಾಳ",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ\nಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
        originalTextTransliteration: "Manava janma doddadu idanu haani maadalibeedi huchappagalira\nmanava janma doddadu",
        wordByWordBreakdown: [
          { kannadaWord: "ಮಾನವ ಜನ್ಮ", transliteration: "manava janma", meaningKannada: "ಮನುಷ್ಯನಾಗಿ ಹುಟ್ಟಿದ ಅವಸ್ಥೆ", meaningEnglish: "Human birth / embodiment" },
          { kannadaWord: "ದೊಡ್ಡದು", transliteration: "doddadu", meaningKannada: "ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಹಾಗೂ ದುರ್ಲಭವಾದದ್ದು", meaningEnglish: "Priceless and momentous" },
          { kannadaWord: "ಹಾನಿ ಮಾಡಲಿಬೇಡಿ", transliteration: "haani maadalibeedi", meaningKannada: "ವ್ಯರ್ಥವಾಗಿ ಕಳೆದುಕೊಳ್ಳಬೇಡಿ", meaningEnglish: "Do not squander or ruin it" },
          { kannadaWord: "ಹುಚ್ಚಪ್ಪಗಳಿರಾ", transliteration: "huchappagalira", meaningKannada: "ಲೌಕಿಕ ಮೋಹದಲ್ಲಿ ಮುಳುಗಿರುವ ಮೂರ್ಖ ಮನುಷ್ಯರೇ", meaningEnglish: "O foolish souls blinded by delusion" }
        ],
        anvayaKannada: "ಎಲೈ ಭ್ರಾಂತರಾದ ಹುಚ್ಚಪ್ಪಗಳಿರಾ! ಮಾನವ ಜನ್ಮವು ಅತ್ಯಂತ ದೊಡ್ಡದು (ಶ್ರೇಷ್ಠವಾದದ್ದು). ಇದನ್ನು ಕ್ಷುಲ್ಲಕ ವಿಷಯಾಸಕ್ತಿಗಳಿಗೆ ಬಲಿಯಾಗಿಸಿ ವ್ಯರ್ಥವಾಗಿ ಹಾಳು ಮಾಡಬೇಡಿ.",
        anvayaEnglish: "O infatuated mortals! The human birth is exceedingly precious and rare. Do not squander it away in reckless ignorance!",
        spiritualMeaningKannada: "84 ಲಕ್ಷ ಜೀವರಾಶಿಗಳಲ್ಲಿ ಮನುಷ್ಯ ಜನ್ಮ ಮಾತ್ರ ವಿವೇಕ ಮತ್ತು ಮೋಕ್ಷ ಸಾಧನೆಗೆ ಯೋಗ್ಯವಾದದ್ದು. ಇದನ್ನು ಕೇವಲ ಅನ್ನ-ನಿದ್ರೆ-ಭಯ-ಮೈಥುನಗಳಲ್ಲೇ ಕಳೆದರೆ ಪಶುಗಳಿಗೆ ಸಮಾನ ಎಂಬುದು ದಾಸರ ನೇರ ಎಚ್ಚರಿಕೆ.",
        spiritualMeaningEnglish: "Among millions of evolutionary cycles, human consciousness alone grants moral self-determination and spiritual liberation. Wasting it in animal appetites is tragic."
      }
    ],
    comprehensiveSummaryKannada: "ಮನುಷ್ಯ ಜನ್ಮದ ಮಹತ್ವ ಮತ್ತು ಕಾಲದ ಬೆಲೆಯನ್ನು ಸಾರುವ ಸರ್ವಕಾಲಿಕ ಕೃತಿ. ವಿಷಯ ಸುಖಗಳೆಲ್ಲ ಅಶಾಶ್ವತ, ಭಗವಂತನ ಧ್ಯಾನ ಮತ್ತು ಸತ್ಕರ್ಮಗಳೇ ಶಾಶ್ವತ ಎಂದು ಪುರಂದರದಾಸರು ಬೋಧಿಸುತ್ತಾರೆ.",
    comprehensiveSummaryEnglish: "An existential masterpiece imploring humanity to seize conscious life for moral elevation and realization rather than mechanical survival.",
    modernTakeawayKannada: "ಕಾಲ ಮತ್ತು ಅವಕಾಶಗಳು ಶಾಶ್ವತವಲ್ಲ. ಮುಂದೂಡುವ ಪ್ರವೃತ್ತಿಯನ್ನು ಬಿಟ್ಟು, ಇಂದೇ ಸತ್ಕಾರ್ಯಗಳಲ್ಲಿ ತೊಡಗಿಕೊಳ್ಳುವುದು ಜಾಣತನ.",
    modernTakeawayEnglish: "Time and conscious health are irreplaceable. Stop procrastinating meaningful inner growth."
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Accept query, input, or text interchangeably
    const query = (body.query || body.input || body.text || "").trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query cannot be empty. ದಯವಿಟ್ಟು ಕೃತಿಯ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ." },
        { status: 400 }
      );
    }

    // Fast-path instant cache matching
    const qLower = query.toLowerCase();
    if (qLower.includes("ನಾರಸಿಂಹ") || qLower.includes("ವೀರ ಸಿಂಹನೆ") || qLower.includes("narasimha")) {
      return NextResponse.json(PRECACHED_MASTERPIECES.narasimha);
    }
    if (qLower.includes("ತಾರಕ್ಕ") || qLower.includes("ಬಿಂದಿಗೆ") || qLower.includes("tarakka")) {
      return NextResponse.json(PRECACHED_MASTERPIECES.tarakka);
    }
    if (qLower.includes("ಮಾನವ ಜನ್ಮ") || qLower.includes("ಹುಚ್ಚಪ್ಪಗಳಿರಾ") || qLower.includes("manava")) {
      return NextResponse.json(PRECACHED_MASTERPIECES.manava);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are "Dāsa Bodhini" (ದಾಸ ಬೋಧಿನಿ), the authoritative academic and spiritual workstation for Haridasa Sahitya (1263–1983 CE).
Analyze the Haridasa composition provided. You must adhere strictly to the following 40+ Composer Registry for attribution:
${JSON.stringify(ANKITHA_CATALOG.slice(0, 30))}

CRITICAL RULES:
1. Deterministic Attribution: Verify the signature line (ಅಂಕಿತ ನಾಮ). Never default to Purandara Dasa if the signature belongs to another Dasa (e.g. Vijaya Vittala = Vijaya Dasa; Guru Jagannatha Vittala = Medhavi Venkataramacharya).
2. Structural Rigor: If the work is a Suladi, label stanzas with the respective Tala (ಧ್ರುವ, ಮಟ್ಟ, ರೂಪಕ, ಝಂಪೆ, ತ್ರಿಪುಟ, ಅಟ್ಟ, ಆದಿ, ಜತೆ). If Mundige, decode esoteric allegories.
3. Anvaya: Reorder the poetic lines into natural spoken Kannada grammatical order.

Return ONLY a valid JSON object matching this exact schema:
{
  "titleKannada": "string",
  "titleEnglish": "string",
  "composerKannada": "string",
  "composerEnglish": "string",
  "ankitaKannada": "string",
  "ankitaEnglish": "string",
  "historicalContextKannada": "string",
  "historicalContextEnglish": "string",
  "compositionType": "ಕೀರ್ತನೆ / ದೇವರನಾಮ" | "ಸೂಳಾದಿ" | "ಉಗಾಭೋಗ" | "ಮುಂಡಿಗೆ",
  "ragaTradition": "string",
  "talaTradition": "string",
  "stanzas": [
    {
      "stanzaNumber": 1,
      "stanzaType": "ಪಲ್ಲವಿ" | "ಅನುಪಲ್ಲವಿ" | "ಚರಣ" | "ಧ್ರುವ ತಾಳ" etc.,
      "originalTextKannada": "string",
      "originalTextTransliteration": "string",
      "wordByWordBreakdown": [
        {
          "kannadaWord": "string",
          "transliteration": "string",
          "meaningKannada": "string",
          "meaningEnglish": "string"
        }
      ],
      "anvayaKannada": "string",
      "anvayaEnglish": "string",
      "spiritualMeaningKannada": "string",
      "spiritualMeaningEnglish": "string"
    }
  ],
  "metaphorsAndMundige": [
    {
      "allegoryKannada": "string",
      "allegoryEnglish": "string",
      "outerMeaningKannada": "string",
      "outerMeaningEnglish": "string",
      "esotericMeaningKannada": "string",
      "esotericMeaningEnglish": "string"
    }
  ],
  "comprehensiveSummaryKannada": "string",
  "comprehensiveSummaryEnglish": "string",
  "modernTakeawayKannada": "string",
  "modernTakeawayEnglish": "string"
}`;

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nAnalyze this Haridasa input:\n"${query}"` }]
            }
          ],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "ವಿಶ್ಲೇಷಣೆ ಸರ್ವರ್‌ನಲ್ಲಿ ತೊಂದರೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ." },
        { status: 502 }
      );
    }

    const data = await apiResponse.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json(
        { error: "ಪೂರ್ಣ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." },
        { status: 500 }
      );
    }

    const parsedResult = JSON.parse(rawContent);
    return NextResponse.json(parsedResult);
  } catch (err: any) {
    console.error("Decode Route Exception:", err);
    return NextResponse.json(
      { error: err.message || "ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ." },
      { status: 500 }
    );
  }
}