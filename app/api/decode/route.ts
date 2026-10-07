import { NextResponse } from "next/server";

const CANONICAL_HARIDASA_REGISTRY = [
  { ankita: "ವಿಜಯ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವಿಜಯ ದಾಸರು", era: "1682–1755 CE", location: "Chikalparvi", genre: "Suladi / Kirthane" },
  { ankita: "ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು", era: "1484–1564 CE", location: "Hampi / Pandharpur", genre: "Kirthane / Suladi / Mundige" },
  { ankita: "ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ", composer: "ಶ್ರೀ ಕನಕ ದಾಸರು", era: "1509–1609 CE", location: "Kaginele", genre: "Philosophy / Kirthane" },
  { ankita: "ಗೋಪಾಲ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಗೋಪಾಲ ದಾಸರು", era: "1721–1762 CE", location: "Mosarakallu", genre: "Suladi / Ugabhoga" },
  { ankita: "ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಜಗನ್ನಾಥ ದಾಸರು", era: "1727–1809 CE", location: "Manvi", genre: "Tattwa / Kirthane" },
  { ankita: "ಹಯವದನ", composer: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು", era: "1480–1600 CE", location: "Sode", genre: "Vadiraja Stotra / Suladi" },
  { ankita: "ಶ್ರೀವ್ಯಾಸವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವ್ಯಾಸರಾಜ ತೀರ್ಥರು", era: "1460–1539 CE", location: "Hampi", genre: "Vyasaraya Kirthane" },
  { ankita: "ಶ್ರೀರಂಗವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಶ್ರೀಪಾದರಾಜರು", era: "1422–1480 CE", location: "Mulbagal", genre: "Ugabhoga / Kirthane" },
  { ankita: "ಪ್ರಾಣೇಶವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪ್ರಾಣೇಶ ದಾಸರು", era: "1744–1823 CE", location: "Lingasugur", genre: "Suladi / Devaranama" }
];

const PRECACHED_MASTERPIECES: Record<string, any> = {
  durga: {
    titleKannada: "ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ",
    titleEnglish: "Sri Durga Suladi",
    composerKannada: "ಶ್ರೀ ವಿಜಯ ದಾಸರು",
    composerEnglish: "Sri Vijaya Dasaru (1682–1755 CE)",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    historicalContextKannada: "ಶ್ರೀ ವಿಜಯದಾಸರ ಪರಮ ಪವಿತ್ರ ಕೃತಿ. ದುರ್ಗಾಂತರ್ಗತ ಶ್ರೀಹರಿಯನ್ನು ಹಾಗೂ ಪ್ರಕೃತಿ ಅಭಿಮಾನಿ ದುರ್ಗಾದೇವಿಯನ್ನು ಧ್ರುವ, ಮಟ್ಟ, ತ್ರಿವಿಡಿ, ಅಟ್ಟ, ಆದಿ, ಜತೆ ಸಪ್ತತಾಳಗಳಲ್ಲಿ ಸ್ತುತಿಸಿದ ಶ್ರೇಷ್ಠ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Composed exclusively by Sri Vijaya Dasa (Ankita: Vijaya Vittala). Veneration of the Supreme Lord Sri Hari indwelling Goddess Durga across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಸಂಪ್ರದಾಯ ಸೂಳಾದಿ ರಾಗಮಾಲಿಕೆ",
    talaTradition: "ಧ್ರುವ ತಾಳಾದಿ ಸಪ್ತತಾಳ",
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರು ಜಗಜ್ಜನನಿಯಾದ ದುರ್ಗಾದೇವಿಯ ಅಪಾರ ಮಹಿಮೆಯನ್ನು ಸ್ತುತಿಸುತ್ತಾ, ಆಕೆಯ ಅಂತರ್ಗತನಾದ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನ ಚರಣಗಳಲ್ಲಿ ಶರಣಾಗತಿಯನ್ನು ಬೇಡುತ್ತಾರೆ.",
    comprehensiveSummaryEnglish: "A celebrated Suladi praising cosmic mother Durga as the manifestation of divine will, seeking shelter at the feet of Vijaya Vittala.",
    modernTakeawayKannada: "ಮನಸ್ಸಿನ ಆತಂಕ, ದುಷ್ಟ ಆಲೋಚನೆಗಳು ಹಾಗೂ ಜೀವನದ ಅನಿಶ್ಚಿತತೆಯನ್ನು ಗೆಲ್ಲಲು ನಿಷ್ಕಪಟ ಭಕ್ತಿ ಹಾಗೂ ದೈವಶಕ್ತಿಯಲ್ಲಿ ದೃಢ ನಂಬಿಕೆ ಇಡಬೇಕು.",
    modernTakeawayEnglish: "Cultivates profound mental composure and inner fearlessness by entrusting anxieties to the supreme divine presence.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಧ್ರುವ ತಾಳ",
        originalTextKannada: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ ಮಹಾದುಷ್ಟಜನ ಸಂಹಾರೆ\nದುರ್ಗಾಂತರ್ಗತ ದುರ್ಗೆ ದುರ್ಲಭೆ ಸುಲಭೆ\nದುರ್ಗಮವಾಗಿದೆ ನಿನ್ನ ಮಹಿಮೆ ಬೊಮ್ಮ\nಭರ್ಗಾದಿಗಳಿಗೆಲ್ಲ ಗುಣಿಸಿದರೊ\nಸ್ವರ್ಗಭೂಮಿ ಪಾತಾಳ ಸಮಸ್ತ ವ್ಯಾಪುತ ದೇವಿ\nವರ್ಗಕ್ಕೆ ಮೀರಿದ ಬಲುಸುಂದರೀ\nಸ್ವರ್ಗಂಗಾಜನಕ ನಮ್ಮ ವಿಜಯವಿಠ್ಠಲನಂಘ್ರಿ\nದುರ್ಗಾಶ್ರಯಮಾಡಿ ಬದುಕುವಂತೆ ಮಾಡು",
        originalTextTransliteration: "Durgaa durgeye mahaadushtajana samhaare\ndurgaantargata durge durlabhe sulabhe\ndurgamavaagide ninna mahime bomma\nbhargaadigaligella gunisidaro\nswargabhoomi paataala samasta vyaaputa devi\nvargakke meerida balusundaree\nswargangaajanaka namma vijayavitthalanamghri\ndurgaashrayamaadi badukuvante maadu",
        wordByWordBreakdown: [
          { kannadaWord: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ", transliteration: "durgaa durgeye", meaningKannada: "ದುರ್ಗತಿಗಳನ್ನು ನಾಶಮಾಡುವ ತಾಯಿಯೇ", meaningEnglish: "O dispeller of all adversities" },
          { kannadaWord: "ದುರ್ಗಾಂತರ್ಗತ", transliteration: "durgaantargata", meaningKannada: "ದುರ್ಗಾದೇವಿಯ ಒಳಗೆ ಅಂತರ್ಯಾಮಿಯಾಗಿ ನೆಲೆಸಿರುವ ಪರಮಾತ್ಮ", meaningEnglish: "The Supreme Lord indwelling Durga" },
          { kannadaWord: "ದುರ್ಲಭೆ ಸುಲಭೆ", transliteration: "durlabhe sulabhe", meaningKannada: "ಅಭಕ್ತರಿಗೆ ದುರ್ಲಭಳು, ಭಕ್ತರಿಗೆ ಅತಿ ಸುಲಭಳು", meaningEnglish: "Unattainable to the arrogant, easily accessible to the devoted" }
        ],
        anvayaKannada: "ಮಹಾ ದುಷ್ಟಜನರನ್ನು ಸಂಹರಿಸುವ ದುರ್ಗಾದೇವಿಯೇ! ದುರ್ಗಾಂತರ್ಗತಳಾಗಿರುವವಳೇ, ಅಭಕ್ತರಿಗೆ ದುರ್ಲಭಳೂ ಭಕ್ತರಿಗೆ ಸುಲಭಳೂ ಆದವಳೇ! ನಿನ್ನ ಮಹಿಮೆಯು ಬ್ರಹ್ಮ, ರುದ್ರಾದಿಗಳಿಗೂ ಅರಿಯಲು ದುರ್ಗಮವಾಗಿದೆ.",
        anvayaEnglish: "O Durga, destroyer of malignant wickedness! Indwelling divine presence, unattainable to the egoistic yet easily reached by true devotees.",
        spiritualMeaningKannada: "ದುರ್ಗಾ ದೇವಿಯು ಪ್ರಕೃತಿ ಅಭಿಮಾನಿ. ಆಕೆಯ ಮುಖಾಂತರ ಭಗವಂತನಾದ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನನ್ನು ಪ್ರಾರ್ಥಿಸಿ ಸಂಸಾರ ಬಂಧನದಿಂದ ಮುಕ್ತಿ ಪಡೆಯುವ ತತ್ತ್ವ.",
        spiritualMeaningEnglish: "Positions Goddess Durga as the cosmic protector directing seekers to the ultimate grace of Lord Vijaya Vittala."
      }
    ]
  },
  narasimha: {
    titleKannada: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ",
    titleEnglish: "Sri Narasimha Suladi",
    composerKannada: "ಶ್ರೀ ವಿಜಯ ದಾಸರು",
    composerEnglish: "Sri Vijaya Dasaru (1682–1755 CE)",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    historicalContextKannada: "ಶ್ರೀ ವಿಜಯದಾಸರು ಪ್ರಹ್ಲಾದನಿಗೆ ಒಲಿದ ಭಕ್ತವತ್ಸಲ ನರಸಿಂಹ ದೇವರನ್ನು ಧ್ಯಾನಿಸುತ್ತಾ ರಚಿಸಿದ ಪೂರ್ಣ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Composed by Sri Vijaya Dasa invoking Lord Narasimha's transcendental ferocity toward adharma across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಮಾಲಿಕಾ ರಾಗ",
    talaTradition: "ಸಪ್ತತಾಳ",
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರ ಈ ಸೂಳಾದಿಯು ನರಸಿಂಹ ತತ್ತ್ವದ ಸಮಗ್ರ ವಿವರಣೆ ನೀಡುತ್ತದೆ.",
    comprehensiveSummaryEnglish: "A masterwork Suladi establishing the absolute sovereignty of Lord Narasimha.",
    modernTakeawayKannada: "ಬದುಕಿನಲ್ಲಿ ಎದುರಾಗುವ ಭಯ ಮತ್ತು ಅನ್ಯಾಯದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಕುಗ್ಗದೆ ಸತ್ಯದ ಮಾರ್ಗದಲ್ಲಿ ಧೃಢವಾಗಿ ನಿಲ್ಲಲು ಈ ಕೃತಿ ಆತ್ಮಸ್ಥೈರ್ಯ ನೀಡುತ್ತದೆ.",
    modernTakeawayEnglish: "Cultivates psychological resilience against fear.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಧ್ರುವ ತಾಳ",
        originalTextKannada: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ\nಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ\nಮೂರು ಲೋಕದ ರಕ್ಷಕನೆ ಸದ್ಗುಣ\nಭೂರಿ ಮಹಿಮ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗ",
        originalTextTransliteration: "Veera simhane narasimhane daya\npaaraavaarane bhaya nivaarana nirguna\nmooru lokada rakshakane sadguna\nbhoori mahima sri vijaya vitthala narasinga",
        wordByWordBreakdown: [
          { kannadaWord: "ವೀರ ಸಿಂಹನೆ", transliteration: "veera simhane", meaningKannada: "ವೀರಾಗ್ರಣಿಯಾದ ದೈವಿಕ ಸಿಂಹವೇ", meaningEnglish: "Valiant divine lion" },
          { kannadaWord: "ದಯ ಪಾರಾವಾರನೆ", transliteration: "daya paaraavaarane", meaningKannada: "ಕರುಣೆಯ ಮಹಾಸಮುದ್ರವೇ", meaningEnglish: "Ocean of unconditioned mercy" }
        ],
        anvayaKannada: "ವೀರ ಸಿಂಹನೆ, ನಾರಸಿಂಹನೆ, ದಯೆಯ ಪಾರಾವಾರನೇ, ಭಯ ನಿವಾರಕನೇ, ಮೂರು ಲೋಕಗಳ ರಕ್ಷಕನೇ, ಸದ್ಗುಣ-ಮಹಿಮೆಗಳುಳ್ಳ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗನೇ ನಿನಗೆ ನಮಸ್ಕಾರ.",
        anvayaEnglish: "O Valiant Lion, O Narasimha, an infinite ocean of grace, dispeller of mortal dread.",
        spiritualMeaningKannada: "ಭಗವಂತನ ನರಸಿಂಹ ರೂಪವು ದುಷ್ಟರಿಗೆ ಭಯಂಕರನಾದರೂ ಶರಣಾದ ಭಕ್ತರಿಗೆ ದಯಾಸಮುದ್ರ.",
        spiritualMeaningEnglish: "Reconciles the paradox of divine ferocity toward evil and tender shelter toward sincere seekers."
      }
    ]
  },
  tarakka: {
    titleKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ (ಮುಂಡಿಗೆ)",
    titleEnglish: "Tarakka Bindige (Mundige)",
    composerKannada: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Sri Purandara Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಮುಂಡಿಗೆ. ನವದ್ವಾರ ಶರೀರ ಮತ್ತು ಭಕ್ತಿ-ಮೋಕ್ಷದ ಗೂಢಾರ್ಥವನ್ನು ಹೊಂದಿದೆ.",
    historicalContextEnglish: "Purandara Dasa's cryptic riddle-song presenting a profound yogic allegory on the mortal physical body.",
    compositionType: "ಮುಂಡಿಗೆ",
    ragaTradition: "ತಿಲಂಗ್ ರಾಗ",
    talaTradition: "ಆದಿ ತಾಳ",
    comprehensiveSummaryKannada: "ಪುರಂದರದಾಸರು ಮಾನವ ಶರೀರದ ಅನಿತ್ಯತೆಯನ್ನು ಅರಿತು ಭಗವದ್ಭಕ್ತಿಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳುವುದು ಇದರ ಸಂದೇಶ ಎಂದು ಬೋಧಿಸಿದ್ದಾರೆ.",
    comprehensiveSummaryEnglish: "A sublime example of Dasa Mundige poetry where rural idioms veil profound truths of physical impermanence.",
    modernTakeawayKannada: "ನಮ್ಮ ಬಾಹ್ಯ ಸೌಂದರ್ಯ ಹಾಗೂ ಲೌಕಿಕ ಸಂಪತ್ತಿನ ಬಗ್ಗೆ ಅಹಂಕಾರ ಪಡದೆ, ಸಿಕ್ಕಿರುವ ಅಲ್ಪಾಯುಷ್ಯದಲ್ಲಿ ಸಾರ್ಥಕ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಬೇಕು.",
    modernTakeawayEnglish: "Do not dwell on vanity; recognize life's fragility.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ\nಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು\nತಂದೆ ತಾಯಿಯಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆ",
        originalTextTransliteration: "Tarakka bindige neerige hogona baare cheluve\nbindige odedare ombattu thootu\ntande taayiyillada tabbali bindige",
        wordByWordBreakdown: [
          { kannadaWord: "ತಾರಕ್ಕ", transliteration: "tarakka", meaningKannada: "ತಾರಮ್ಮ / ಎಲೈ ಚೇತನವೇ", meaningEnglish: "O soul" },
          { kannadaWord: "ಬಿಂದಿಗೆ", transliteration: "bindige", meaningKannada: "ನೀರಿನ ಕೊಡ (ಮಾನವ ಶರೀರ)", meaningEnglish: "Water pot" }
        ],
        anvayaKannada: "ಎಲೈ ಚೆಲುವೆಯಾದ ಜೀವಿಯೇ, ಬಿಂದಿಗೆಯನ್ನು ತಾ, ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ.",
        anvayaEnglish: "Bring the pitcher, O fair soul, let us fetch water!",
        spiritualMeaningKannada: "ಬಿಂದಿಗೆ ಎಂದರೆ ನವದ್ವಾರಗಳುಳ್ಳ ಮಾನವ ಶರೀರ.",
        spiritualMeaningEnglish: "The fragile pitcher symbolizes the mortal nine-portal human frame."
      }
    ],
    metaphorsAndMundige: [
      {
        allegoryKannada: "ಬಿಂದಿಗೆ ಮತ್ತು ಒಂಬತ್ತು ತೂತು",
        allegoryEnglish: "The Water Pot with Nine Holes",
        outerMeaningKannada: "ನದಿಗೆ ಕೊಂಡೊಯ್ಯುವ ಮಣ್ಣಿನ ಕೊಡ.",
        outerMeaningEnglish: "An earthenware pot carried to fetch water.",
        esotericMeaningKannada: "ನವದ್ವಾರಗಳುಳ್ಳ ನಶ್ವರ ಮಾನವ ಶರೀರ.",
        esotericMeaningEnglish: "The physical human anatomy with its nine portals."
      }
    ]
  },
  manava: {
    titleKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
    titleEnglish: "Manava Janma Doddadu",
    composerKannada: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Sri Purandara Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ವೈರಾಗ್ಯ ಗೀತೆ.",
    historicalContextEnglish: "Purandara Dasa's timeless wake-up call articulating the immense rarity of human embodiment.",
    compositionType: "ಕೀರ್ತನೆ / ದೇವರನಾಮ",
    ragaTradition: "ಭೈರವಿ ರಾಗ",
    talaTradition: "ಆದಿ ತಾಳ",
    comprehensiveSummaryKannada: "ಮನುಷ್ಯ ಜನ್ಮದ ಮಹತ್ವ ಮತ್ತು ಹರಿನಾಮ ಸ್ಮರಣೆಯ ಅನಿವಾರ್ಯತೆಯನ್ನು ಸಾರುವ ಕೃತಿ.",
    comprehensiveSummaryEnglish: "An existential masterpiece imploring humanity to seize conscious life.",
    modernTakeawayKannada: "ಕಾಲ ಮತ್ತು ಅವಕಾಶಗಳು ಶಾಶ್ವತವಲ್ಲ. ಇಂದೇ ಸತ್ಕಾರ್ಯಗಳಲ್ಲಿ ತೊಡಗಿಕೊಳ್ಳುವುದು ಜಾಣತನ.",
    modernTakeawayEnglish: "Time is irreplaceable.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ\nಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
        originalTextTransliteration: "Manava janma doddadu idanu haani maadalibeedi huchappagalira\nmanava janma doddadu",
        wordByWordBreakdown: [
          { kannadaWord: "ಮಾನವ ಜನ್ಮ", transliteration: "manava janma", meaningKannada: "ಮನುಷ್ಯನಾಗಿ ಹುಟ್ಟಿದ ಅವಸ್ಥೆ", meaningEnglish: "Human embodiment" },
          { kannadaWord: "ದೊಡ್ಡದು", transliteration: "doddadu", meaningKannada: "ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ", meaningEnglish: "Priceless" }
        ],
        anvayaKannada: "ಎಲೈ ಭ್ರಾಂತರಾದ ಹುಚ್ಚಪ್ಪಗಳಿರಾ! ಮಾನವ ಜನ್ಮವು ಅತ್ಯಂತ ದೊಡ್ಡದು. ಇದನ್ನು ವ್ಯರ್ಥವಾಗಿ ಹಾಳು ಮಾಡಬೇಡಿ.",
        anvayaEnglish: "O infatuated mortals! The human birth is exceedingly precious. Do not squander it away!",
        spiritualMeaningKannada: "ಮನುಷ್ಯ ಜನ್ಮ ಮಾತ್ರ ವಿವೇಕ ಮತ್ತು ಮೋಕ್ಷ ಸಾಧನೆಗೆ ಯೋಗ್ಯವಾದದ್ದು.",
        spiritualMeaningEnglish: "Human consciousness alone grants liberation."
      }
    ]
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || body.input || body.text || "").trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query cannot be empty. ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ." },
        { status: 400 }
      );
    }

    const qLower = query.toLowerCase();

    if (qLower.includes("ದುರ್ಗಾ") || qLower.includes("ದುರ್ಗೆ") || qLower.includes("durga") || qLower.includes("durge")) {
      return NextResponse.json(PRECACHED_MASTERPIECES.durga);
    }
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
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are "Dāsa Bodhini" (ದಾಸ ಬೋಧಿನಿ), the authoritative academic and theological workstation for Haridasa Sahitya (1263–1983 CE).
Analyze the query with rigorous academic precision to ensure 100% theological and historical data accuracy.

CRITICAL ACCURACY & RECONSTRUCTION RULES:
1. Canonical Identification: Identify the exact canonical composition. Do not echo back fragmented user input as the title.
2. Complete Stanza Coverage: Reconstruct the FULL composition including Pallavi, Anupallavi, and ALL Charanas or Suladi metric talas.
3. Etymological Rigor: Provide accurate, traditional Sanskrit/Kannada word-by-word meanings and natural spoken-order Anvaya.
4. Strict Attribution based on Registry:
${JSON.stringify(CANONICAL_HARIDASA_REGISTRY)}

Return ONLY valid JSON matching this exact schema:
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
  "comprehensiveSummaryKannada": "string",
  "comprehensiveSummaryEnglish": "string",
  "modernTakeawayKannada": "string",
  "modernTakeawayEnglish": "string",
  "stanzas": [
    {
      "stanzaNumber": 1,
      "stanzaType": "ಪಲ್ಲವಿ" | "ಅನುಪಲ್ಲವಿ" | "ಚರಣ" | "ಧ್ರುವ ತಾಳ" | "ಮಟ್ಟ ತಾಳ" | "ರೂಪಕ ತಾಳ" | "ಝಂಪೆ ತಾಳ" | "ತ್ರಿಪುಟ ತಾಳ" | "ಅಟ್ಟ ತಾಳ" | "ಆದಿ ತಾಳ" | "ಜತೆ",
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
  ]
}`;

    const MODELS_TO_TRY = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
    let rawContent: string | null = null;

    for (const model of MODELS_TO_TRY) {
      try {
        let apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nAccurately decode and reconstruct the full Haridasa composition for query:\n"${query}"` }] }],
              generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
            })
          }
        );

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
          if (rawContent) break;
        }
      } catch (err: any) {
        console.warn(`Connection error on ${model}:`, err.message);
      }
    }

    if (!rawContent) {
      return NextResponse.json(
        { error: "ಸರ್ವರ್‌ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಒತ್ತಡವಿದೆ (503 High Demand). ದಯವಿಟ್ಟು 5 ಸೆಕೆಂಡುಗಳ ನಂತರ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ." },
        { status: 503 }
      );
    }

    const cleanedContent = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsedResult = JSON.parse(cleanedContent);
    return NextResponse.json(parsedResult);
  } catch (err: any) {
    console.error("Decode Route Exception:", err);
    return NextResponse.json(
      { error: err.message || "ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ." },
      { status: 500 }
    );
  }
}