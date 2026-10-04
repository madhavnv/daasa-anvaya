import { NextResponse } from "next/server";

const CANONICAL_HARIDASA_REGISTRY = [
  { ankita: "ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು", era: "1484–1564 CE", location: "Hampi / Pandharpur" },
  { ankita: "ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ", composer: "ಶ್ರೀ ಕನಕ ದಾಸರು", era: "1509–1609 CE", location: "Kaginele" },
  { ankita: "ವಿಜಯ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವಿಜಯ ದಾಸರು", era: "1682–1755 CE", location: "Chikalparvi" },
  { ankita: "ಗೋಪಾಲ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಗೋಪಾಲ ದಾಸರು", era: "1721–1762 CE", location: "Mosarakallu" },
  { ankita: "ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಜಗನ್ನಾಥ ದಾಸರು", era: "1727–1809 CE", location: "Manvi" },
  { ankita: "ಹಯವದನ", composer: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು", era: "1480–1600 CE", location: "Sode" },
  { ankita: "ಶ್ರೀವ್ಯಾಸವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವ್ಯಾಸರಾಜ ತೀರ್ಥರು", era: "1460–1539 CE", location: "Hampi" },
  { ankita: "ಶ್ರೀರಂಗವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಶ್ರೀಪಾದರಾಜರು", era: "1422–1480 CE", location: "Mulbagal" },
  { ankita: "ಪ್ರಾಣೇಶವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪ್ರಾಣೇಶ ದಾಸರು", era: "1744–1823 CE", location: "Lingasugur" },
  { ankita: "ವರದ ಗೋಪಾಲ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವರದ ಗೋಪಾಲ ದಾಸರು", era: "18th Century", location: "Raichur" },
  { ankita: "ಗುರು ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಮಧ್ವಪತಿ ದಾಸರು", era: "16th Century", location: "Vijayanagara" },
  { ankita: "ಗುರು ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಮೇಧಾವಿ ವೆಂಕಟರಮಣಾಚಾರ್ಯ", era: "19th Century", location: "Manvi" }
];

const PRECACHED_MASTERPIECES: Record<string, any> = {
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
    fullLyricsKannada: `ಧ್ರುವ ತಾಳ:
ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ
ಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ
ಮೂರು ಲೋಕದ ರಕ್ಷಕನೆ ಸದ್ಗುಣ
ಭೂರಿ ಮಹಿಮ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗ

ಮಟ್ಟ ತಾಳ:
ಪ್ರಹ್ಲಾದನ ಮೊರೆ ಕೇಳಿ ಕಂಬದಿಂದೊಗೆದ
ಕ್ರೂರ ದಾನವನ ಉದರವ ಬಗೆದ
ನಾರಸಿಂಹನೆ ನಿನ್ನ ಚರಣ ಕಮಲವ
ಸೇರಿದ ಭಕ್ತರ ಸಲಹೋ ವಿಜಯವಿಠ್ಠಲ ರಂಗ

ಜತೆ:
ಭಯ ನಿವಾರಣ ಭಕ್ತ ರಕ್ಷಣ ದುರಿತ ಸಂಹಾರ
ದಯಮಾಡೋ ವಿಜಯವಿಠ್ಠಲ ನರಸಿಂಹ`,
    classicalRendition: {
      artist: "ವಿದ್ಯಾಭೂಷಣ / ಸಂಪ್ರದಾಯ ಗಾಯಕರು",
      raga: "ರಾಗಮಾಲಿಕೆ",
      tala: "ಸಪ್ತತಾಳ (ಧ್ರುವ, ಮಟ್ಟ, ರೂಪಕ)",
      searchQuery: "Narasimha Suladi Veera Simhane Vidyabhushana",
      sourceNote: "ಸಂಪ್ರದಾಯ ಸೂಳಾದಿ ಶೈಲಿಯ ಶಾಸ್ತ್ರೀಯ ಗಾಯನ"
    },
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
          { kannadaWord: "ಭಯ ನಿವಾರಣ", transliteration: "bhaya nivaarana", meaningKannada: "ಸಂಸಾರದ ಭಯವನ್ನು ಹೊಡೆದೋಡಿಸುವವನೇ", meaningEnglish: "Dispeller of existential fear" },
          { kannadaWord: "ನಿರ್ಗುಣ", transliteration: "nirguna", meaningKannada: "ಪ್ರಾಕೃತ ತ್ರಿಗುಣ ರಹಿತನಾದವನೇ", meaningEnglish: "Free from material gunas" },
          { kannadaWord: "ಭೂರಿ ಮಹಿಮ", transliteration: "bhoori mahima", meaningKannada: "ಅಪಾರ ಮಹಿಮೆಯುಳ್ಳವನೇ", meaningEnglish: "Possessor of boundless glory" }
        ],
        anvayaKannada: "ವೀರ ಸಿಂಹನೆ, ನಾರಸಿಂಹನೆ, ದಯೆಯ ಪಾರಾವಾರನೇ (ಸಮುದ್ರವೇ), ಭಯವನ್ನು ನಿವಾರಣೆ ಮಾಡುವವನೇ, ಪ್ರಾಕೃತ ತ್ರಿಗುಣ ರಹಿತನೇ, ಮೂರು ಲೋಕಗಳನ್ನು ಸಂರಕ್ಷಿಸುವವನೇ, ಅಪಾರ ಸದ್ಗುಣ-ಮಹಿಮೆಗಳುಳ್ಳ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗನೇ ನಿನಗೆ ನಮಸ್ಕಾರ.",
        anvayaEnglish: "O Valiant Lion, O Narasimha, an infinite ocean of grace, dispeller of mortal dread, transcendent beyond worldly gunas, protector of the threefold cosmos, endowed with supreme attributes, O Vijaya Vittala Narasinga!",
        spiritualMeaningKannada: "ಭಗವಂತನ ನರಸಿಂಹ ರೂಪವು ದುಷ್ಟರಿಗೆ ಭಯಂಕರನಾದರೂ ಶರಣಾದ ಭಕ್ತರಿಗೆ ದಯಾಸಮುದ್ರ. ಪ್ರಾಕೃತ ಗುಣಗಳಿಲ್ಲದ ಅಪ್ರಾಕೃತ ದಿವ್ಯ ಮಂಗಳ ಮೂರ್ತಿ ಎಂಬುದನ್ನು ವಿಜಯದಾಸರು ಇಲ್ಲಿ ಸ್ಥಾಪಿಸಿದ್ದಾರೆ.",
        spiritualMeaningEnglish: "Reconciles the paradox of divine ferocity and tender protection. While terror-inducing to evil forces, the Lord is an infinite ocean of protection to the surrendered seeker."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಮಟ್ಟ ತಾಳ",
        originalTextKannada: "ಪ್ರಹ್ಲಾದನ ಮೊರೆ ಕೇಳಿ ಕಂಬದಿಂದೊಗೆದ\nಕ್ರೂರ ದಾನವನ ಉದರವ ಬಗೆದ\nನಾರಸಿಂಹನೆ ನಿನ್ನ ಚರಣ ಕಮಲವ\nಸೇರಿದ ಭಕ್ತರ ಸಲಹೋ ವಿಜಯವಿಠ್ಠಲ ರಂಗ",
        originalTextTransliteration: "Prahlaadana more keli kambadindogeda\nkroora daanavana udarava bageda\nnaarasimhane ninna charana kamalava\nserida bhaktara salaho vijayavitthala ranga",
        wordByWordBreakdown: [
          { kannadaWord: "ಮೊರೆ ಕೇಳಿ", transliteration: "more keli", meaningKannada: "ಪ್ರಾರ್ಥನೆಯನ್ನು ಆಲಿಸಿ", meaningEnglish: "Hearing the earnest cry" },
          { kannadaWord: "ಕಂಬದಿಂದೊಗೆದ", transliteration: "kambadindogeda", meaningKannada: "ಕಂಬದಿಂದ ಹೊರಹೊಮ್ಮಿದವನು", meaningEnglish: "Manifested from within the pillar" },
          { kannadaWord: "ಉದರವ ಬಗೆದ", transliteration: "udarava bageda", meaningKannada: "ಹೊಟ್ಟೆಯನ್ನು ಸೀಳಿದವನು", meaningEnglish: "Tore open the abdomen" },
          { kannadaWord: "ಸಲಹೋ", transliteration: "salaho", meaningKannada: "ಕಾಪಾಡು / ರಕ್ಷಿಸು", meaningEnglish: "Protect and nurture" }
        ],
        anvayaKannada: "ಪ್ರಹ್ಲಾದನ ಆರ್ತ ಮೊರೆಯನ್ನು ಕೇಳಿ ಕಂಬದಿಂದ ಹೊರಹೊಮ್ಮಿ, ಕ್ರೂರ ದಾನವನಾದ ಹಿರಣ್ಯಕಶಿಪುವಿನ ಉದರವನ್ನು ಬಗೆದ ನಾರಸಿಂಹನೆ! ನಿನ್ನ ಚರಣ ಕಮಲಗಳನ್ನು ಸೇರಿದ ಭಕ್ತರನ್ನು ಸದಾ ಸಲಹು ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲ ರಂಗ.",
        anvayaEnglish: "Hearing the desperate prayer of Prahlada, you burst forth from the pillar and tore open the belly of the cruel demon. O Lord Narasimha, nurture and safeguard all seekers who take shelter at your lotus feet!",
        spiritualMeaningKannada: "ಭಗವಂತನು ಸರ್ವವ್ಯಾಪಿ. ಕಲ್ಲಲ್ಲೂ ಕಂಬದಲ್ಲೂ ಭಕ್ತನ ನಂಬಿಕೆಗೆ ಪ್ರತ್ಯಕ್ಷನಾಗುವ ದೈವಿಕ ಸತ್ಯವನ್ನು ಈ ಚರಣ ದೃಢೀಕರಿಸುತ್ತದೆ.",
        spiritualMeaningEnglish: "Affirms divine omnipresence: the Lord manifests instantly even from inanimate stone to preserve the truth of his devotee's word."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಜತೆ",
        originalTextKannada: "ಭಯ ನಿವಾರಣ ಭಕ್ತ ರಕ್ಷಣ ದುರಿತ ಸಂಹಾರ\nದಯಮಾಡೋ ವಿಜಯವಿಠ್ಠಲ ನರಸಿಂಹ",
        originalTextTransliteration: "Bhaya nivaarana bhakta rakshana durita samhaara\ndayamaado vijayavitthala narasimha",
        wordByWordBreakdown: [
          { kannadaWord: "ದುರಿತ ಸಂಹಾರ", transliteration: "durita samhaara", meaningKannada: "ಪಾಪ ಹಾಗೂ ಸಂಕಟಗಳ ನಾಶ", meaningEnglish: "Destroyer of miseries and sins" },
          { kannadaWord: "ದಯಮಾಡೋ", transliteration: "dayamaado", meaningKannada: "ಕೃಪೆ ತೋರು", meaningEnglish: "Bestow your grace" }
        ],
        anvayaKannada: "ಭಯವನ್ನು ನಿವಾರಿಸಿ, ಭಕ್ತರನ್ನು ರಕ್ಷಿಸಿ, ದುರಿತಗಳನ್ನು ಸಂಹಾರ ಮಾಡುವ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲ ನರಸಿಂಹನೇ, ನಮ್ಮ ಮೇಲೆ ನಿನ್ನ ಕೃಪೆಯನ್ನು ಸದಾ ದಯಪಾಲಿಸು.",
        anvayaEnglish: "Dispelling mortal dread, guarding seekers, and obliterating distress—bestow your abiding benediction, O Vijaya Vittala Narasimha!",
        spiritualMeaningKannada: "ಸೂಳಾದಿಯ ಮುಕ್ತಾಯದ ಜತೆಯಲ್ಲಿ ನರಸಿಂಹ ದೇವರಿಂದ ಅಂತಿಮ ಆಭಯ ಹಾಗೂ ಶರಣಾಗತಿಯ ಫಲವನ್ನು ಯಾಚಿಸಲಾಗಿದೆ.",
        spiritualMeaningEnglish: "The concluding Suladi refrain synthesizing ultimate shelter and the removal of existential impediments."
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
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ 'ಮುಂಡಿಗೆ' (ರೂಪಕ ಕವನ). ಮೇಲ್ನೋಟಕ್ಕೆ ಗೃಹಿಣಿಯೊಬ್ಬಳು ನೀರಿಗೆ ಹೋಗುವ ಜನಪದ ಕಥೆಯಂತೆ ಕಂಡರೂ, ಅಂತರಂಗದಲ್ಲಿ ಮಾನವ ದೇಹ, ಕುಂಡಲಿನೀ ಯೋಗ ಮತ್ತು ಸಂಸಾರ ಬಂಧನದ ಪೂರ್ಣ ಗೂಢಾರ್ಥವನ್ನು ಒಳಗೊಂಡಿದೆ.",
    historicalContextEnglish: "One of Purandara Dasa's cryptic riddle-songs (Mundige). On the surface, a woman fetching water; inwardly, a comprehensive yogic allegory on the mortal physical body and salvation.",
    compositionType: "ಮುಂಡಿಗೆ",
    ragaTradition: "ತಿಲಂಗ್ / ಭೈರವಿ / ಕಾಪಿ",
    talaTradition: "ಆದಿ ತಾಳ",
    fullLyricsKannada: `ಪಲ್ಲವಿ:
ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ
ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು
ತಂದೆ ತಾಯಿಯಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆ

ಚರಣ ೧:
ಎಂಟು ಮುತ್ತಿನ ಬಿಂದಿಗೆ ನಟ್ಟನಡುವೆ ರತ್ನದ ಬಿಂದಿಗೆ
ಕಟ್ಟಿದ ಸೂತ್ರ ಮುರಿದು ಹೋದರೆ
ಚಿಟ್ಟನೆ ಬಿಂದಿಗೆ ಒಡೆದು ಹೋಯಿತಲ್ಲೊ

ಚರಣ ೨:
ಸತ್ಯವೆಂಬೊ ಹಗ್ಗವ ಕಟ್ಟಿ ಭಕ್ತಿಯೆಂಬೊ ನೀರನು ಸೇದಿ
ಮುಕ್ತಿಯೆಂಬೊ ಘಟವ ತುಂಬಿ
ಪುರಂದರ ವಿಠ್ಠಲನ ಪಾದವ ಸೇರೋ`,
    classicalRendition: {
      artist: "ಡಾ. ಎಂ. ಬಾಲಮುರಳಿಕೃಷ್ಣ / ಶಾಸ್ತ್ರೀಯ ಗಾಯನ",
      raga: "ತಿಲಂಗ್ (Tilang)",
      tala: "ಆದಿ ತಾಳ",
      searchQuery: "Tarakka Bindige Neerige Hogona Balamuralikrishna",
      sourceNote: "ಮುಂಡಿಗೆಯ ಗಹನ ತತ್ತ್ವವನ್ನು ಬಿಂಬಿಸುವ ಶಾಸ್ತ್ರೀಯ ತಿಲಂಗ್ ರಾಗದ ಗಾಯನ"
    },
    comprehensiveSummaryKannada: "ಪುರಂದರದಾಸರು ಜನಪದ ಗೀತೆಯ ಶೈಲಿಯಲ್ಲಿ ಅತಿ ಗಹನವಾದ ಶಾರೀರಿಕ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಸತ್ಯವನ್ನು ಮುಂಡಿಗೆಯ ರೂಪದಲ್ಲಿ ಅಡಗಿಸಿದ್ದಾರೆ. ಮಾನವ ಶರೀರದ ಅನಿತ್ಯತೆಯನ್ನು ಅರಿತು ಭಗವದ್ಭಕ್ತಿಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳುವುದು ಇದರ ಸಂದೇಶ.",
    comprehensiveSummaryEnglish: "A sublime example of Dasa Mundige poetry where ordinary rural idioms veil profound Upanishadic concepts of physical impermanence and spiritual awakening.",
    modernTakeawayKannada: "ನಮ್ಮ ಬಾಹ್ಯ ಸೌಂದರ್ಯ ಹಾಗೂ ಲೌಕಿಕ ಸಂಪತ್ತಿನ ಬಗ್ಗೆ ಅಹಂಕಾರ ಪಡದೆ, ಸಿಕ್ಕಿರುವ ಅಲ್ಪಾಯುಷ್ಯದಲ್ಲಿ ಸಾರ್ಥಕ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಬೇಕು.",
    modernTakeawayEnglish: "Do not dwell on vanity or ephemeral appearances; recognize life's fragility and invest energy in meaningful endeavors.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ\nಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು\nತಂದೆ ತಾಯಿಯಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆ",
        originalTextTransliteration: "Tarakka bindige neerige hogona baare cheluve\nbindige odedare ombattu thootu\ntande taayiyillada tabbali bindige",
        wordByWordBreakdown: [
          { kannadaWord: "ತಾರಕ್ಕ", transliteration: "tarakka", meaningKannada: "ತಾರಮ್ಮ / ಎಲೈ ಚೇತನವೇ", meaningEnglish: "O soul / dear companion" },
          { kannadaWord: "ಬಿಂದಿಗೆ", transliteration: "bindige", meaningKannada: "ನೀರಿನ ಕೊಡ (ಇಲ್ಲಿ ಮಾನವ ಶರೀರ)", meaningEnglish: "Water pot (physical vessel)" },
          { kannadaWord: "ಒಂಬತ್ತು ತೂತು", transliteration: "ombattu thootu", meaningKannada: "ನವದ್ವಾರಗಳುಳ್ಳದ್ದು", meaningEnglish: "Nine sense orifices" },
          { kannadaWord: "ತಬ್ಬಲಿ ಬಿಂದಿಗೆ", transliteration: "tabbali bindige", meaningKannada: "ಅಶಾಶ್ವತವಾದ ಕಾಯ", meaningEnglish: "Orphaned/fragile vessel" }
        ],
        anvayaKannada: "ಎಲೈ ಚೆಲುವೆಯಾದ ಜೀವಿಯೇ, ಬಿಂದಿಗೆಯನ್ನು ತಾ, ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ. ಆದರೆ ಈ ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತುಗಳುಳ್ಳದ್ದು, ಯಾರೂ ಶಾಶ್ವತ ರಕ್ಷಕರಿಲ್ಲದ ತಬ್ಬಲಿ ಬಿಂದಿಗೆಯಿದು.",
        anvayaEnglish: "Bring the pitcher, O fair soul, let us fetch water! Beware: if this pot cracks, it displays nine holes; it is an orphaned, transient vessel.",
        spiritualMeaningKannada: "ಬಿಂದಿಗೆ ಎಂದರೆ ಮಾನವ ದೇಹ. ನೀರು ಎಂದರೆ ಮೋಕ್ಷ ಅಥವಾ ಭಕ್ತಿರಸ. ದೇಹದಲ್ಲಿ ಎರಡು ಕಣ್ಣು, ಎರಡು ಕಿವಿ, ಎರಡು ನಾಸಿಕ, ಒಂದು ಬಾಯಿ, ಎರಡು ಮಲ-ಮೂತ್ರ ದ್ವಾರಗಳು ಸೇರಿ ಒಂಬತ್ತು ರಂಧ್ರಗಳಿವೆ (ನವದ್ವಾರ ಶರೀರ).",
        spiritualMeaningEnglish: "The pot is the human physical frame. The nine perforations symbolize the nine body portals (Navadvaara). The seeker is urged to fetch the nectar of salvation before the vessel breaks."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಎಂಟು ಮುತ್ತಿನ ಬಿಂದಿಗೆ ನಟ್ಟನಡುವೆ ರತ್ನದ ಬಿಂದಿಗೆ\nಕಟ್ಟಿದ ಸೂತ್ರ ಮುರಿದು ಹೋದರೆ\nಚಿಟ್ಟನೆ ಬಿಂದಿಗೆ ಒಡೆದು ಹೋಯಿತಲ್ಲೊ",
        originalTextTransliteration: "Entu muttina bindige nattanaduve ratnada bindige\nkattida sootra muridu hodare\nchittane bindige odedu hoyitallo",
        wordByWordBreakdown: [
          { kannadaWord: "ಎಂಟು ಮುತ್ತು", transliteration: "entu muttu", meaningKannada: "ಅಷ್ಟ ಪ್ರಕೃತಿಗಳು / ಅಷ್ಟ ದಳ ಪದ್ಮ", meaningEnglish: "Eight elements of nature / eight chakras" },
          { kannadaWord: "ರತ್ನದ ಬಿಂದಿಗೆ", transliteration: "ratnada bindige", meaningKannada: "ಹೃದಯ ಕಮಲದಲ್ಲಿರುವ ಜೀವ ಚೈತನ್ಯ", meaningEnglish: "The jewel of conscious life force" },
          { kannadaWord: "ಸೂತ್ರ", transliteration: "sootra", meaningKannada: "ಆಯುಷ್ಯದ ದಾರ (ಶ್ವಾಸ)", meaningEnglish: "Thread of breath/lifespan" }
        ],
        anvayaKannada: "ಅಷ್ಟ ಪ್ರಕೃತಿಗಳಿಂದ ಕೂಡಿದ ಈ ಶರೀರದ ನಟ್ಟನಡುವೆ ಜೀವಚೈತನ್ಯವೆಂಬ ರತ್ನದ ಬಿಂದಿಗೆಯಿದೆ. ಶ್ವಾಸವೆಂಬ ಕಟ್ಟಿದ ಸೂತ್ರ ಮುರಿದುಹೋದರೆ ಇಡೀ ಬಿಂದಿಗೆಯು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಒಡೆದುಹೋಗುತ್ತದೆ.",
        anvayaEnglish: "Embellished with eightfold subtle elements, holding the gem of life in its center; once the thread of breath snaps, this fragile vessel shatters instantaneously.",
        spiritualMeaningKannada: "ಕುಂಡಲಿನಿಯ ಅಷ್ಟಚಕ್ರಗಳು ಮತ್ತು ಪ್ರಾಣವಾಯುವಿನ ಬಂಧನವನ್ನು ದಾಸರು ಇಲ್ಲಿ ಯೋಗದ ಪರಿಭಾಷೆಯಲ್ಲಿ ನಿರೂಪಿಸಿದ್ದಾರೆ.",
        spiritualMeaningEnglish: "Elucidates the subtle energetic anatomy (Ashta-dalas and Nadis) anchored by the thread of Prana."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಸತ್ಯವೆಂಬೊ ಹಗ್ಗವ ಕಟ್ಟಿ ಭಕ್ತಿಯೆಂಬೊ ನೀರನು ಸೇದಿ\nಮುಕ್ತಿಯೆಂಬೊ ಘಟವ ತುಂಬಿ\nಪುರಂದರ ವಿಠ್ಠಲನ ಪಾದವ ಸೇರೋ",
        originalTextTransliteration: "Satyavembo haggava katti bhaktiyembo neeranu sedi\nmuktiyembo ghatava tumbi\npurandara vittalana paadava sero",
        wordByWordBreakdown: [
          { kannadaWord: "ಸತ್ಯವೆಂಬೊ ಹಗ್ಗ", transliteration: "satyavembo hagga", meaningKannada: "ಸತ್ಯ ಮತ್ತು ಸದಾಚಾರವೆಂಬ ಹಗ್ಗ", meaningEnglish: "Rope of truthfulness" },
          { kannadaWord: "ಭಕ್ತಿಯೆಂಬೊ ನೀರು", transliteration: "bhaktiyembo neeru", meaningKannada: "ಭಕ್ತಿರಸವೆಂಬ ಜಲ", meaningEnglish: "Living waters of devotion" },
          { kannadaWord: "ಮುಕ್ತಿಯೆಂಬೊ ಘಟ", transliteration: "muktiyembo ghata", meaningKannada: "ಮೋಕ್ಷವೆಂಬ ಅಮೃತ ಪಾತ್ರೆ", meaningEnglish: "Vessel filled with liberation" }
        ],
        anvayaKannada: "ಸತ್ಯವೆಂಬ ಹಗ್ಗವನ್ನು ಕಟ್ಟಿ, ಭಕ್ತಿಯೆಂಬ ಪವಿತ್ರ ನೀರನ್ನು ಸೇದಿ, ಮುಕ್ತಿಯೆಂಬ ಘಟವನ್ನು ತುಂಬಿಕೊಂಡು ಶ್ರೀ ಪುರಂದರ ವಿಠ್ಠಲನ ದಿವ್ಯ ಚರಣಗಳನ್ನು ಸೇರು.",
        anvayaEnglish: "Fasten the rope of truth, draw the waters of unblemished devotion, fill your vessel with the nectar of liberation, and merge in devotion at the feet of Purandara Vittala!",
        spiritualMeaningKannada: "ಮುಂಡಿಗೆಯ ಸಮಾಪ್ತಿಯಲ್ಲಿ ಜೀವನದ ನಿಜವಾದ ಗುರಿಯಾದ ಭಗವಂತನ ಶರಣಾಗತಿಯನ್ನು ಪ್ರಕಟಿಸಲಾಗಿದೆ.",
        spiritualMeaningEnglish: "Resolves the riddle by unveiling the definitive spiritual remedy: anchored in truth, drawing divine grace through surrender."
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
    composerEnglish: "Sri Purandara Dasaru (1484–1564 CE)",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    historicalContextKannada: "ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ವೈರಾಗ್ಯ ಗೀತೆ. ಅಸಂಖ್ಯಾತ ಜೀವ ಜನ್ಮಗಳ ನಂತರ ಲಭಿಸಿದ ದುರ್ಲಭವಾದ ಮನುಷ್ಯ ಜನ್ಮವನ್ನು ವ್ಯರ್ಥ ವಿಷಯ ಸುಖಗಳಿಗೆ ಹಾಳುಮಾಡದೆ ಹರಿನಾಮ ಸ್ಮರಣೆಯಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳಬೇಕೆಂದು ಜನಸಾಮಾನ್ಯರಿಗೆ ಎಚ್ಚರಿಸುವ ಪೂರ್ಣ ಕೃತಿ.",
    historicalContextEnglish: "Purandara Dasa's timeless wake-up call articulating the immense rarity of conscious human embodiment and warning against dissipating it in mundane hedonism.",
    compositionType: "ಕೀರ್ತನೆ / ದೇವರನಾಮ",
    ragaTradition: "ರಾಗಮಾಲಿಕೆ / ಭೈರವಿ",
    talaTradition: "ಆದಿ ತಾಳ",
    fullLyricsKannada: `ಪಲ್ಲವಿ:
ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ
ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು

ಚರಣ ೧:
ಕಷ್ಟಪಟ್ಟು ಗಳಿಸಿದ ಸಂಪತ್ತು ಬಿಟ್ಟು ಹೋಗುವುದು
ಹೆತ್ತವರು ಹೊತ್ತವರು ಜೊತೆಗೆ ಬಾರರು
ಸತ್ಯ ಸತ್ಕರ್ಮಗಳೇ ಜೀವದ ಒಡವೆಗಳೆಂದು
ಹೊತ್ತಾರೆದ್ದು ಹರಿನಾಮವ ನೆನೆಯಿರೊ

ಚರಣ ೨:
ಆಸೆಯೆಂಬ ನದಿಯೊಳು ಮುಳುಗಿ ಸಾಯಬೇಡಿ
ಕೇಶವನ ದಿವ್ಯ ನಾಮ ನಾವೆಯ ಮಾಡಿಕೊಳ್ಳಿ
ದಾಸವರೇಣ್ಯ ಪುರಂದರವಿಠ್ಠಲನ ನೆನೆದು
ಲೇಸಾಗಿ ಮುಕ್ತಿಯ ಪಥವ ಸೇರಿರೊ`,
    classicalRendition: {
      artist: "ಪಂ. ಭೀಮಸೇನ ಜೋಶಿ (Pt. Bhimsen Joshi)",
      raga: "ಮಾಂಡ್ / ರಾಗಮಾಲಿಕೆ",
      tala: "ಆದಿ ತಾಳ",
      searchQuery: "Bhimsen Joshi Manava Janma Doddadu Purandara Dasa",
      sourceNote: "ವೈರಾಗ್ಯ ಭಾವದ ಮೇರು ಶಾಸ್ತ್ರೀಯ ಗಾಯನ"
    },
    comprehensiveSummaryKannada: "ಮನುಷ್ಯ ಜನ್ಮದ ಮಹತ್ವ ಮತ್ತು ಕಾಲದ ಬೆಲೆಯನ್ನು ಸಾರುವ ಸರ್ವಕಾಲಿಕ ಕೃತಿ. ವಿಷಯ ಸುಖಗಳೆಲ್ಲ ಅಶಾಶ್ವತ, ಭಗವಂತನ ಧ್ಯಾನ ಮತ್ತು ಸತ್ಕರ್ಮಗಳೇ ಶಾಶ್ವತ ಎಂದು ಪುರಂದರದಾಸರು ಬೋಧಿಸುತ್ತಾರೆ.",
    comprehensiveSummaryEnglish: "An existential masterpiece imploring humanity to seize conscious life for moral elevation and realization rather than mechanical survival.",
    modernTakeawayKannada: "ಕಾಲ ಮತ್ತು ಅವಕಾಶಗಳು ಶಾಶ್ವತವಲ್ಲ. ಮುಂದೂಡುವ ಪ್ರವೃತ್ತಿಯನ್ನು ಬಿಟ್ಟು, ಇಂದೇ ಸತ್ಕಾರ್ಯಗಳಲ್ಲಿ ತೊಡಗಿಕೊಳ್ಳುವುದು ಜಾಣತನ.",
    modernTakeawayEnglish: "Time and conscious health are irreplaceable. Stop procrastinating meaningful inner growth.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಪಲ್ಲವಿ",
        originalTextKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ\nಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು",
        originalTextTransliteration: "Manava janma doddadu idanu haani maadalibeedi huchappagalira\nmanava janma doddadu",
        wordByWordBreakdown: [
          { kannadaWord: "ಮಾನವ ಜನ್ಮ", transliteration: "manava janma", meaningKannada: "ಮನುಷ್ಯನಾಗಿ ಹುಟ್ಟಿದ ಅವಸ್ಥೆ", meaningEnglish: "Human embodiment" },
          { kannadaWord: "ದೊಡ್ಡದು", transliteration: "doddadu", meaningKannada: "ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಹಾಗೂ ದುರ್ಲಭವಾದದ್ದು", meaningEnglish: "Priceless and rare" },
          { kannadaWord: "ಹಾನಿ ಮಾಡಲಿಬೇಡಿ", transliteration: "haani maadalibeedi", meaningKannada: "ವ್ಯರ್ಥವಾಗಿ ಕಳೆದುಕೊಳ್ಳಬೇಡಿ", meaningEnglish: "Do not squander it" }
        ],
        anvayaKannada: "ಎಲೈ ಭ್ರಾಂತರಾದ ಹುಚ್ಚಪ್ಪಗಳಿರಾ! ಮಾನವ ಜನ್ಮವು ಅತ್ಯಂತ ದೊಡ್ಡದು (ದುರ್ಲಭವಾದದ್ದು). ಇದನ್ನು ಕ್ಷುಲ್ಲಕ ವಿಷಯಾಸಕ್ತಿಗಳಿಗೆ ಬಲಿಯಾಗಿಸಿ ವ್ಯರ್ಥವಾಗಿ ಹಾಳು ಮಾಡಬೇಡಿ.",
        anvayaEnglish: "O infatuated mortals! The human birth is exceedingly precious and rare. Do not squander it away in reckless ignorance!",
        spiritualMeaningKannada: "84 ಲಕ್ಷ ಜೀವರಾಶಿಗಳಲ್ಲಿ ಮನುಷ್ಯ ಜನ್ಮ ಮಾತ್ರ ವಿವೇಕ ಮತ್ತು ಮೋಕ್ಷ ಸಾಧನೆಗೆ ಯೋಗ್ಯವಾದದ್ದು. ಇದನ್ನು ಅರಿತು ನಡೆಯಬೇಕು ಎಂಬುದು ಎಚ್ಚರಿಕೆ.",
        spiritualMeaningEnglish: "Human consciousness alone grants moral self-determination and spiritual liberation among millions of lifecycles."
      },
      {
        stanzaNumber: 2,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಕಷ್ಟಪಟ್ಟು ಗಳಿಸಿದ ಸಂಪತ್ತು ಬಿಟ್ಟು ಹೋಗುವುದು\nಹೆತ್ತವರು ಹೊತ್ತವರು ಜೊತೆಗೆ ಬಾರರು\nಸತ್ಯ ಸತ್ಕರ್ಮಗಳೇ ಜೀವದ ಒಡವೆಗಳೆಂದು\nಹೊತ್ತಾರೆದ್ದು ಹರಿನಾಮವ ನೆನೆಯಿರೊ",
        originalTextTransliteration: "Kashtapattu galisida sampattu bittu hoguvudu\nhettavaru hottavaru jotege baararu\nsatya satkarmagale jeevada odavegalendu\nhottaareddu harinaamava neneyiro",
        wordByWordBreakdown: [
          { kannadaWord: "ಗಳಿಸಿದ ಸಂಪತ್ತು", transliteration: "galisida sampattu", meaningKannada: "ಸಂಗ್ರಹಿಸಿದ ಐಶ್ವರ್ಯ", meaningEnglish: "Accumulated wealth" },
          { kannadaWord: "ಹೊತ್ತಾರೆದ್ದು", transliteration: "hottaareddu", meaningKannada: "ಮುಂಜಾನೆಯೇ ಎದ್ದು", meaningEnglish: "Rising early at dawn" },
          { kannadaWord: "ಒಡವೆಗಳು", transliteration: "odavegalu", meaningKannada: "ಆಭರಣಗಳು", meaningEnglish: "True ornaments of the soul" }
        ],
        anvayaKannada: "ಕಷ್ಟಪಟ್ಟು ಗಳಿಸಿದ ಸಂಪತ್ತು ಇಲ್ಲಿಯೇ ಉಳಿದುಹೋಗುತ್ತದೆ; ಹೆತ್ತ ತಂದೆ-ತಾಯಿಯಾಗಲಿ, ಹೊತ್ತವರಾಗಲಿ ಯಾರೂ ಕೊನೆಗೆ ಜೊತೆಗೆ ಬರುವುದಿಲ್ಲ. ಸತ್ಯ ಮತ್ತು ಸತ್ಕರ್ಮಗಳೇ ಜೀವದ ಶಾಶ್ವತ ಆಭರಣಗಳೆಂದು ತಿಳಿದು, ಮುಂಜಾನೆಯೇ ಎದ್ದು ಹರಿನಾಮವನ್ನು ಸ್ಮರಿಸಿ.",
        anvayaEnglish: "Material riches remain behind, and neither parents nor kin follow after death. Truth and virtuous deeds alone constitute the soul's enduring jewels; rise at dawn and meditate upon Hari's name.",
        spiritualMeaningKannada: "ಲೌಕಿಕ ಸಂಬಂಧಗಳು ಹಾಗೂ ಧನ-ಸಂಪತ್ತುಗಳ ಅಶಾಶ್ವತತೆಯನ್ನು ನಿರೂಪಿಸಿ, ಧರ್ಮ ಮತ್ತು ಸತ್ಕರ್ಮಗಳೇ ಪರಲೋಕದ ಆಸರೆ ಎಂದು ಬೋಧಿಸಲಾಗಿದೆ.",
        spiritualMeaningEnglish: "Points out worldly attachments are transient; only spiritual integrity and moral actions accompany the transmigrating self."
      },
      {
        stanzaNumber: 3,
        stanzaType: "ಚರಣ",
        originalTextKannada: "ಆಸೆಯೆಂಬ ನದಿಯೊಳು ಮುಳುಗಿ ಸಾಯಬೇಡಿ\nಕೇಶವನ ದಿವ್ಯ ನಾಮ ನಾವೆಯ ಮಾಡಿಕೊಳ್ಳಿ\nದಾಸವರೇಣ್ಯ ಪುರಂದರವಿಠ್ಠಲನ ನೆನೆದು\nಲೇಸಾಗಿ ಮುಕ್ತಿಯ ಪಥವ ಸೇರಿರೊ",
        originalTextTransliteration: "Aaseyemba nadiyolu mulugi saayabeedi\nkeshavana divya naama naaveya maadikolli\ndaasavarenya purandaravittalana nenedu\nlesaagi muktiya pathava seriro",
        wordByWordBreakdown: [
          { kannadaWord: "ಆಸೆಯೆಂಬ ನದಿ", transliteration: "aaseyemba nadi", meaningKannada: "ತೀರದ ಆಸೆಗಳೆಂಬ ಪ್ರವಾಹ", meaningEnglish: "Turbulent river of insatiable desire" },
          { kannadaWord: "ನಾವೆ", transliteration: "naave", meaningKannada: "ದೋಣಿ", meaningEnglish: "Boat of salvation" },
          { kannadaWord: "ಲೇಸಾಗಿ", transliteration: "lesaagi", meaningKannada: "ಸುಲಭವಾಗಿ / ಸಾರ್ಥಕವಾಗಿ", meaningEnglish: "Gracefully and securely" }
        ],
        anvayaKannada: "ಆಸೆಯೆಂಬ ಅಲೆಯುಳ್ಳ ಸಂಸಾರ ನದಿಯಲ್ಲಿ ಮುಳುಗಿ ಸಾಯಬೇಡಿ; ಶ್ರೀಕೇಶವನ ದಿವ್ಯ ನಾಮವನ್ನು ಭವಸಾಗರ ದಾಟುವ ದೋಣಿಯನ್ನಾಗಿ ಮಾಡಿಕೊಳ್ಳಿ. ಪುರಂದರವಿಠ್ಠಲನ ಪಾದಗಳನ್ನು ನೆನೆದು ಆನಂದದಿಂದ ಮುಕ್ತಿಯ ಪಥವನ್ನು ಸೇರಿಕೊಳ್ಳಿ.",
        anvayaEnglish: "Do not perish drowning in the torrent of desire; make the divine name of Keshava your sturdy boat. Contemplating Purandara Vittala, navigate gracefully to the realm of liberation!",
        spiritualMeaningKannada: "ತೃಷ್ಣೆಯೇ ಸಂಸಾರ ಬಂಧನಕ್ಕೆ ಮೂಲ ಕಾರಣ. ಹರಿನಾಮ ಸ್ಮರಣೆಯೆಂಬ ನಾವೆಯಿಂದ ಈ ಭವಸಾಗರವನ್ನು ದಾಟಬಹುದೆಂಬ ಪೂರ್ಣ ಉಪದೇಶ.",
        spiritualMeaningEnglish: "Desire is the root of existential bondage. Chanting the divine name acts as an unsinkable vessel carrying the seeker safely across Samsara."
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

    const systemPrompt = `You are "Dāsa Bodhini" (ದಾಸ ಬೋಧಿನಿ), the authoritative academic and spiritual workstation for Haridasa Sahitya (1263–1983 CE).
Analyze the query, which may be a first line, a phrase, or a full composition.

MANDATORY INSTRUCTIONS FOR COMPLETE COMPOSITION COVERAGE:
1. Identify the FULL original song from canonical Haridasa records. Do NOT analyze just the snippet or the first stanza.
2. In "fullLyricsKannada", reconstruct the complete, authentic Kannada lyrics of ALL stanzas (Pallavi, Anupallavi, and all Charanas or Suladi Talas).
3. In "stanzas", provide the stanza-by-stanza breakdown, Anvaya (reordered spoken syntax), word-by-word grid, and spiritual essence for EVERY single stanza of the complete work.
4. Adhere strictly to the Haridasa registry for deterministic signature attribution:
${JSON.stringify(CANONICAL_HARIDASA_REGISTRY)}

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
  "fullLyricsKannada": "string (the complete authentic text of the entire composition in Kannada)",
  "classicalRendition": {
    "artist": "string",
    "raga": "string",
    "tala": "string",
    "searchQuery": "string",
    "sourceNote": "string"
  },
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

    const MODELS_TO_TRY = [
      "gemini-3.8-flash",
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash"
    ];

    let rawContent: string | null = null;

    for (const model of MODELS_TO_TRY) {
      try {
        let apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nReconstruct and analyze the COMPLETE Haridasa song based on this query:\n"${query}"` }]
                }
              ],
              generationConfig: {
                temperature: 0.15,
                responseMimeType: "application/json"
              }
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
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\nReconstruct and analyze the COMPLETE Haridasa song based on this query:\n"${query}"` }]
                  }
                ],
                generationConfig: {
                  temperature: 0.15,
                  responseMimeType: "application/json"
                }
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