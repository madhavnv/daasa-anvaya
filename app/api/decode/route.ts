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
    historicalContextKannada: "ಶ್ರೀ ವಿಜಯದಾಸರ ಪರಮ ಪವಿತ್ರ ಕೃತಿ. ದುರ್ಗಾಂತರ್ಗತ ಶ್ರೀಹರಿಯನ್ನು ಹಾಗೂ ಪ್ರಕೃತಿ ಅಭಿಮಾನಿ ದುರ್ಗಾದೇವಿಯನ್ನು ಧ್ರುವ, ಮಟ್ಟ, ತ್ರಿವಿಡಿ, ಅಟ್ಟ, ಆದಿ, ಜತೆ ಸಪ್ತತಾಳಗಳಲ್ಲಿ ಸ್ತುತಿಸಿದ ಶ್ರೇಷ್ಠ ಸೂಳಾದಿ. (ಗಮನಿಸಿ: ದುರ್ಗಾ ಸೂಳಾದಿಯ ಕರ್ತೃ ಶ್ರೀ ವಿಜಯದಾಸರು, ಅಂಕಿತ: ವಿಜಯ ವಿಠ್ಠಲ).",
    historicalContextEnglish: "Composed exclusively by Sri Vijaya Dasa (Ankita: Vijaya Vittala). Veneration of the Supreme Lord Sri Hari indwelling Goddess Durga across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಸಂಪ್ರದಾಯ ಸೂಳಾದಿ ರಾಗಮಾಲಿಕೆ",
    talaTradition: "ಧ್ರುವ ತಾಳಾದಿ ಸಪ್ತತಾಳ",
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರು ಜಗಜ್ಜನನಿಯಾದ ದುರ್ಗಾದೇವಿಯ ಅಪಾರ ಮಹಿಮೆಯನ್ನು ಸ್ತುತಿಸುತ್ತಾ, ಆಕೆಯ ಅಂತರ್ಗತನಾದ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನ ಚರಣಗಳಲ್ಲಿ ಶರಣಾಗತಿಯನ್ನು ಬೇಡುತ್ತಾರೆ. ಸಂಸಾರದ ದುಃಖ ಕೂಪದಿಂದ ಪಾರುಮಾಡಿ, ಜ್ಞಾನ, ಭಕ್ತಿ ಮತ್ತು ಸನ್ಮತಿಯನ್ನು ಕರುಣಿಸಬೇಕೆಂದು ಪ್ರಾರ್ಥಿಸುವ ಸಾರ್ವಕಾಲಿಕ ಮಹಾಕೃತಿ.",
    comprehensiveSummaryEnglish: "A celebrated Suladi praising cosmic mother Durga as the manifestation of divine will, seeking shelter at the feet of Vijaya Vittala to cross worldly bondage and achieve inner clarity.",
    modernTakeawayKannada: "ಮನಸ್ಸಿನ ಆತಂಕ, ದುಷ್ಟ ಆಲೋಚನೆಗಳು ಹಾಗೂ ಜೀವನದ ಅನಿಶ್ಚಿತತೆಯನ್ನು ಗೆಲ್ಲಲು ನಿಷ್ಕಪಟ ಭಕ್ತಿ ಹಾಗೂ ದೈವಶಕ್ತಿಯಲ್ಲಿ ದೃಢ ನಂಬಿಕೆ ಇಡಬೇಕೆಂಬುದು ಇದರ ಸಂದೇಶ.",
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
          { kannadaWord: "ದುರ್ಲಭೆ ಸುಲಭೆ", transliteration: "durlabhe sulabhe", meaningKannada: "ಅಭಕ್ತರಿಗೆ ದುರ್ಲಭಳು, ಭಕ್ತರಿಗೆ ಅತಿ ಸುಲಭಳು", meaningEnglish: "Unattainable to the arrogant, easily accessible to the devoted" },
          { kannadaWord: "ದುರ್ಗಮವಾಗಿದೆ", transliteration: "durgamavaagide", meaningKannada: "ಅರಿಯಲು ಅಸಾಧ್ಯವಾಗಿದೆ", meaningEnglish: "Impenetrable and beyond intellect" },
          { kannadaWord: "ದುರ್ಗಾಶ್ರಯಮಾಡಿ", transliteration: "durgaashrayamaadi", meaningKannada: "ದೃಢವಾದ ಕೋಟೆಯಂತೆ ಆಶ್ರಯ ನೀಡಿ", meaningEnglish: "Granting unshakeable fortress-like shelter" }
        ],
        anvayaKannada: "ಮಹಾ ದುಷ್ಟಜನರನ್ನು ಸಂಹರಿಸುವ ದುರ್ಗಾದೇವಿಯೇ! ದುರ್ಗಾಂತರ್ಗತಳಾಗಿರುವವಳೇ, ಅಭಕ್ತರಿಗೆ ದುರ್ಲಭಳೂ ಭಕ್ತರಿಗೆ ಸುಲಭಳೂ ಆದವಳೇ! ನಿನ್ನ ಮಹಿಮೆಯು ಬ್ರಹ್ಮ, ರುದ್ರಾದಿಗಳಿಗೂ ಅರಿಯಲು ದುರ್ಗಮವಾಗಿದೆ. ಸ್ವರ್ಗ, ಭೂಮಿ, ಪಾತಾಳಗಳಲ್ಲಿ ವ್ಯಾಪಿಸಿರುವ ಜಗಜ್ಜನನಿಯೇ, ಸ್ವರ್ಗಂಗೆಯ ಜನಕನಾದ ನಮ್ಮ ವಿಜಯವಿಠ್ಠಲನ ಪಾದಪದ್ಮಗಳನ್ನೇ ಪರಮ ಆಶ್ರಯವನ್ನಾಗಿ ಮಾಡಿಕೊಂಡು ನಾವು ಬದುಕುವಂತೆ ದಯಪಾಲಿಸು.",
        anvayaEnglish: "O Durga, destroyer of malignant wickedness! Indwelling divine presence, unattainable to the egoistic yet easily reached by true devotees. Pervading the heavens, earth, and netherworlds, O mother—lead us to take eternal refuge at the lotus feet of Vijaya Vittala!",
        spiritualMeaningKannada: "ದುರ್ಗಾ ದೇವಿಯು ಪ್ರಕೃತಿ ಅಭಿಮಾನಿ. ಆಕೆಯ ಮುಖಾಂತರ ಭಗವಂತನಾದ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನನ್ನು ಪ್ರಾರ್ಥಿಸಿ ಸಂಸಾರ ಬಂಧನದಿಂದ ಮುಕ್ತಿ ಪಡೆಯುವ ತತ್ತ್ವವನ್ನು ವಿಜಯದಾಸರು ಧ್ರುವ ತಾಳದಲ್ಲಿ ಪ್ರತಿಪಾದಿಸಿದ್ದಾರೆ.",
        spiritualMeaningEnglish: "Positions Goddess Durga as the cosmic protector who directs seekers to the ultimate grace of the indwelling Lord Vijaya Vittala."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಮಟ್ಟ ತಾಳ",
        originalTextKannada: "ಅರಿದರಾಂಕುಶ ಶಕ್ತಿ ಪರಶು ನೇಗಿಲು ಖಡ್ಗ\nಸರಸಿಜ ಗದೆ ಮುದ್ಗರ ಚಾಪ ಮಾರ್ಗಣ\nವರ ಅಭಯ ಮುಸಲ ಪರಿಪರಿ ಆಯುಧವ\nಧರಿಸಿ ಮೆರೆವ ಲಕುಮಿ ಸರಸಿಜಭವ ರುದ್ರ\nಸರುವ ದೇವತೆಗಳ ಕರುಣಾಪಾಂಗದಲ್ಲಿ\nನಿರೀಕ್ಷಿಸಿ ಅವರವರ ಸ್ವರೂಪಸುಖ ಕೊಡುವ\nಸಿರಿಭೂಮಿ ದುರ್ಗಾ ಸರ್ವೋತ್ತಮ ನಮ್ಮ\nವಿಜಯವಿಠ್ಠಲನಂಘ್ರಿ ಪರಮ ಭಕುತಿಯಿಂದ ಸ್ಮರಿಸುವ ಜಗಜ್ಜನನಿ",
        originalTextTransliteration: "Aridaraankusha shakti parashu negilu khadga\nsarasija gade mudgara chaapa maargana\nvara abhaya musala paripari aayudhava\ndharisi mereva lakumi sarasijabhava rudra\nsaruva devategala karunaapaangadalli\nnireekshisi avaravara svaroopasukha koduva\nsiribhoomi durgaa sarvottama namma\nvijayavitthalanamghri parama bhakutiyinda smarisuva jagajjanani",
        wordByWordBreakdown: [
          { kannadaWord: "ಪರಿಪರಿ ಆಯುಧ", transliteration: "paripari aayudha", meaningKannada: "ನಾನಾ ಬಗೆಯ ದಿವ್ಯ ಅಸ್ತ್ರಗಳು", meaningEnglish: "Multitude of divine emblems and weapons" },
          { kannadaWord: "ಸ್ವರೂಪಸುಖ", transliteration: "svaroopasukha", meaningKannada: "ಆತ್ಮನ ನೈಜ ಆನಂದ / ಮುಕ್ತಿ", meaningEnglish: "True inherent spiritual beatitude" },
          { kannadaWord: "ಸಿರಿಭೂಮಿ ದುರ್ಗಾ", transliteration: "siribhoomi durgaa", meaningKannada: "ಶ್ರೀ, ಭೂ, ದುರ್ಗಾ ಎಂಬ ತ್ರಿವಿಧ ರೂಪಗಳು", meaningEnglish: "The threefold divine cosmic forms" }
        ],
        anvayaKannada: "ಚಕ್ರ, ಶಂಖ, ಅಂಕುಶ, ಶಕ್ತಿ, ಪರಶು, ನೇಗಿಲು, ಖಡ್ಗ, ಗದೆ, ಧನುಸ್ಸು, ಬಾಣ, ಅಭಯ ಮುದ್ರಾದಿ ನಾನಾ ಆಯುಧಗಳನ್ನು ಧರಿಸಿ ಮೆರೆಯುವ ಲಕ್ಷ್ಮೀದೇವಿಯೇ! ಬ್ರಹ್ಮ, ರುದ್ರಾದಿ ದೇವತೆಗಳಿಗೆ ಕರುಣೆ ತೋರಿ ಸ್ವರೂಪ ಸುಖವನ್ನು ಕೊಡುವ ಸಿರಿ, ಭೂ, ದುರ್ಗಾ ಸ್ವರೂಪಿಣಿಯೇ, ಸರ್ವೋತ್ತಮನಾದ ನಮ್ಮ ವಿಜಯವಿಠ್ಠಲನ ಪಾದಗಳನ್ನು ಸದಾ ಸ್ಮರಿಸುವ ಜಗನ್ಮಾತೆಯೇ ನಿನಗೆ ನಮಸ್ಕಾರ.",
        anvayaEnglish: "Wielding discus, conch, goad, spear, bow, and sword with boons and protection—O Lakshmi who bestows rightful joy upon Brahma, Rudra, and all gods. As Sri, Bhoo, and Durga, you perpetually adore the supreme feet of Vijaya Vittala!",
        spiritualMeaningKannada: "ದುರ್ಗಾದೇವಿಯ ಆಯುಧಗಳು ಕೇವಲ ಯುದ್ಧಸಾಧನಗಳಲ್ಲ; ಅವು ಜೀವಿಯ ಅಜ್ಞಾನ, ಕಾಮ, ಕ್ರೋಧ, ಮದ, ಮತ್ಸರಗಳನ್ನು ಖಂಡಿಸುವ ಜ್ಞಾನಾಯುಧಗಳು.",
        spiritualMeaningEnglish: "The divine implements symbolize the destruction of ego, ignorance, and inner vices, granting spiritual liberation."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಜತೆ",
        originalTextKannada: "ದುರ್ಗೆ ಹಾ ಹೇ ಹೋ ಹಾ ದುರ್ಗೆ ಮಂಗಳ ದುರ್ಗೆ\nದುರ್ಗತಿ ಕೊಡದಿರು ವಿಜಯವಿಠ್ಠಲ ಪ್ರಿಯೆ",
        originalTextTransliteration: "Durge haa he ho haa durge mangala durge\ndurgati kodadiru vijayavitthala priye",
        wordByWordBreakdown: [
          { kannadaWord: "ಮಂಗಳ ದುರ್ಗೆ", transliteration: "mangala durge", meaningKannada: "ಸಕಲ ಶುಭಗಳನ್ನು ನೀಡುವ ದುರ್ಗೆ", meaningEnglish: "Auspicious Durga" },
          { kannadaWord: "ದುರ್ಗತಿ ಕೊಡದಿರು", transliteration: "durgati kodadiru", meaningKannada: "ಅಧೋಗತಿಯನ್ನು ತಪ್ಪಿಸು / ಸದ್ಗತಿಯನ್ನು ಕರುಣಿಸು", meaningEnglish: "Do not let me fall into degradation" },
          { kannadaWord: "ವಿಜಯವಿಠ್ಠಲ ಪ್ರಿಯೆ", transliteration: "vijayavitthala priye", meaningKannada: "ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನಿಗೆ ಅತ್ಯಂತ ಪ್ರಿಯಳಾದವಳು", meaningEnglish: "Beloved of Lord Vijaya Vittala" }
        ],
        anvayaKannada: "ಹಾ ಹೇ ಹೋ ಹಾ ದುರ್ಗೆ! ಸಕಲ ಮಂಗಳದಾಯಿನಿಯಾದ ಮಹಾದುರ್ಗೆಯೇ! ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನ ಪ್ರಿಯಳಾದ ಜನನಿಯೇ, ನಮಗೆ ಎಂದೂ ದುರ್ಗತಿಯನ್ನು ಕೊಡದೆ ಸದಾ ಸದ್ಗತಿಯನ್ನು ಕರುಣಿಸು.",
        anvayaEnglish: "O Auspicious Durga, beloved consort of Vijaya Vittala! Rescue us from moral degradation and guide us eternally toward the supreme path.",
        spiritualMeaningKannada: "ಸೂಳಾದಿಯ ಅಂತಿಮ ಜತೆಯು ಅಖಂಡ ಮಂಗಳ ಮತ್ತು ವಿಜಯವಿಠ್ಠಲನ ಪ್ರೀತಿಯನ್ನು ಬೇಡುವ ಪರಮ ಪ್ರಾರ್ಥನೆ.",
        spiritualMeaningEnglish: "The definitive closing couplet invoking auspiciousness and perpetual shelter in divine grace."
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
    historicalContextKannada: "ವಿಜಯದಾಸರು ಪ್ರಹ್ಲಾದನಿಗೆ ಒಲಿದ ಭಕ್ತವತ್ಸಲ ನರಸಿಂಹ ದೇವರನ್ನು ಧ್ಯಾನಿಸುತ್ತಾ ಸಕಲ ಸಂಸಾರ ಭಯ ಮತ್ತು ಅರಿಷಡ್ವರ್ಗಗಳ ನಿವಾರಣೆಗಾಗಿ ಧ್ರುವ, ಮಟ್ಟ, ರೂಪಕಾದಿ ಸಪ್ತತಾಳಗಳಲ್ಲಿ ರಚಿಸಿದ ಪೂರ್ಣ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Composed by Sri Vijaya Dasa invoking Lord Narasimha's transcendental ferocity toward adharma and ocean-like benevolence toward surrendered seekers across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಮಾಲಿಕಾ / ಸಂಪ್ರದಾಯ ಸೂಳಾದಿ ರಾಗ",
    talaTradition: "ಧ್ರುವ ತಾಳಾದಿ ಸಪ್ತತಾಳ",
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರ ಈ ಸೂಳಾದಿಯು ನರಸಿಂಹ ತತ್ತ್ವದ ಸಮಗ್ರ ವಿವರಣೆ ನೀಡುತ್ತದೆ. ಭಗವಂತನು ಭಕ್ತರ ಭಯ ನಿವಾರಕನಾಗಿ, ಅಜ್ಞಾನ ಮತ್ತು ಅಹಂಕಾರವೆಂಬ ಹಿರಣ್ಯಕಶಿಪುವನ್ನು ಸೀಳಿ ಭಕ್ತ ಪ್ರಹ್ಲಾದನಿಗೆ ಜ್ಞಾನ ಭಕ್ತಿಯನ್ನು ಕರುಣಿಸಿದ ಮಹಾಮಹಿಮೆಯನ್ನು ಸ್ತುತಿಸುತ್ತದೆ.",
    comprehensiveSummaryEnglish: "A masterwork Suladi establishing the absolute sovereignty and accessibility of Lord Narasimha, bridging philosophical rigour with intense personal surrender.",
    modernTakeawayKannada: "ಬದುಕಿನಲ್ಲಿ ಎದುರಾಗುವ ಭಯ, ಅಸ್ಥಿರತೆ ಮತ್ತು ಅನ್ಯಾಯದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಕುಗ್ಗದೆ ಸತ್ಯದ ಮಾರ್ಗದಲ್ಲಿ ಧೃಢವಾಗಿ ನಿಲ್ಲಲು ಈ ಕೃತಿ ಆತ್ಮಸ್ಥೈರ್ಯ ನೀಡುತ್ತದೆ.",
    modernTakeawayEnglish: "Cultivates psychological resilience against fear and external tumult by rooting internal trust in higher righteous justice.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಧ್ರುವ ತಾಳ",
        originalTextKannada: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ\nಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ\nಮೂರು ಲೋಕದ ರಕ್ಷಕನೆ ಸದ್ಗುಣ\nಭೂರಿ ಮಹಿಮ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗ",
        originalTextTransliteration: "Veera simhane narasimhane daya\npaaraavaarane bhaya nivaarana nirguna\nmooru lokada rakshakane sadguna\nbhoori mahima sri vijaya vitthala narasinga",
        wordByWordBreakdown: [
          { kannadaWord: "ವೀರ ಸಿಂಹನೆ", transliteration: "veera simhane", meaningKannada: "ವೀರಾಗ್ರಣಿಯಾದ ದೈವಿಕ ಸಿಂಹವೇ", meaningEnglish: "Valiant divine lion" },
          { kannadaWord: "ದಯ ಪಾರಾವಾರನೆ", transliteration: "daya paaraavaarane", meaningKannada: "ಕರುಣೆಯ ಮಹಾಸಮುದ್ರವೇ", meaningEnglish: "Ocean of unconditioned mercy" },
          { kannadaWord: "ಭಯ ನಿವಾರಣ", transliteration: "bhaya nivaarana", meaningKannada: "ಸಂಸಾರದ ಭಯವನ್ನು ಹೊಡೆದೋಡಿಸುವವನೇ", meaningEnglish: "Dispeller of existential fear" }
        ],
        anvayaKannada: "ವೀರ ಸಿಂಹನೆ, ನಾರಸಿಂಹನೆ, ದಯೆಯ ಪಾರಾವಾರನೇ, ಭಯ ನಿವಾರಕನೇ, ಮೂರು ಲೋಕಗಳ ರಕ್ಷಕನೇ, ಸದ್ಗುಣ-ಮಹಿಮೆಗಳುಳ್ಳ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗನೇ ನಿನಗೆ ನಮಸ್ಕಾರ.",
        anvayaEnglish: "O Valiant Lion, O Narasimha, an infinite ocean of grace, dispeller of mortal dread, protector of the threefold cosmos, O Vijaya Vittala Narasinga!",
        spiritualMeaningKannada: "ಭಗವಂತನ ನರಸಿಂಹ ರೂಪವು ದುಷ್ಟರಿಗೆ ಭಯಂಕರನಾದರೂ ಶರಣಾದ ಭಕ್ತರಿಗೆ ದಯಾಸಮುದ್ರ ಎಂಬ ತತ್ತ್ವವನ್ನು ವಿಜಯದಾಸರು ಇಲ್ಲಿ ಸ್ಥಾಪಿಸಿದ್ದಾರೆ.",
        spiritualMeaningEnglish: "Reconciles the paradox of divine ferocity toward evil and tender shelter toward sincere seekers."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಮಟ್ಟ ತಾಳ",
        originalTextKannada: "ಪ್ರಹ್ಲಾದನ ಮೊರೆ ಕೇಳಿ ಕಂಬದಿಂದೊಗೆದ\nಕ್ರೂರ ದಾನವನ ಉದರವ ಬಗೆದ\nನಾರಸಿಂಹನೆ ನಿನ್ನ ಚರಣ ಕಮಲವ\nಸೇರಿದ ಭಕ್ತರ ಸಲಹೋ ವಿಜಯವಿಠ್ಠಲ ರಂಗ",
        originalTextTransliteration: "Prahlaadana more keli kambadindogeda\nkroora daanavana udarava bageda\nnaarasimhane ninna charana kamalava\nserida bhaktara salaho vijayavitthala ranga",
        wordByWordBreakdown: [
          { kannadaWord: "ಕಂಬದಿಂದೊಗೆದ", transliteration: "kambadindogeda", meaningKannada: "ಕಂಬದಿಂದ ಹೊರಹೊಮ್ಮಿದವನು", meaningEnglish: "Manifested from within the pillar" },
          { kannadaWord: "ಉದರವ ಬಗೆದ", transliteration: "udarava bageda", meaningKannada: "ಹೊಟ್ಟೆಯನ್ನು ಸೀಳಿದವನು", meaningEnglish: "Tore open the abdomen" }
        ],
        anvayaKannada: "ಪ್ರಹ್ಲಾದನ ಆರ್ತ ಮೊರೆಯನ್ನು ಕೇಳಿ ಕಂಬದಿಂದ ಪ್ರಕಟವಾಗಿ, ಕ್ರೂರ ಹಿರಣ್ಯಕಶಿಪುವಿನ ಉದರವನ್ನು ಬಗೆದ ನಾರಸಿಂಹನೇ, ನಿನ್ನ ಚರಣ ಕಮಲಗಳನ್ನು ಸೇರಿದ ಭಕ್ತರನ್ನು ಸಲಹು ವಿಜಯವಿಠ್ಠಲ ರಂಗ.",
        anvayaEnglish: "Hearing the earnest plea of Prahlada, you manifested from the pillar and destroyed the demon. Protect those who surrender at your feet, O Vijaya Vittala!",
        spiritualMeaningKannada: "ಭಕ್ತನ ಸತ್ಯನಿಷ್ಠೆಯನ್ನು ಎತ್ತಿಹಿಡಿಯಲು ಭಗವಂತನು ಎಲ್ಲೆಲ್ಲೂ ತಕ್ಷಣ ಪ್ರತ್ಯಕ್ಷನಾಗುತ್ತಾನೆ ಎಂಬ ದೃಢ ವಿಶ್ವಾಸ.",
        spiritualMeaningEnglish: "Affirms omnipresence and the immediacy of divine intervention for dedicated seekers."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಜತೆ",
        originalTextKannada: "ಭಯ ನಿವಾರಣ ಭಕ್ತ ರಕ್ಷಣ ದುರಿತ ಸಂಹಾರ\nದಯಮಾಡೋ ವಿಜಯವಿಠ್ಠಲ ನರಸಿಂಹ",
        originalTextTransliteration: "Bhaya nivaarana bhakta rakshana durita samhaara\ndayamaado vijayavitthala narasimha",
        wordByWordBreakdown: [
          { kannadaWord: "ದುರಿತ ಸಂಹಾರ", transliteration: "durita samhaara", meaningKannada: "ಸಂಕಟಗಳ ನಾಶ", meaningEnglish: "Dispeller of sorrow" },
          { kannadaWord: "ದಯಮಾಡೋ", transliteration: "dayamaado", meaningKannada: "ಕೃಪೆ ತೋರು", meaningEnglish: "Bestow grace" }
        ],
        anvayaKannada: "ಭಯವನ್ನು ನಿವಾರಿಸಿ, ಭಕ್ತರನ್ನು ಸಂರಕ್ಷಿಸಿ, ದುರಿತಗಳನ್ನು ಪರಿಹರಿಸುವ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲ ನರಸಿಂಹನೇ, ಕೃಪೆ ಮಾಡು.",
        anvayaEnglish: "Dispelling dread and safeguarding your devotees, bestow your grace, O Vijaya Vittala Narasimha!",
        spiritualMeaningKannada: "ಅಂತಿಮ ಶರಣಾಗತಿಯಿಂದ ಮಾತ್ರ ಭವಭಯ ನಾಶವಾಗುತ್ತದೆ ಎಂಬ ಸಾರ.",
        spiritualMeaningEnglish: "The concluding takeaway emphasizing total divine refuge."
      }
    ]
  },
  tarakka: {
    titleKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ (ಮುಂಡಿಗೆ)",
    titleEnglish: "Tarakka Bindige (Mundige)",
    composerKannada: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Sri Purandara Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ 'ಮುಂಡಿಗೆ' (ರೂಪಕ ಕವನ). ಮೇಲ್ನೋಟಕ್ಕೆ ಗೃಹಿಣಿಯೊಬ್ಬಳು ನೀರಿಗೆ ಹೋಗುವ ಜನಪದ ಕಥೆಯಂತೆ ಕಂಡರೂ, ಅಂತರಂಗದಲ್ಲಿ ನವದ್ವಾರ ಶರೀರ ಮತ್ತು ಭಕ್ತಿ-ಮೋಕ್ಷದ ಗೂಢಾರ್ಥವನ್ನು ಹೊಂದಿದೆ.",
    historicalContextEnglish: "Purandara Dasa's cryptic riddle-song (Mundige) presenting a profound yogic allegory on the mortal physical body and salvation.",
    compositionType: "ಮುಂಡಿಗೆ",
    ragaTradition: "ತಿಲಂಗ್ / ಭೈರವಿ / ಕಾಪಿ",
    talaTradition: "ಆದಿ ತಾಳ",
    comprehensiveSummaryKannada: "ಪುರಂದರದಾಸರು ಮಾನವ ಶರೀರದ ಅನಿತ್ಯತೆಯನ್ನು ಅರಿತು ಭಗವದ್ಭಕ್ತಿಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳುವುದು ಇದರ ಸಂದೇಶ ಎಂದು ಬೋಧಿಸಿದ್ದಾರೆ.",
    comprehensiveSummaryEnglish: "A sublime example of Dasa Mundige poetry where rural idioms veil profound truths of physical impermanence.",
    modernTakeawayKannada: "ನಮ್ಮ ಬಾಹ್ಯ ಸೌಂದರ್ಯ ಹಾಗೂ ಲೌಕಿಕ ಸಂಪತ್ತಿನ ಬಗ್ಗೆ ಅಹಂಕಾರ ಪಡದೆ, ಸಿಕ್ಕಿರುವ ಅಲ್ಪಾಯುಷ್ಯದಲ್ಲಿ ಸಾರ್ಥಕ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಬೇಕು.",
    modernTakeawayEnglish: "Do not dwell on vanity; recognize life's fragility and invest energy in meaningful inner growth.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ\nಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು\nತಂದೆ ತಾಯಿಯಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆ",
        originalTextTransliteration: "Tarakka bindige neerige hogona baare cheluve\nbindige odedare ombattu thootu\ntande taayiyillada tabbali bindige",
        wordByWordBreakdown: [
          { kannadaWord: "ತಾರಕ್ಕ", transliteration: "tarakka", meaningKannada: "ತಾರಮ್ಮ / ಎಲೈ ಚೇತನವೇ", meaningEnglish: "O soul / dear companion" },
          { kannadaWord: "ಬಿಂದಿಗೆ", transliteration: "bindige", meaningKannada: "ನೀರಿನ ಕೊಡ (ಮಾನವ ಶರೀರ)", meaningEnglish: "Water pot (physical vessel)" },
          { kannadaWord: "ಒಂಬತ್ತು ತೂತು", transliteration: "ombattu thootu", meaningKannada: "ನವದ್ವಾರಗಳುಳ್ಳದ್ದು", meaningEnglish: "Nine bodily orifices" }
        ],
        anvayaKannada: "ಎಲೈ ಚೆಲುವೆಯಾದ ಜೀವಿಯೇ, ಬಿಂದಿಗೆಯನ್ನು ತಾ, ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ. ಆದರೆ ಈ ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತುಗಳುಳ್ಳದ್ದು, ಯಾರೂ ಶಾಶ್ವತ ರಕ್ಷಕರಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆಯಿದು.",
        anvayaEnglish: "Bring the pitcher, O fair soul, let us fetch water! Beware: if this pot cracks, it displays nine holes; it is an orphaned, transient vessel.",
        spiritualMeaningKannada: "ಬಿಂದಿಗೆ ಎಂದರೆ ನವದ್ವಾರಗಳುಳ್ಳ ಮಾನವ ಶರೀರ. ಇದನ್ನು ಮುರಿದುಹೋಗುವ ಮುನ್ನವೇ ಸದ್ವಿನಿಯೋಗಪಡಿಸಿಕೊಳ್ಳಬೇಕು.",
        spiritualMeaningEnglish: "The fragile pitcher symbolizes the mortal nine-portal human frame (Navadvaara) needing divine shelter."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಎಂಟು ಮುತ್ತಿನ ಬಿಂದಿಗೆ ನಟ್ಟನಡುವೆ ರತ್ನದ ಬಿಂದಿಗೆ\nಕಟ್ಟಿದ ಸೂತ್ರ ಮುರಿದು ಹೋದರೆ\nಚಿಟ್ಟನೆ ಬಿಂದಿಗೆ ಒಡೆದು ಹೋಯಿತಲ್ಲೊ",
        originalTextTransliteration: "Entu muttina bindige nattanaduve ratnada bindige\nkattida sootra muridu hodare\nchittane bindige odedu hoyitallo",
        wordByWordBreakdown: [
          { kannadaWord: "ಎಂಟು ಮುತ್ತು", transliteration: "entu muttu", meaningKannada: "ಅಷ್ಟ ಪ್ರಕೃತಿಗಳು / ಅಷ್ಟ ದಳಗಳು", meaningEnglish: "Eightfold subtle bodily nature" },
          { kannadaWord: "ಸೂತ್ರ", transliteration: "sootra", meaningKannada: "ಆಯುಷ್ಯ / ಶ್ವಾಸದ ದಾರ", meaningEnglish: "Thread of breath/lifespan" }
        ],
        anvayaKannada: "ಅಷ್ಟ ದಳಗಳಂತಿರುವ ಈ ಶರೀರದ ನಟ್ಟನಡುವೆ ಜೀವ ಚೈತನ್ಯವಿದೆ. ಕಟ್ಟಿದ ಶ್ವಾಸವೆಂಬ ಸೂತ್ರ ತುಂಡಾದರೆ ಈ ಮಣ್ಣಿನ ಬಿಂದಿಗೆ ತಕ್ಷಣ ಒಡೆದುಹೋಗುತ್ತದೆ.",
        anvayaEnglish: "Endowed with eight subtle faculties and the jewel of consciousness within; once the cord of breath breaks, the vessel shatters instantly.",
        spiritualMeaningKannada: "ಯೋಗ ಶಾಸ್ತ್ರದ ನಾಡಿಗಳು ಹಾಗೂ ಪ್ರಾಣವಾಯುವಿನ ಬಂಧನ ಮುಗಿದ ಕ್ಷಣ ಶರೀರ ನಷ್ಟವಾಗುವ ಸತ್ಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
        spiritualMeaningEnglish: "Refers to the subtle yogic Nadis anchored by the vital breath."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಸತ್ಯವೆಂಬೊ ಹಗ್ಗವ ಕಟ್ಟಿ ಭಕ್ತಿಯೆಂಬೊ ನೀರನು ಸೇದಿ\nಮುಕ್ತಿಯೆಂಬೊ ಘಟವ ತುಂಬಿ\nಪುರಂದರ ವಿಠ್ಠಲನ ಪಾದವ ಸೇರೋ",
        originalTextTransliteration: "Satyavembo haggava katti bhaktiyembo neeranu sedi\nmuktiyembo ghatava tumbi\npurandara vittalana paadava sero",
        wordByWordBreakdown: [
          { kannadaWord: "ಸತ್ಯವೆಂಬೊ ಹಗ್ಗ", transliteration: "satyavembo hagga", meaningKannada: "ಸತ್ಯದ ಹಗ್ಗ", meaningEnglish: "Rope of truth" },
          { kannadaWord: "ಭಕ್ತಿಯೆಂಬೊ ನೀರು", transliteration: "bhaktiyembo neeru", meaningKannada: "ಭಕ್ತಿಯ ಜಲ", meaningEnglish: "Water of devotion" }
        ],
        anvayaKannada: "ಸತ್ಯವೆಂಬ ಹಗ್ಗವನ್ನು ಕಟ್ಟಿ, ಭಕ್ತಿಯೆಂಬ ನೀರನ್ನು ಸೇದಿ, ಮುಕ್ತಿಯೆಂಬ ಘಟವನ್ನು ತುಂಬಿಕೊಂಡು ಶ್ರೀ ಪುರಂದರ ವಿಠ್ಠಲನ ಪಾದಗಳನ್ನು ಸೇರು.",
        anvayaEnglish: "Fasten the rope of truth, draw forth the water of pure devotion, fill the vessel of salvation, and reach the feet of Purandara Vittala!",
        spiritualMeaningKannada: "ರೂಪಕದ ರಹಸ್ಯ: ಕೇವಲ ಸತ್ಯ ಮತ್ತು ಭಕ್ತಿಯಿಂದಲೇ ಮೋಕ್ಷವೆಂಬ ಅಮೃತವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯ.",
        spiritualMeaningEnglish: "The resolution of the riddle: truth and devotion alone unlock eternal freedom."
      }
    ],
    metaphorsAndMundige: [
      {
        allegoryKannada: "ಬಿಂದಿಗೆ ಮತ್ತು ಒಂಬತ್ತು ತೂತು (Nine-holed Pot)",
        allegoryEnglish: "The Water Pot with Nine Holes",
        outerMeaningKannada: "ನದಿಗೆ ಕೊಂಡೊಯ್ಯುವ ಮಣ್ಣಿನ ಕೊಡ, ಒಡೆದರೆ ಒಂಬತ್ತು ಹೋಳಾಗುತ್ತದೆ.",
        outerMeaningEnglish: "A fragile earthenware pot carried to fetch water from the river.",
        esotericMeaningKannada: "ಭಗವದ್ಗೀತೆಯ 'ನವದ್ವಾರೇ ಪುರೇ ದೇಹೀ' ಎಂಬಂತೆ ಒಂಬತ್ತು ಇಂದ್ರಿಯ ದ್ವಾರಗಳುಳ್ಳ ನಶ್ವರ ಮಾನವ ಶರೀರ.",
        esotericMeaningEnglish: "The physical human anatomy with its nine portals (eyes, ears, nostrils, mouth, excretory passages)."
      }
    ]
  },
  manava: {
    titleKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
    titleEnglish: "Manava Janma Doddadu",
    composerKannada: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Sri Vijaya Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ವೈರಾಗ್ಯ ಗೀತೆ. ಮನುಷ್ಯ ಜನ್ಮದ ಮಹತ್ವ ಮತ್ತು ಹರಿನಾಮ ಸ್ಮರಣೆಯ ಅನಿವಾರ್ಯತೆಯನ್ನು ಸಾರುವ ಸರ್ವಕಾಲಿಕ ಕೃತಿ.",
    historicalContextEnglish: "Purandara Dasa's timeless wake-up call articulating the immense rarity of conscious human embodiment.",
    compositionType: "ಕೀರ್ತನೆ / ದೇವರನಾಮ",
    ragaTradition: "ರಾಗಮಾಲಿಕೆ / ಭೈರವಿ",
    talaTradition: "ಆದಿ ತಾಳ",
    comprehensiveSummaryKannada: "ಮನುಷ್ಯ ಜನ್ಮದ ಮಹತ್ವ ಮತ್ತು ಕಾಲದ ಬೆಲೆಯನ್ನು ಸಾರುವ ಸರ್ವಕಾಲಿಕ ಕೃತಿ. ಸತ್ಕರ್ಮಗಳೇ ಶಾಶ್ವತ ಎಂದು ಪುರಂದರದಾಸರು ಬೋಧಿಸುತ್ತಾರೆ.",
    comprehensiveSummaryEnglish: "An existential masterpiece imploring humanity to seize conscious life for moral elevation.",
    modernTakeawayKannada: "ಕಾಲ ಮತ್ತು ಅವಕಾಶಗಳು ಶಾಶ್ವತವಲ್ಲ. ಇಂದೇ ಸತ್ಕಾರ್ಯಗಳಲ್ಲಿ ತೊಡಗಿಕೊಳ್ಳುವುದು ಜಾಣತನ.",
    modernTakeawayEnglish: "Time is irreplaceable. Stop procrastinating meaningful inner growth.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ\nಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
        originalTextTransliteration: "Manava janma doddadu idanu haani maadalibeedi huchappagalira\nmanava janma doddadu",
        wordByWordBreakdown: [
          { kannadaWord: "ಮಾನವ ಜನ್ಮ", transliteration: "manava janma", meaningKannada: "ಮನುಷ್ಯನಾಗಿ ಹುಟ್ಟಿದ ಅವಸ್ಥೆ", meaningEnglish: "Human embodiment" },
          { kannadaWord: "ದೊಡ್ಡದು", transliteration: "doddadu", meaningKannada: "ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಹಾಗೂ ದುರ್ಲಭವಾದದ್ದು", meaningEnglish: "Priceless and rare" }
        ],
        anvayaKannada: "ಎಲೈ ಭ್ರಾಂತರಾದ ಹುಚ್ಚಪ್ಪಗಳಿರಾ! ಮಾನವ ಜನ್ಮವು ಅತ್ಯಂತ ದೊಡ್ಡದು (ದುರ್ಲಭವಾದದ್ದು). ಇದನ್ನು ವ್ಯರ್ಥವಾಗಿ ಹಾಳು ಮಾಡಬೇಡಿ.",
        anvayaEnglish: "O infatuated mortals! The human birth is exceedingly precious and rare. Do not squander it away!",
        spiritualMeaningKannada: "ಮನುಷ್ಯ ಜನ್ಮ ಮಾತ್ರ ವಿವೇಕ ಮತ್ತು ಮೋಕ್ಷ ಸಾಧನೆಗೆ ಯೋಗ್ಯವಾದದ್ದು.",
        spiritualMeaningEnglish: "Human consciousness alone grants moral self-determination and spiritual liberation."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಕಷ್ಟಪಟ್ಟು ಗಳಿಸಿದ ಸಂಪತ್ತು ಬಿಟ್ಟು ಹೋಗುವುದು\nಹೆತ್ತವರು ಹೊತ್ತವರು ಜೊತೆಗೆ ಬಾರರು\nಸತ್ಯ ಸತ್ಕರ್ಮಗಳೇ ಜೀವದ ಒಡವೆಗಳೆಂದು\nಹೊತ್ತಾರೆದ್ದು ಹರಿನಾಮವ ನೆನೆಯಿರೊ",
        originalTextTransliteration: "Kashtapattu galisida sampattu bittu hoguvudu\nhettavaru hottavaru jotege baararu\nsatya satkarmagale jeevada odavegalendu\nhottaareddu harinaamava neneyiro",
        wordByWordBreakdown: [
          { kannadaWord: "ಗಳಿಸಿದ ಸಂಪತ್ತು", transliteration: "galisida sampattu", meaningKannada: "ಸಂಗ್ರಹಿಸಿದ ಹಣ", meaningEnglish: "Accumulated wealth" },
          { kannadaWord: "ಸತ್ಕರ್ಮ", transliteration: "satkarma", meaningKannada: "ಒಳ್ಳೆಯ ಕಾರ್ಯಗಳು", meaningEnglish: "Righteous deeds" }
        ],
        anvayaKannada: "ಗಳಿಸಿದ ಐಶ್ವರ್ಯ ಇಲ್ಲಿಯೇ ಉಳಿಯುತ್ತದೆ; ಯಾರೂ ಜೊತೆಗೆ ಬರುವುದಿಲ್ಲ. ಸತ್ಯ ಮತ್ತು ಸತ್ಕರ್ಮಗಳೇ ಶಾಶ್ವತವೆಂದು ತಿಳಿದು ಹರಿನಾಮವನ್ನು ಸ್ಮರಿಸಿ.",
        anvayaEnglish: "Material riches remain behind, and kin cannot accompany you. Truth and good deeds are your sole enduring assets; remember the divine name!",
        spiritualMeaningKannada: "ಲೌಕಿಕ ಆಸ್ತಿಪಾಸ್ತಿಗಳು ಅಶಾಶ್ವತ; ಕೇವಲ ಪುಣ್ಯಕರ್ಮಗಳೇ ಸದ್ಗತಿಯನ್ನು ನೀಡುತ್ತವೆ.",
        spiritualMeaningEnglish: "Worldly wealth is ephemeral; virtuous character alone accompanies the soul."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಆಸೆಯೆಂಬ ನದಿಯೊಳು ಮುಳುಗಿ ಸಾಯಬೇಡಿ\nಕೇಶವನ ದಿವ್ಯ ನಾಮ ನಾವೆಯ ಮಾಡಿಕೊಳ್ಳಿ\nದಾಸವರೇಣ್ಯ ಪುರಂದರವಿಠ್ಠಲನ ನೆನೆದು\nಲೇಸಾಗಿ ಮುಕ್ತಿಯ ಪಥವ ಸೇರಿರೊ",
        originalTextTransliteration: "Aaseyemba nadiyolu mulugi saayabeedi\nkeshavana divya naama naaveya maadikolli\ndaasavarenya purandaravittalana nenedu\nlesaagi muktiya pathava seriro",
        wordByWordBreakdown: [
          { kannadaWord: "ಆಸೆಯೆಂಬ ನದಿ", transliteration: "aaseyemba nadi", meaningKannada: "ತೀರದ ಆಸೆಗಳು", meaningEnglish: "River of desires" },
          { kannadaWord: "ನಾವೆ", transliteration: "naave", meaningKannada: "ದೋಣಿ", meaningEnglish: "Boat" }
        ],
        anvayaKannada: "ಆಸೆಯೆಂಬ ನದಿಯಲ್ಲಿ ಮುಳುಗದೆ, ಕೇಶವನ ನಾಮವೆಂಬ ನಾವೆಯನ್ನು ಹಿಡಿದು ಪುರಂದರವಿಠ್ಠಲನ ಕೃಪೆಯಿಂದ ಮುಕ್ತಿ ಪಥವನ್ನು ಸೇರಿಕೊಳ್ಳಿ.",
        anvayaEnglish: "Do not drown in the torrent of desire; make the Lord's name your rescue vessel and attain liberation by Purandara Vittala's grace.",
        spiritualMeaningKannada: "ಕಾಮಕ್ರೋಧಗಳನ್ನು ದಾಟಲು ಭಗವನ್ನಾಮ ಸ್ಮರಣೆಯೇ ಪರಮ ಸಾಧನ.",
        spiritualMeaningEnglish: "Chanting the sacred name serves as an unsinkable vessel across worldly turbulence."
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
        { error: "Query cannot be empty. ದಯವಿಟ್ಟು ಕೃತಿಯ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ." },
        { status: 400 }
      );
    }

    const qLower = query.toLowerCase();

    // 1. ABSOLUTE DETERMINISTIC OVERRIDES FOR HIGH-ACCURACY MATCHES
    if (
      qLower.includes("ದುರ್ಗಾ") || 
      qLower.includes("ದುರ್ಗೆ") || 
      qLower.includes("durga") ||
      qLower.includes("durge")
    ) {
      return NextResponse.json(PRECACHED_MASTERPIECES.durga);
    }

    if (
      qLower.includes("ನಾರಸಿಂಹ") || 
      qLower.includes("ವೀರ ಸಿಂಹನೆ") || 
      qLower.includes("narasimha") ||
      qLower.includes("narasinga")
    ) {
      return NextResponse.json(PRECACHED_MASTERPIECES.narasimha);
    }

    if (
      qLower.includes("ತಾರಕ್ಕ") || 
      qLower.includes("ಬಿಂದಿಗೆ") || 
      qLower.includes("tarakka") ||
      qLower.includes("bindige")
    ) {
      return NextResponse.json(PRECACHED_MASTERPIECES.tarakka);
    }

    if (
      qLower.includes("ಮಾನವ ಜನ್ಮ") || 
      qLower.includes("ಹುಚ್ಚಪ್ಪಗಳಿರಾ") || 
      qLower.includes("manava")
    ) {
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
2. Complete Stanza Coverage: You MUST reconstruct the FULL composition including Pallavi, Anupallavi, and ALL Charanas or Suladi metric talas (Dhruva, Mattya, Rupaka, Jhampa, Triputa, Atta, Adi, Jathe).
3. Etymological Rigor: Provide accurate, traditional Sanskrit/Kannada word-by-word meanings and natural spoken-order Anvaya.
4. Strict Attribution: Cross-reference against this authentic Haridasa registry:
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

        if (apiResponse.status === 503 || apiResponse.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          apiResponse = await fetch(
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
        }

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