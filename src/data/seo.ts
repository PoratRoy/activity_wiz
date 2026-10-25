// Search titles and descriptions, carried over from the old app (activitywiz.com) where it had them.
// Titles get the " | ActivityWiz" suffix from the root layout template.

/** The link-preview image (1200×630), for Open Graph and X. */
export const SHARE_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "ActivityWiz – פעולות לתנועות נוער בעזרת AI" };

/** Site-wide Open Graph fields. Next.js replaces a parent's `openGraph` whole, so pages that set their own spread this in. */
export const OPEN_GRAPH = { locale: "he_IL", siteName: "ActivityWiz", type: "website" as const, images: [SHARE_IMAGE] };

/** The movements guides search for alongside "פעולה"; ends most descriptions. */
export const MOVEMENTS = "צופים, נוער עובד, בני עקיבא, השומר הצעיר, מדצים ועוד";

export const SITE_DESCRIPTION = `יצירת פעולות חדשות ומותאמות אישית תוך שניות בעזרת AI, לצד מאגר פעולות מוכנות לכל תנועות הנוער. מתאים ל${MOVEMENTS} – חברתיות, ערכיות וחינוכיות.`;

export const LIBRARY_DESCRIPTION = `מאגר פעולות מוכנות ורעיונות למדריכי כל תנועות הנוער – ${MOVEMENTS}. כולל פעולות ומשחקים בנושא חברות, מנהיגות, אחריות, ערכים ומשחקים מגבשים.`;

type Seo = { title: string; description: string };

/** By category `key` (lowercased). A category without an entry gets `categorySeo`'s fallback. */
const CATEGORY_SEO: Record<string, Seo> = {
  friendship: {
    title: "פעולות בנושא חברות – משחקים, דיונים והפעלות לתנועות נוער",
    description: `מאגר פעולות בנושא חברות לתנועות נוער – כולל משחקים מגבשים, פעילויות ערכיות, דיונים קבוצתיים ורעיונות מוכנים ל${MOVEMENTS}.`,
  },
  games: {
    title: "משחקים ופעולות גיבוש לתנועות נוער",
    description: `מאגר משחקים מצחיקים ופעולות גיבוש מוכנות לתנועות נוער – ${MOVEMENTS}. כולל רעיונות לפעולת צחוק, משחקים לפעולות בצופים ופעילויות משעשעות לכל הגילאים.`,
  },
  holidays: {
    title: "פעולות ופעילויות לחגים ומועדים בתנועות נוער",
    description: `מאגר פעולות, משחקים ופעילויות לחגים ומועדים בתנועות נוער – ראש השנה, יום כיפור, סוכות, חנוכה, פסח ועוד. כולל רעיונות מגבשים, תכנים ערכיים ופעילויות חווייתיות ל${MOVEMENTS}.`,
  },
  newyear: {
    title: "פעולות היכרות ותחילת שנה לתנועות נוער",
    description: `מאגר פעולות היכרות, משחקים לשבירת הקרח ופעילויות לתחילת שנה בתנועות נוער – ${MOVEMENTS}. כולל רעיונות מגבשים, דיונים ופעילויות משעשעות לפתיחת השנה.`,
  },
  animals: {
    title: "פעולות בנושא בעלי חיים לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא בעלי חיים – עולם החיות, בתי גידול, שמירה על בעלי חיים וחיות מחמד. מתאים ל${MOVEMENTS}.`,
  },
  environment: {
    title: "פעולות בנושא איכות הסביבה לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא איכות הסביבה – מיחזור, אפס פסולת ושמירה על כדור הארץ. פעילויות ערכיות וחווייתיות ל${MOVEMENTS}.`,
  },
  israel: {
    title: "פעולות על ישראל ותולדותיה לתנועות נוער",
    description: `פעולות מוכנות על ישראל – עלייה, צה״ל, מבצע אנטבה, כ״ט בנובמבר ועוד. פעילויות ערכיות וחינוכיות ל${MOVEMENTS}.`,
  },
  leaders: {
    title: "פעולות על אישים ומנהיגים לתנועות נוער",
    description: `פעולות מוכנות על מנהיגים ואישים בתולדות ישראל – בן גוריון, בגין, ז׳בוטינסקי, יצחק רבין ועוד. פעילויות על מנהיגות וערכים ל${MOVEMENTS}.`,
  },
  movies: {
    title: "פעולות בנושא סרטים לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא סרטים וקולנוע – הפקות קטנות, משחקי דמויות ופעילויות יצירתיות ל${MOVEMENTS}.`,
  },
  responsibility: {
    title: "פעולות בנושא אחריות לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא אחריות, כבוד והצלחה – פעילויות ערכיות, דיונים ומשחקים מגבשים ל${MOVEMENTS}.`,
  },
  roadsafety: {
    title: "פעולות בנושא זהירות בדרכים לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא זהירות בדרכים – רמזורים, חגורות בטיחות, תחבורה ציבורית ודרך בטוחה. מתאים ל${MOVEMENTS}.`,
  },
  seasons: {
    title: "פעולות בנושא עונות השנה לתנועות נוער",
    description: `פעולות ומשחקים מוכנים לכל עונה – סתיו, חורף, אביב וקיץ. פעילויות חווייתיות ומגבשות ל${MOVEMENTS}.`,
  },
  sexualharassment: {
    title: "פעולות על מניעת הטרדה מינית לתנועות נוער",
    description: `פעולות מוכנות בנושא מניעת הטרדה מינית, גבולות וכבוד הדדי – דיונים ופעילויות ערכיות למדריכי ${MOVEMENTS}.`,
  },
  superheroes: {
    title: "פעולות בנושא גיבורי על לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא גיבורי על – אקדמיית גיבורים, מסע גיבורים ופעילויות על כוחות פנימיים ל${MOVEMENTS}.`,
  },
  teamwork: {
    title: "פעולות גיבוש ועבודת צוות לתנועות נוער",
    description: `פעולות ומשחקים מוכנים בנושא עבודת צוות וגיבוש – אתגרים קבוצתיים, משחקי הישרדות ופעילויות שמחברות את הקבוצה. מתאים ל${MOVEMENTS}.`,
  },
};

/** Search title and description for a library category page. */
export function categorySeo(category: { title: string; key: string | null }): Seo {
  return (
    (category.key && CATEGORY_SEO[category.key.toLowerCase()]) || {
      title: `פעולות בנושא ${category.title} לתנועות נוער`,
      description: `פעולות ומשחקים מוכנים בנושא ${category.title} למדריכי תנועות הנוער – ${MOVEMENTS}.`,
    }
  );
}
