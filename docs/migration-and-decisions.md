# מעבר, תפעול והחלטות פתוחות

[חזרה לאינדקס](../README.md)

## מסגרת טכנולוגית שאושרה

הכיוון החדש הוא Next.js ו־Cloudflare, במקום יישום React הישן ותשתית Firebase שלו. Next.js עצמו מבוסס על React; אין כאן בחירה להימנע מ־React. נבנה פרויקט חדש מאפס, תוך שימוש במקור הישן לעיון ולשימור ידע ומידע בלבד.

The four core product tables are now accepted: users, personal activities, public categories and public activities. The [English data model](data-model.md) defines their conceptual relationships and proposes detailed field representations. Next.js with TypeScript on Cloudflare Workers, D1 and R2 is a proposed stack, not full architecture approval. Physical schema, adapter, auth library and auxiliary auth/session storage remain open. This remains documentation only.

## שימור מידע וזהויות

יש לשמר את כלל המידע הישן: משתמשים, פרופילי קבוצות, קטגוריות ופעילויות ציבוריות, וכל הפעילויות האישיות השמורות והערוכות של כל משתמש. כניסה עם אותה זהות Google חייבת להחזיר למשתמש את ההיסטוריה הנכונה, בלי ליצור חשבונות כפולים ובלי לערבב בעלות.

הוצאת מוצרים ושפות מהממשק אינה הרשאה למחיקת נתונים. יש למפות גם את המידע שאינו מוצג במוצר החדש ולתכנן את שימורו. אין לפרסם ייצוא, תוכן אישי או פרטי הזדהות במאגר הציבורי.

תכנון המעבר העתידי כולל מיפוי בקריאה בלבד של המבנה הישן ושל הייצואים שבעל המוצר יספק, בניית ייבוא לתוך המערכת החדשה, ואימות ספירות, תוכן ובעלות. יש להביא בחשבון עדכונים שיצטברו במערכת הישנה בזמן הפיתוח, כדי שלא לאבד פעילות בין הייצוא הראשוני למעבר בפועל. דרך הסנכרון/ההשלמה תיקבע בהמשך.

## אחריות ומעבר לייצור

בעל המוצר מבצע את הייצואים, השינויים במערכת הישנה, מעבר הדומיין וההשבתה. הסוכן עובד בכלים ובמסמכים של הפרויקט החדש בלבד; כל עיון בפרויקט הישן הוא לקריאה בלבד.

המערכת החדשה תחליף במלואה את הישנה באותה כתובת ציבורית. הישנה נשארת פעילה עד שהחדשה אומתה. לפני המעבר יש לתכנן גיבוי וחזרה לאחור, טיפול בכתובות תוכן קיימות והפניות, ואימות שהמשתמשים מגיעים לתוכן הנכון. התיעוד הנוכחי אינו מבצע שום ייבוא, שינוי DNS, מעבר דומיין או כיבוי שירות.

## פרסומות, מדידה ותוכן קבוע

נשמר ספק הפרסומות הקיים, עם המיקומים, הגדלים והפורמטים הקיימים בדיוק. הממשק החדש צריך להכיל אותם. הפרטים המדויקים יאומתו בקריאה בלבד בהמשך; אין להמציא מזהי פרסום או להעתיק סודות לתיעוד.

אינטגרציית Clarity הקיימת נשמרת ותופעל עם מעבר כתובת הייצור. לא אושרה כעת מערכת אנליטיקה חדשה. תוכן עמודי המידע, הפרטיות ושאר העמודים הטכניים והבירוקרטיים מועתק ללא שינוי, ובעל המוצר יעדכן אותו לאחר מכן.

## החלטות להמשך

| נושא | מה עדיין פתוח |
| --- | --- |
| Architecture and storage | TypeScript/Workers/D1/R2 are proposed. Four core product tables are accepted; physical schema, adapter, auth library and auxiliary auth storage remain open. See [data model](data-model.md). |
| זהות ומעבר | מיפוי זהויות Google למשתמשים קיימים, ייבוא והשלמת שינויים, אימות וחזרה לאחור |
| AI | גרסת Gemini, בחינת איכות עברית ועלות, נוסחי תבניות ומימוש מתאם הספק |
| עיצוב | פריסה מפורטת, גופן, tokens, אייקונים ואיורים; הכיוון הכללי בלבד מאושר |
| תוכן ציבורי | משמעות מחיקה קשיחה/רכה וסדר קטגוריות; אין להסיק מדיניות מהספרייה האישית |
| שימור המקור | מיפוי מלא של קטגוריות, פופולריות, עמודי מידע, פרסומות וכתובות תוכן קיימות |
| פרטי מימוש | ייצוג מסמך העריכה, תזמון מדויק של שמירה ושחזור session; בכפוף להתנהגות המאושרת |
| הרשאת מנהל | בעל המוצר יזין בעצמו כתובת מורשית; אין כתובת אישית במסמכים |

הדיון הבא הוא העמקה בארכיטקטורה ובעיצוב. עצם רישום נושא פתוח אינו אישור להרחבת היקף. אין לחדש דיון בשדות או בזרימות שכבר הוכרעו כדי להציע חלופות שלא התבקשו.

## Source-grounded migration detail

The [data model](data-model.md) now records pinned remote-source evidence, identity mapping, offset-free legacy date handling, field preservation and relationship anomalies. No production export has been supplied. Firebase UID must not be assumed to equal Google subject, and email alone must not merge accounts. Detailed mapping supplements the preservation and owner-responsibility requirements above.
