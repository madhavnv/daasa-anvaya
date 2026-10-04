import { NextRequest, NextResponse } from "next/server";
import { COMPLETE_ANKITHA_CATALOG } from "@/lib/ankithaData";

const ACTIVE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite"
];

// FAST-PATH PRECACHED ENTRIES
const PRECACHED_SONGS: Record<string, any> = {
  "ನಾರಸಿಂಹನೆ": {
    isRecognizedSong: true,
    titleKannada: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ",
    titleEnglish: "Sri Narasimha Suladi",
    composerKannada: "ವಿಜಯ ದಾಸರು",
    composerEnglish: "Vijaya Dasaru",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    youtubeSearchQuery: "Narasimha Suladi Vijaya Dasa",
    historicalContextKannada: "ಶ್ರೀ ವಿಜಯದಾಸರು ನರಸಿಂಹದೇವರ ಉಗ್ರ ಮತ್ತು ಶಾಂತ ರೂಪಗಳೆರಡನ್ನೂ ಸಮ್ಮಿಲನಗೊಳಿಸಿ ರಚಿಸಿದ ತಾತ್ವಿಕ ಸೂಳಾದಿ. ಸಂಸಾರದ ಮೂಲ ಬೇರನ್ನೇ ಕಿತ್ತು ಭಕ್ತರನ್ನು ರಕ್ಷಿಸುವ ಕರುಣೆಯನ್ನು ಇಲ್ಲಿ ಕೊಂಡಾಡಲಾಗಿದೆ.",
    historicalContextEnglish: "Composed by Sri Vijaya Dasa, this Suladi explores both the awe-inspiring, fearsome form of Lord Narasimha and his innate compassion (Karunyapanga) that uproots worldly suffering for surrendered souls.",
    comprehensiveSummaryKannada: "ಭಯಂಕರವಾದ ಮುಖಮುದ್ರೆಯಿಂದ ದುಷ್ಟ ದೈತ್ಯರನ್ನು ಸಂಹರಿಸುವ ನರಸಿಂಹನು, ಭಕ್ತರ ಪಾಲಿಗೆ ಮಾತ್ರ ಅತಿ ಕರುಣಾಮಯಿ. ಆತನ ಧ್ಯಾನವು ಸಂಸಾರವೆಂಬ ಭವಬಂಧನದ ಬೇರನ್ನೇ ಕೀಳಲು ಸಮರ್ಥವೆಂದು ವಿಜಯದಾಸರು ಸಾರಿದ್ದಾರೆ.",
    comprehensiveSummaryEnglish: "While Lord Narasimha strikes terror into demonic forces, he remains the supreme refuge for his devotees. He severs the root of existential entanglements and shields seekers under his compassionate gaze.",
    stanzas: [
      {
        stanzaType: "ಸೂಳಾದಿ ಪಾದ",
        originalKannada: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ ಪಾರಾ\nವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ",
        anvayaKannada: "ವೀರ ಸಿಂಹನೂ ನಾರಸಿಂಹನೂ ಆದ ಹೇ ಸ್ವಾಮಿ, ನೀನು ದಯಾಸಾಗರನು ಹಾಗೂ ಭಕ್ತರ ಸಕಲ ಭಯಗಳನ್ನು ನಿವಾರಿಸುವವನು.",
        anvayaEnglish: "O heroic Lion-Lord Narasimha, boundless ocean of mercy and dispeller of all fear."
      },
      {
        stanzaType: "ಅಂತರ ಪಾದ",
        originalKannada: "ಸಾರಿದವರ ಸಂಸಾರ ವೃಕ್ಷದ ಮೂಲ\nಬೇರರಿಸಿ ಕೀಳುವ ಬಿರಿದು ಭಯಂಕರ\nಘೋರವತಾರ ಕರಾಳವದನ ಅ-\nಘೋರ ದುರಿತ ಸಂಹಾರ ಮಾಯಾಕಾರ",
        anvayaKannada: "ನಿನ್ನನ್ನು ಆಶ್ರಯಿಸಿದವರ ಸಂಸಾರವೆಂಬ ವೃಕ್ಷದ ಬೇರುಗಳನ್ನು ಬುಡಸಮೇತ ಕಿತ್ತೊಗೆಯುವ ಭಯಂಕರ ಬಿರುದು ನಿನ್ನದು; ನೀನು ಘೋರಾವತಾರಿಯೂ, ದುರಿತಗಳನ್ನು ನಾಶಮಾಡುವ ಮಾಯಾಕಾರನೂ ಆಗಿರುವೆ.",
        anvayaEnglish: "Yours is the fierce title that uproots the very tree of worldly transmigration for those who surrender unto You; terrifying in manifestation, yet the absolute destroyer of deep sins."
      },
      {
        stanzaType: "ಅಂತ್ಯ ಪಾದ",
        originalKannada: "ಅರೌದ್ರನಾಮಕ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗ\nವೀರರ ಸಾತುಂಗ ಕಾರುಣ್ಯಪಾಂಗ.",
        anvayaKannada: "ಅರೌದ್ರ ಎಂಬ ಶಾಂತ ಮಂಗಳಕರ ನಾಮವುಳ್ಳ, ವಿಜಯವಿಠ್ಠಲನಾದ ನರಸಿಂಹನೇ, ನೀನು ಶ್ರೇಷ್ಠ ವೀರರಿಗೆಲ್ಲ ಅಗ್ರಗಣ್ಯನೂ ಕೃಪಾದೃಷ್ಟಿಯುಳ್ಳವನೂ ಆಗಿದ್ದೀಯೆ.",
        anvayaEnglish: "Bearing the tranquil name Araudra, O Vijaya Vittala Narasimha, You stand supreme among the valiant, showering boundless compassionate grace."
      }
    ],
    modernTakeawayKannada: "ಆಂತರಿಕ ಭಯ ಮತ್ತು ನಕಾರಾತ್ಮಕ ಯೋಚನೆಗಳನ್ನು ಧೈರ್ಯ ಮತ್ತು ದೈವಸಮರ್ಪಣೆಯಿಂದ ಜಯಿಸಬಹುದು.",
    modernTakeawayEnglish: "Courage and surrender dissolve inner anxieties and uproot lingering existential dread.",
    pratipadaartha: [
      { wordKannada: "ಕಾರುಣ್ಯಪಾಂಗ", wordTransliterated: "Karunyapanga", meaningKannada: "ಕೃಪಾದೃಷ್ಟಿ", meaningEnglish: "Compassionate glance" },
      { wordKannada: "ಅರೌದ್ರ", wordTransliterated: "Araudra", meaningKannada: "ಕ್ರೋಧವಿಲ್ಲದ / ಪ್ರಶಾಂತ", meaningEnglish: "Gentle / Free from wrath" }
    ],
    metaphorsAndMundige: [
      {
        motifKannada: "ಸಂಸಾರ ವೃಕ್ಷದ ಮೂಲ ಬೇರು",
        motifEnglish: "Root of the Transmigration Tree",
        innerMeaningKannada: "ಮಾನವನನ್ನು ಭವಬಂಧನದಲ್ಲಿ ಸಿಲುಕಿಸುವ ಮೂಲ ಕಾಮ-ಕ್ರೋಧ-ಅಜ್ಞಾನಗಳು.",
        innerMeaningEnglish: "The primal roots of ego and ignorance that bind consciousness to cycle of rebirth."
      }
    ]
  },

  "ದುರ್ಗಾ ದುರ್ಗೆಯೆ": {
    isRecognizedSong: true,
    titleKannada: "ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ",
    titleEnglish: "Sri Durga Suladi",
    composerKannada: "ವಿಜಯ ದಾಸರು",
    composerEnglish: "Vijaya Dasaru",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    youtubeSearchQuery: "Durga Suladi Vijaya Dasa",
    historicalContextKannada: "ಕಾಡುಮೇಡುಗಳ ಸಂಕಟ, ಭಯ ಹಾಗೂ ಸಂಸಾರದ ಗೊಂದಲಗಳಿಂದ ಬಿಡುಗಡೆ ಕೋರಿ ಶ್ರೀ ವಿಜಯದಾಸರು ರಚಿಸಿದ ಪ್ರಸಿದ್ಧ ದುರ್ಗಾ ಸ್ತುತಿ.",
    historicalContextEnglish: "A celebrated composition by Vijaya Dasa seeking divine protection against physical perils, wild elements, and deep existential turbulence.",
    comprehensiveSummaryKannada: "ಸೃಷ್ಟಿ-ಸ್ಥಿತಿ-ಲಯಗಳಿಗೆ ಸಾಕ್ಷಿಯಾದ ದುರ್ಗಾದೇವಿಯು ಸಕಲ ಆಪತ್ತುಗಳಿಂದ ಪಾರುಮಾಡಿ, ಪರಮಾತ್ಮನಾದ ವಿಜಯವಿಠ್ಠಲನ ಪಾದಕಮಲಗಳಲ್ಲಿ ಆಶ್ರಯ ನೀಡಲೆಂದು ಪ್ರಾರ್ಥಿಸಲಾಗಿದೆ.",
    comprehensiveSummaryEnglish: "Sri Durga, manifesting the divine energy of Sri Hari, is praised as the protector in perilous journeys who steers the soul toward Vijaya Vittala's sanctuary.",
    stanzas: [
      {
        stanzaType: "ಆರಂಭ ಪಾದ",
        originalKannada: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ ಮಹದುಷ್ಟಜನ ಸಂಹಾರೆ\nದುರ್ಗಾಂತರ್ಗತ ದುರ್ಗೆ ದುರ್ಲಭೆ ಸುಲಭೆ",
        anvayaKannada: "ದುಷ್ಟರನ್ನು ಸಂಹರಿಸುವ ದುರ್ಗಾದೇವಿಯೇ, ನೀನು ಜ್ಞಾನಿಗಳಿಗೆ ಸುಲಭವಾಗಿಯೂ ಅಜ್ಞಾನಿಗಳಿಗೆ ದುರ್ಲಭವಾಗಿಯೂ ಇರುವೆ.",
        anvayaEnglish: "O Goddess Durga, slayer of evil, You are accessible to the sincere yet elusive to the arrogant."
      },
      {
        stanzaType: "ಅಂತ್ಯ ಪಾದ",
        originalKannada: "ಸ್ವರ್ಗಂಗಾಜನಕ ನಮ್ಮ ವಿಜಯ ವಿಠ್ಠಲನಂಘ್ರಿ\nದುರ್ಗಾಶ್ರಮ ಮಾಡಿ ಬದುಕುವಂತೆ ಮಾಡು ||",
        anvayaKannada: "ಆಕಾಶಗಂಗೆಯ ಪಿತನಾದ ನಮ್ಮ ವಿಜಯವಿಠ್ಠಲನ ಚರಣಕಮಲಗಳನ್ನೇ ಅಭೇದ್ಯ ಕೋಟೆಯನ್ನಾಗಿಸಿ (ದುರ್ಗ) ನಾವು ಬದುಕುವಂತೆ ಕರುಣಿಸು.",
        anvayaEnglish: "Make the holy lotus feet of our Vijaya Vittala—father of celestial Ganga—our fortress, that we may abide in peace."
      }
    ],
    modernTakeawayKannada: "ಕಠಿಣ ಸಂಕಷ್ಟದ ಸಮಯದಲ್ಲೂ ಸ್ಥೈರ್ಯ ಮತ್ತು ನಂಬಿಕೆಯನ್ನು ಕಳೆದುಕೊಳ್ಳಬಾರದು.",
    modernTakeawayEnglish: "Unyielding faith provides shelter when external circumstances feel chaotic or overwhelming.",
    pratipadaartha: [
      { wordKannada: "ದುರ್ಗತಿಹಾರೆ", wordTransliterated: "Durgatihaare", meaningKannada: "ಕೆಟ್ಟ ಸ್ಥಿತಿಯನ್ನು ಹೋಗಲಾಡಿಸುವವಳೇ", meaningEnglish: "Remover of misfortune" }
    ],
    metaphorsAndMundige: []
  },

  "ಆಯುವೃದ್ಧಿಯಾಗೋದು": {
    isRecognizedSong: true,
    titleKannada: "ಶ್ರೀ ಧನ್ವಂತ್ರಿ ಸೂಳಾದಿ",
    titleEnglish: "Sri Dhanvantari Suladi",
    composerKannada: "ವಿಜಯ ದಾಸರು",
    composerEnglish: "Vijaya Dasaru",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    youtubeSearchQuery: "Dhanvantari Suladi Vijaya Dasa",
    historicalContextKannada: "ಆರೋಗ್ಯ, ಆಯುಷ್ಯ ಮತ್ತು ದೈಹಿಕ-ಮಾನಸಿಕ ರೋಗಗಳ ಉಪಶಮನಕ್ಕಾಗಿ ಶ್ರೀ ವಿಜಯದಾಸರು ಧನ್ವಂತ್ರಿ ದೇವರನ್ನು ಸ್ತುತಿಸಿದ ಜನಪ್ರಿಯ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Vijaya Dasa’s devotional hymn invoking Lord Dhanvantari as the celestial healer to bestow vitality, clarity of mind, and freedom from chronic suffering.",
    comprehensiveSummaryKannada: "ಧನ್ವಂತ್ರಿ ದೇವರ ಸ್ಮರಣೆಯಿಂದ ಆಯುಷ್ಯವು ಹೆಚ್ಚುವುದಲ್ಲದೆ, ದುಷ್ಕರ್ಮದ ಪ್ರಭಾವದಿಂದ ಬರುವ ರೋಗಗಳು ದೂರವಾಗಿ ಕಾಯವು ಪವಿತ್ರವಾಗುತ್ತದೆ ಎಂಬುದು ಈ ಕೃತಿಯ ಮುಖ್ಯ ಸಂದೇಶ.",
    comprehensiveSummaryEnglish: "Meditating upon Lord Dhanvantari cleanses the physical body, promotes longevity, and removes the root causes of spiritual and somatic ailments.",
    stanzas: [
      {
        stanzaType: "ಆರಂಭ ಪಾದ",
        originalKannada: "ಆಯುವೃದ್ಧಿಯಾಗೋದು ಶ್ರೇಯಸ್ಸು ಬರುವುದು\nಕಾಯಾ ನಿರ್ಮಲಿನಾ ಕಾರಣವಾಹದೊ",
        anvayaKannada: "ಧನ್ವಂತ್ರಿಯ ಕೃಪೆಯಿಂದ ಆಯುಷ್ಯ ಹೆಚ್ಚುವುದು, ಶ್ರೇಯಸ್ಸು ದೊರೆಯುವುದು ಹಾಗೂ ಈ ಶರೀರವು ನಿರ್ಮಲವಾಗುವುದು.",
        anvayaEnglish: "Longevity flourishes, auspicious grace descends, and the physical vessel attains pure vitality."
      },
      {
        stanzaType: "ಅಂತ್ಯ ಪಾದ",
        originalKannada: "ವಾಯುವಂದಿತ ನಿತ್ಯ ವಿಜಯ ವಿಟ್ಠಲರೇಯಾ\nಪ್ರಿಯನು ಕಾಣೋ ನಮಗೆ ಅನಾದಿ ರೋಗ ಕಳೆವಾ ||",
        anvayaKannada: "ಮುಖ್ಯಪ್ರಾಣದೇವರಿಂದ ವಂದಿತನಾದ ವಿಜಯವಿಠ್ಠಲನು ನಮ್ಮೆಲ್ಲರ ಅನಾದಿ ಕಾಲದ ಭವರೋಗವನ್ನು ಕಳೆಯುವ ಪ್ರಿಯ ಸ್ವಾಮಿಯಾಗಿದ್ದಾನೆ.",
        anvayaEnglish: "Adored eternally by Vayu, Lord Vijaya Vittala is our cherished guardian who dissolves the ancient malady of worldly suffering."
      }
    ],
    modernTakeawayKannada: "ಆರೋಗ್ಯ ಮತ್ತು ದೀರ್ಘಾಯುಷ್ಯವನ್ನು ಸಾರ್ಥಕ ಸತ್ಕಾರ್ಯಗಳಿಗಾಗಿ ಬಳಸಬೇಕು.",
    modernTakeawayEnglish: "Health and vitality are sacred gifts meant to be utilized for constructive living and inner growth.",
    pratipadaartha: [
      { wordKannada: "ಕಾಯಾ", wordTransliterated: "Kaaya", meaningKannada: "ದೇಹ", meaningEnglish: "Body / Physical frame" },
      { wordKannada: "ಅನಾದಿ ರೋಗ", wordTransliterated: "Anaadi Roga", meaningKannada: "ಸಂಸಾರದ ಭವರೋಗ / ಆಂತರಿಕ ಕೊರತೆ", meaningEnglish: "Primordial malady of existential ignorance" }
    ],
    metaphorsAndMundige: []
  },

  "ತಾರಕ್ಕ ಬಿಂದಿಗೆ": {
    isRecognizedSong: true,
    titleKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ (ಮುಂಡಿಗೆ)",
    titleEnglish: "Tarakka Bindige Neerige Hogona (Mundige)",
    composerKannada: "ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Purandara Dasaru",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    youtubeSearchQuery: "Tarakka Bindige Purandara Dasa",
    historicalContextKannada: "ಈ ಕೃತಿಯು ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ತಾತ್ವಿಕ ಮುಂಡಿಗೆಯಾಗಿದ್ದು, ಲೌಕಿಕ ನೀರಿನ ಬಿಂದಿಗೆಯನ್ನು ಸಾಧನೆಯ ದೇಹ ಮತ್ತು ಭಕ್ತಿ ಪಾತ್ರೆಗೆ ಹೋಲಿಸುವ ಸುಂದರ ರೂಪಕವಾಗಿದೆ.",
    historicalContextEnglish: "A celebrated allegorical composition (Mundige) by Purandara Dasa where drawing water from a river serves as an extended metaphor for self-discipline, breath control, and spiritual realization.",
    comprehensiveSummaryKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ಹಾಡಿನಲ್ಲಿ ದಾಸರು ಹೆಣ್ಣುಮಕ್ಕಳು ನೀರು ತರಲು ಹೋಗುವ ದೈನಂದಿನ ಲೌಕಿಕ ಕೆಲಸವನ್ನು ಅಧ್ಯಾತ್ಮ ಸಾಧನೆಗೆ ರೂಪಕವಾಗಿ ಬಳಸಿದ್ದಾರೆ. ಭಕ್ತಿಯೆಂಬ ನೀರಿನಲ್ಲಿ ಮುಳುಗಿ, ಜ್ಞಾನವೆಂಬ ಅಮೃತವನ್ನು ತುಂಬಿಕೊಳ್ಳಬೇಕೆಂಬುದು ಇದರ ಒಳಾರ್ಥ.",
    comprehensiveSummaryEnglish: "Purandara Dasa uses the routine daily chore of village women fetching water with pots as a profound metaphor for spiritual sadhana. The pot represents the mortal body, the river represents the stream of devotion, and the water drawn is divine nectar.",
    stanzas: [
      {
        stanzaType: "ಪಲ್ಲವಿ / Pallavi",
        originalKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ",
        anvayaKannada: "ಚೆಲುವೆಯೇ, ಬಿಂದಿಗೆಯನ್ನು ತಾರಕ್ಕ, ನಾವಿಬ್ಬರೂ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ.",
        anvayaEnglish: "O graceful one, bring the water pot, let us walk together to fetch the waters."
      },
      {
        stanzaType: "ಚರಣ / Charana",
        originalKannada: "ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು | ತಂದ ಪುರಂದರವಿಠ್ಠಲಗೊಪ್ಪಿಸು ||",
        anvayaKannada: "ಈ ದೇಹವೆಂಬ ಬಿಂದಿಗೆಗೆ ಒಂಬತ್ತು ದ್ವಾರಗಳಿವೆ; ಜೀವಿತಾವಧಿ ಮುಗಿಯುವ ಮುನ್ನ ಇದನ್ನು ಪುರಂದರವಿಠ್ಠಲನ ಪಾದಕ್ಕೆ ಸಮರ್ಪಿಸು.",
        anvayaEnglish: "This physical pot (body) possesses nine apertures; dedicate its essence to the feet of Purandara Vittala before it shatters."
      }
    ],
    modernTakeawayKannada: "ದೈನಂದಿನ ಸರಳ ಕರ್ತವ್ಯಗಳಲ್ಲೂ ಆಳವಾದ ಅಧ್ಯಾತ್ಮಿಕ ಶಿಸ್ತನ್ನು ರೂಢಿಸಿಕೊಳ್ಳಬಹುದು ಎಂಬುದನ್ನು ಈ ಕೃತಿ ಕಲಿಸುತ್ತದೆ.",
    modernTakeawayEnglish: "Even routine everyday chores can become transformative practices of mindfulness and higher purpose.",
    pratipadaartha: [
      { wordKannada: "ಬಿಂದಿಗೆ", wordTransliterated: "Bindige", meaningKannada: "ನೀರಿನ ಪಾತ್ರೆ / ದೇಹ", meaningEnglish: "Water pitcher; metaphor for physical body" },
      { wordKannada: "ಒಂಬತ್ತು ತೂತು", wordTransliterated: "Ombattu Tootu", meaningKannada: "ದೇಹದ ನವದ್ವಾರಗಳು", meaningEnglish: "Nine bodily apertures / senses" }
    ],
    metaphorsAndMundige: [
      { motifKannada: "ಬಿಂದಿಗೆ", motifEnglish: "The Water Pot", innerMeaningKannada: "ನಶ್ವರವಾದ ಮಾನವ ಶರೀರ ಮತ್ತು ಸಂಸ್ಕಾರದ ಪಾತ್ರೆ.", innerMeaningEnglish: "The mortal physical vehicle carrying inner consciousness." }
    ]
  },

  "ಮಾನವ ಜನ್ಮ": {
    isRecognizedSong: true,
    titleKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು (ದೇವರನಾಮ)",
    titleEnglish: "Manava Janma Doddadu",
    composerKannada: "ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Purandara Dasaru",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    youtubeSearchQuery: "Manava Janma Doddadu Purandara Dasa",
    historicalContextKannada: "ಈ ಕೃತಿಯು ನಿರ್ದಿಷ್ಟ ಐತಿಹಾಸಿಕ ಘಟನೆಗಿಂತ ಹೆಚ್ಚಾಗಿ ತತ್ತ್ವಚಿಂತನೆ, ವೈರಾಗ್ಯ ಹಾಗೂ ಜೀವನದ ಮೌಲ್ಯವನ್ನು ಸಾರುವ ಪುರಂದರದಾಸರ ಮಾರ್ಗದರ್ಶಿ ಪದ್ಯವಾಗಿದೆ.",
    historicalContextEnglish: "A timeless contemplative composition on existential purpose and moral wakefulness, emphasizing the immense rarity and sanctity of human existence.",
    comprehensiveSummaryKannada: "ಕೋಟಿ ಜನ್ಮಗಳ ಪುಣ್ಯದ ಫಲವಾಗಿ ದೊರೆತ ಈ ಮಾನವ ಜನ್ಮವು ಅತ್ಯಂತ ಶ್ರೇಷ್ಠವಾದುದು. ಇದನ್ನು ವ್ಯರ್ಥ ವ್ಯಸನಗಳಲ್ಲಿ, ಲೌಕಿಕ ಕ್ಷುಲ್ಲಕತೆಗಳಲ್ಲಿ ಹಾಳು ಮಾಡಿಕೊಳ್ಳದೆ ಸತ್ಕರ್ಮ ಮತ್ತು ದೈವಸ್ಮರಣೆಯಲ್ಲಿ ಕಳೆಯಬೇಕು ಎಂಬುದು ದಾಸರ ಸಂದೇಶ.",
    comprehensiveSummaryEnglish: "Purandara Dasa asserts that human birth is the rarest cosmic opportunity attained after countless evolutionary cycles. It should not be squandered on transient material trivialities.",
    stanzas: [
      {
        stanzaType: "ಪಲ್ಲವಿ / Pallavi",
        originalKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ",
        anvayaKannada: "ಎಲೈ ಭ್ರಾಂತರೇ, ಮಾನವ ಜನ್ಮವು ಬಹಳ ಶ್ರೇಷ್ಠವಾದುದು; ಇದನ್ನು ವ್ಯರ್ಥವಾಗಿ ಹಾಳು ಮಾಡಿಕೊಳ್ಳಬೇಡಿ.",
        anvayaEnglish: "O misguided minds, this human birth is exceedingly precious; do not squander it away in carelessness."
      },
      {
        stanzaType: "ಚರಣ / Charana",
        originalKannada: "ವಿಷಯದಾಸೆಗೆ ಬಿದ್ದು ಮರುಳಾಗಬೇಡಿ | ಪುರಂದರವಿಠ್ಠಲನ ಚರಣವ ನೆನೆಯಿರೋ ||",
        anvayaKannada: "ಕ್ಷಣಿಕ ಇಂದ್ರಿಯ ಸುಖಗಳ ಆಸೆಗೆ ಬಿದ್ದು ಮರುಳಾಗಬೇಡಿ; ಪುರಂದರವಿಠ್ಠಲನ ಪಾದಕಮಲಗಳನ್ನು ಸದಾ ಧ್ಯಾನಿಸಿರಿ.",
        anvayaEnglish: "Do not lose your clarity chasing ephemeral pleasures; anchor your consciousness upon the lotus feet of Purandara Vittala."
      }
    ],
    modernTakeawayKannada: "ನಮ್ಮ ಸಮಯ ಮತ್ತು ಪ್ರಜ್ಞೆಯನ್ನು ನಿರರ್ಥಕ ವಿಷಯಗಳಲ್ಲಿ ಕಳೆಯದೆ, ಸಾರ್ಥಕ ಬದುಕಿಗಾಗಿ ಬಳಸಬೇಕು.",
    modernTakeawayEnglish: "Value your finite conscious lifetime; avoid trading eternal well-being for fleeting trivial distractions.",
    pratipadaartha: [
      { wordKannada: "ಹಾನಿ", wordTransliterated: "Hani", meaningKannada: "ನಾಶ / ವ್ಯರ್ಥ", meaningEnglish: "Waste / Loss" }
    ],
    metaphorsAndMundige: []
  },

  "ಕಲ್ಲು ಸಕ್ಕರೆ": {
    isRecognizedSong: true,
    titleKannada: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ನೀವೆಲ್ಲರು (ದೇವರನಾಮ)",
    titleEnglish: "Kallu Sakkare Kolliro",
    composerKannada: "ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Purandara Dasaru",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    youtubeSearchQuery: "Kallu Sakkare Kolliro Purandara Dasa",
    historicalContextKannada: "ವಿಜಯನಗರದ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ವಜ್ರ, ರತ್ನ, ಸಕ್ಕರೆ ವ್ಯಾಪಾರವನ್ನು ನೋಡಿದ ಪುರಂದರದಾಸರು ಲೌಕಿಕ ವ್ಯಾಪಾರವನ್ನು ಹರಿನಾಮದ ಸವಿಗೆ ಹೋಲಿಸಿ ರಚಿಸಿದ ಸುಂದರ ಗೀತೆ.",
    historicalContextEnglish: "Having witnessed the vibrant jewel and sugar bazaars of Vijayanagara, Purandara Dasa allegorizes commercial trade into the spiritual commerce of divine remembrance.",
    comprehensiveSummaryKannada: "ಹರಿನಾಮವೆಂಬ ಕಲ್ಲು ಸಕ್ಕರೆಯು ಕರಗುವುದಿಲ್ಲ, ಹುಳ ಹಿಡಿಯುವುದಿಲ್ಲ, ಕಳ್ಳರು ಕದಿಯಲಾಗುವುದಿಲ್ಲ. ಇದು ನಾಲಿಗೆಗೆ ಅಮೃತದಂತಹ ಶಾಶ್ವತ ಸವಿಯನ್ನು ನೀಡುತ್ತದೆ ಎಂದು ಪುರಂದರದಾಸರು ವರ್ಣಿಸಿದ್ದಾರೆ.",
    comprehensiveSummaryEnglish: "Purandara Dasa invites all to taste the crystallized sugar of the divine name—an asset that neither decays, dissolves, nor can be stolen by thieves.",
    stanzas: [
      {
        stanzaType: "ಪಲ್ಲವಿ / Pallavi",
        originalKannada: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ನೀವೆಲ್ಲರು | ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ||",
        anvayaKannada: "ಜನರೇ, ನೀವೆಲ್ಲರೂ ಹರಿನಾಮವೆಂಬ ಈ ದಿವ್ಯ ಕಲ್ಲು ಸಕ್ಕರೆಯನ್ನು ಕೊಳ್ಳಿರಿ.",
        anvayaEnglish: "O people, partake of this divine rock candy of sacred remembrance!"
      },
      {
        stanzaType: "ಚರಣ / Charana",
        originalKannada: "ಪುರಂದರವಿಠ್ಠಲನ ನಾಮವೆಂಬ ಸಕ್ಕರೆ | ಸವಿದು ನೋಡಿರೋ ನೀವೆಲ್ಲರು ||",
        anvayaKannada: "ಪುರಂದರವಿಠ್ಠಲನ ನಾಮವೆಂಬ ಈ ಸಕ್ಕರೆಯ ಸವಿಯನ್ನು ನೀವೆಲ್ಲರೂ ಅನುಭವಿಸಿ ನೋಡಿರಿ.",
        anvayaEnglish: "Taste for yourselves the supreme sweetness of Purandara Vittala's holy name."
      }
    ],
    modernTakeawayKannada: "ನಿಜವಾದ ನೆಮ್ಮದಿ ಮತ್ತು ಆನಂದವು ಹೊರಗಿನ ಪದಾರ್ಥಗಳಲ್ಲಲ್ಲ, ಶುದ್ಧ ಆಂತರಿಕ ಭಾವದಲ್ಲಿದೆ.",
    modernTakeawayEnglish: "True and lasting sweetness resides not in external commodities, but in cultivated inner consciousness.",
    pratipadaartha: [
      { wordKannada: "ಕಲ್ಲು ಸಕ್ಕರೆ", wordTransliterated: "Kallu Sakkare", meaningKannada: "ಹರಳು ಸಕ್ಕರೆ / ಹರಿನಾಮದ ಸಿಹಿ", meaningEnglish: "Crystallized rock candy (metaphor for divine name)" }
    ],
    metaphorsAndMundige: [
      {
        motifKannada: "ಕಲ್ಲು ಸಕ್ಕರೆ",
        motifEnglish: "Crystallized Sugar",
        innerMeaningKannada: "ಕ್ಷಯವಾಗದ ಶಾಶ್ವತ ಆನಂದ ಮತ್ತು ದೈವನಾಮದ ಮಾಧುರ್ಯ.",
        innerMeaningEnglish: "The eternal, incorruptible sweetness of meditative awareness."
      }
    ]
  }
};

const ANKITHA_AUTHORITY_REGISTRY = COMPLETE_ANKITHA_CATALOG.map(
  (entry) =>
    `• [${entry.era || "Historical"}] Signature: "${entry.ankitaKannada}" (${entry.ankitaEnglish}) => Composer: ${entry.composerKannada} (${entry.composerEnglish})`
).join("\n");

async function callGeminiWithBackoff(apiKey: string, model: string, payload: any): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) return res;

      if ((res.status === 503 || res.status === 429) && attempt < 2) {
        const delay = 1200 * Math.pow(2, attempt) + Math.random() * 400;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return res;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error(`Timeout on model ${model}`);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query cannot be empty" }, { status: 400 });
    }

    const normalized = query.toLowerCase().trim();
    for (const [key, cachedData] of Object.entries(PRECACHED_SONGS)) {
      if (normalized.includes(key.toLowerCase())) {
        return NextResponse.json(cachedData);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not configured" }, { status: 500 });
    }

    const systemPrompt = `
You are Dāsa Bodhini (ದಾಸ ಬೋಧಿನಿ), a scholar of Haridasa Sahitya (spanning 1263–1983 CE).
GROUND TRUTH REGISTRY:
${ANKITHA_AUTHORITY_REGISTRY}

RULES:
1. If input is gibberish or off-topic, set "isRecognizedSong": false with a kind explanation.
2. Resolve composer strictly by matching the Ankita Mudra in the last Charana with the registry.
3. Historical context: Only give verified Haridasa episodes. If none exists, describe it strictly as a philosophical contemplation.
4. Output valid JSON adhering to the schema:
{
  "isRecognizedSong": true,
  "unrecognizedMessageKannada": null,
  "unrecognizedMessageEnglish": null,
  "titleKannada": "...",
  "titleEnglish": "...",
  "composerKannada": "...",
  "composerEnglish": "...",
  "ankitaKannada": "...",
  "ankitaEnglish": "...",
  "youtubeSearchQuery": "...",
  "historicalContextKannada": "...",
  "historicalContextEnglish": "...",
  "comprehensiveSummaryKannada": "...",
  "comprehensiveSummaryEnglish": "...",
  "stanzas": [{"stanzaType": "...", "originalKannada": "...", "anvayaKannada": "...", "anvayaEnglish": "..."}],
  "modernTakeawayKannada": "...",
  "modernTakeawayEnglish": "...",
  "pratipadaartha": [{"wordKannada": "...", "wordTransliterated": "...", "meaningKannada": "...", "meaningEnglish": "..."}],
  "metaphorsAndMundige": [{"motifKannada": "...", "motifEnglish": "...", "innerMeaningKannada": "...", "innerMeaningEnglish": "..."}]
}
`;

    const bodyPayload = {
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nAnalyze:\n${query}` }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    };

    let response: Response | null = null;

    for (const model of ACTIVE_MODELS) {
      try {
        response = await callGeminiWithBackoff(apiKey, model, bodyPayload);
        if (response.ok) break;
      } catch (err) {
        console.warn(`Model ${model} unavailable, trying fallback...`);
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        { error: "The decoding engine is temporarily experiencing high traffic at Google. Please tap 'Decode Song' once more." },
        { status: 503 }
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return NextResponse.json({ error: "Empty model output" }, { status: 500 });

    const parsedData = JSON.parse(rawText);
    if (parsedData.isRecognizedSong === false) {
      return NextResponse.json(
        { error: parsedData.unrecognizedMessageKannada || "ಹಾಡು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ (Song not identified)." },
        { status: 422 }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Processing error" }, { status: 500 });
  }
}