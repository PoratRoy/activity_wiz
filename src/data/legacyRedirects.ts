// Old activitywiz.com library URLs (/he/youth/content/...) and where they now redirect (docs/domain-migration.md).
// Generated from live D1 on 2026-11-06. Targets are full canonical paths so each redirect is one hop;
// if an activity is renamed later, the page itself redirects the outdated slug, so these keep working.

/** "{old category}/{old activity}" → new public activity path. */
export const LEGACY_ACTIVITIES: Record<string, string> = {
  "games/chaos": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%90%D7%A0%D7%93%D7%A8%D7%9C%D7%9E%D7%95%D7%A1%D7%99%D7%94-4wgegjyi91", // אנדרלמוסיה
  "games/rabbit": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%90%D7%A8%D7%A0%D7%91%D7%AA-%D7%A9%D7%97%D7%95%D7%A8%D7%94-19h67fuhn5", // ארנבת שחורה
  "games/balloon": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%91%D7%9C%D7%95%D7%9F-%D7%91%D7%90%D7%95%D7%95%D7%99%D7%A8-my4qpslyh3", // בלון באוויר
  "games/hockey": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%95%D7%A7%D7%99-wy7g2791zu", // הוקי
  "games/machine": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%9E%D7%9B%D7%95%D7%A0%D7%94-keblh515x2", // המכונה
  "games/circle": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%92%D7%95%D7%9C%D7%9D-%D7%91%D7%9E%D7%A2%D7%92%D7%9C-ifcniiq80n", // גולם במעגל
  "games/kettle": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%A7%D7%95%D7%9E%D7%A7%D7%95%D7%9D-%D7%A9%D7%9C%D7%99-ucqx27bqic", // הקומקום שלי
  "games/wind": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%A8%D7%95%D7%97-%D7%A0%D7%95%D7%A9%D7%91%D7%AA-bdy1d1la2t", // הרוח נושבת
  "games/killer": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%A8%D7%95%D7%A6%D7%97-5k8lepjnrv", // הרוצח
  "games/story": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%95%D7%90%D7%96-mwzhb1dled", // ואז
  "games/bingo": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%91%D7%99%D7%A0%D7%92%D7%95-%D7%90%D7%94%D7%91%D7%95%D7%AA-t68egdke56", // בינגו אהבות
  "games/character": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%93%D7%9E%D7%95%D7%99%D7%95%D7%AA-%D7%A2%D7%9C-%D7%94%D7%9E%D7%A6%D7%97-65ebiifhcx", // דמויות על המצח
  "games/flag": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%93%D7%92%D7%9C%D7%99%D7%99%D7%9D-1c2vmvyn2u", // דגליים
  "games/ball": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%AA%D7%9E%D7%A1%D7%A8%D7%95%D7%AA-%D7%91%D7%9B%D7%93%D7%95%D7%A8-ozazzxnvvt", // התמסרות בכדור
  "games/champion": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%9E%D7%9C%D7%9A-%D7%94%D7%AA%D7%A0%D7%95%D7%A2%D7%95%D7%AA-0sk1nvgdzr", // מלך התנועות
  "games/laugh": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%92%D7%95-b79mbbagux", // הגו
  "games/evolution": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%90%D7%A0%D7%99-%D7%90%D7%9E%D7%91%D7%94-5toniv8hs0", // אני אמבה
  "games/dialogue": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%93%D7%95-%D7%A9%D7%99%D7%97-%D7%91%D7%90-%D7%91-m5affw85es", // דו שיח בא׳-ב׳
  "games/funny": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%93%D7%95-%D7%A9%D7%99%D7%97-%D7%91%D7%90-%D7%91-m5affw85es", // דו שיח בא׳-ב׳
  "games/sing": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7/%D7%94%D7%A6%D7%92%D7%AA-%D7%A9%D7%99%D7%A8-9r42va797i", // הצגת שיר
  "holidays/roshHashanah": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%A8%D7%90%D7%A9-%D7%94%D7%A9%D7%A0%D7%94-8vplf4nqp4", // ראש השנה
  "holidays/hanukkah": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%97%D7%A0%D7%95%D7%9B%D7%94-%D7%A0%D7%A1-%D7%92%D7%93%D7%95%D7%9C-%D7%94%D7%99%D7%94-%D7%A4%D7%94-uqraj1qs18", // חנוכה – נס גדול היה פה
  "holidays/tuBshvat": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%98%D7%95-%D7%91%D7%A9%D7%91%D7%98-%D7%A9%D7%95%D7%AA%D7%9C%D7%99%D7%9D-%D7%9C%D7%A2%D7%AA%D7%99%D7%93-nir5s96f1f", // ט״ו בשבט – שותלים לעתיד
  "holidays/tuBshvatGame": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%98%D7%95-%D7%91%D7%A9%D7%91%D7%98-%D7%A9%D7%95%D7%AA%D7%9C%D7%99%D7%9D-%D7%9C%D7%A2%D7%AA%D7%99%D7%93-nir5s96f1f", // ט״ו בשבט – שותלים לעתיד
  "holidays/purim": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%A4%D7%95%D7%A8%D7%99%D7%9D-%D7%95%D7%A0%D7%94%D7%A4%D7%95%D7%9A-%D7%94%D7%95%D7%90-tvn4cq7o7g", // פורים – ונהפוך הוא
  "holidays/purimGames": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%A4%D7%95%D7%A8%D7%99%D7%9D-%D7%95%D7%A0%D7%94%D7%A4%D7%95%D7%9A-%D7%94%D7%95%D7%90-tvn4cq7o7g", // פורים – ונהפוך הוא
  "holidays/pesah": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%A4%D7%A1%D7%97-%D7%9E%D7%A2%D7%91%D7%93%D7%95%D7%AA-%D7%9C%D7%97%D7%99%D7%A8%D7%95%D7%AA-n9kfid4w32", // פסח – מעבדות לחירות
  "holidays/pesah4sons": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%A4%D7%A1%D7%97-%D7%9E%D7%A2%D7%91%D7%93%D7%95%D7%AA-%D7%9C%D7%97%D7%99%D7%A8%D7%95%D7%AA-n9kfid4w32", // פסח – מעבדות לחירות
  "holidays/yomshoa": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%99%D7%95%D7%9D-%D7%94%D7%A9%D7%95%D7%90%D7%94-%D7%9E%D7%94-%D7%90%D7%A0%D7%99-%D7%94%D7%99%D7%99%D7%AA%D7%99-%D7%A2%D7%95%D7%A9%D7%94-qoatss0ucf", // יום השואה – מה אני הייתי עושה?
  "holidays/yomzikaron": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%99%D7%95%D7%9D-%D7%94%D7%96%D7%99%D7%9B%D7%A8%D7%95%D7%9F-%D7%91%D7%96%D7%9B%D7%95%D7%AA%D7%9D-hqo84ywhk7", // יום הזיכרון – בזכותם
  "holidays/yomazmaut": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%99%D7%95%D7%9D-%D7%94%D7%A2%D7%A6%D7%9E%D7%90%D7%95%D7%AA-%D7%94%D7%94%D7%97%D7%9C%D7%98%D7%94-%D7%91%D7%99%D7%93%D7%99%D7%99%D7%9D-%D7%A9%D7%9C%D7%A0%D7%95-kr8x7lq33d", // יום העצמאות – ההחלטה בידיים שלנו
  "holidays/lagBaomer": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l/%D7%9C%D7%92-%D7%91%D7%A2%D7%95%D7%9E%D7%A8-%D7%9E%D7%93%D7%95%D7%A8%D7%94-%D7%A9%D7%9C-%D7%9E%D7%99%D7%9C%D7%99%D7%9D-%D7%98%D7%95%D7%91%D7%95%D7%AA-rw7vxxsu0o", // ל״ג בעומר – מדורה של מילים טובות
  "animals/animalWorld": "/library/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-ieiltuo9z1/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-%D7%A2%D7%95%D7%9C%D7%9D-%D7%94%D7%97%D7%99%D7%95%D7%AA-%D7%94%D7%9E%D7%95%D7%A4%D7%9C%D7%90-em77xdgsvb", // בעלי חיים - עולם החיות המופלא
  "animals/myPets": "/library/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-ieiltuo9z1/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-%D7%94%D7%97%D7%91%D7%A8%D7%99%D7%9D-%D7%94%D7%A4%D7%A8%D7%95%D7%95%D7%AA%D7%99%D7%99%D7%9D-%D7%A9%D7%9C%D7%A0%D7%95-bekiy38t5l", // בעלי חיים - החברים הפרוותיים שלנו
  "animals/animalHabitats": "/library/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-ieiltuo9z1/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-%D7%9E%D7%A9%D7%9C%D7%97%D7%AA-%D7%A1%D7%A4%D7%90%D7%A8%D7%99-9mciv7ibay", // בעלי חיים – משלחת ספארי
  "animals/animalProtection": "/library/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-ieiltuo9z1/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-%D7%94%D7%9B%D7%95%D7%97-%D7%9C%D7%94%D7%A1%D7%AA%D7%AA%D7%A8-ojfkf6j0ce", // בעלי חיים – הכוח להסתתר
  "superhero/superheroAcademy": "/library/%D7%92%D7%99%D7%91%D7%95%D7%A8%D7%99-%D7%A2%D7%9C-jlfd2i8d49/%D7%92%D7%99%D7%91%D7%95%D7%A8%D7%99-%D7%A2%D7%9C-%D7%91%D7%99%D7%AA-%D7%A1%D7%A4%D7%A8-%D7%9C%D7%92%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%9D-hy1gr7gdpk", // גיבורי על - בית ספר לגיבורים
  "harassment/harassment": "/library/%D7%94%D7%98%D7%A8%D7%93%D7%94-%D7%9E%D7%99%D7%A0%D7%99%D7%AA-zs7ljlunse/%D7%92%D7%91%D7%95%D7%9C%D7%95%D7%AA-%D7%91%D7%A8%D7%95%D7%A8%D7%99%D7%9D-k3zgx8897q", // גבולות ברורים
  "traffic/publicTransport": "/library/%D7%96%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%91%D7%93%D7%A8%D7%9B%D7%99%D7%9D-qfzg4surb7/%D7%99%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%AA%D7%97%D7%91%D7%95%D7%A8%D7%94-%D7%94%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%AA-9c82d8sv3l", // יתרונות התחבורה הציבורית
  "traffic/trafficLight": "/library/%D7%96%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%91%D7%93%D7%A8%D7%9B%D7%99%D7%9D-qfzg4surb7/%D7%96%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%91%D7%93%D7%A8%D7%9B%D7%99%D7%9D-%D7%A2%D7%95%D7%A6%D7%A8%D7%99%D7%9D-%D7%9E%D7%A1%D7%AA%D7%9B%D7%9C%D7%99%D7%9D-%D7%97%D7%95%D7%A6%D7%99%D7%9D-ff83ux6gyc", // זהירות בדרכים – עוצרים, מסתכלים, חוצים
  "friendship/friendsForever": "/library/%D7%97%D7%91%D7%A8%D7%95%D7%AA-yo3mi7os4g/%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA-%D7%91%D7%99%D7%9F-%D7%97%D7%91%D7%A8%D7%99%D7%9D-ql7jt4r198", // תקשורת בין חברים
  "israel/idf": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%A6%D7%94%D7%9C-%D7%9C%D7%A4%D7%A0%D7%99-%D7%94%D7%A6%D7%95-tvq22lquq6", // צה״ל – לפני הצו
  "israel/AliyahToIsrael": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%94%D7%A2%D7%9C%D7%99%D7%99%D7%94-%D7%9C%D7%90%D7%A8%D7%A5-%D7%99%D7%A9%D7%A8%D7%90%D7%9C-%D7%9E%D7%96%D7%95%D7%95%D7%93%D7%94-%D7%90%D7%97%D7%AA-s3p2crinq0", // העלייה לארץ ישראל – מזוודה אחת
  "israel/kaftet": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%9B%D7%98-%D7%91%D7%A0%D7%95%D7%91%D7%9E%D7%91%D7%A8-%D7%A9%D7%A0%D7%99-%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%9D-z49yy7h741", // כ״ט בנובמבר – שני שלישים
  "israel/memory": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%96%D7%9B%D7%A8%D7%95%D7%9F-%D7%94%D7%A9%D7%91%D7%A2%D7%94-%D7%91%D7%90%D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8-ilqkomna2k", // זכרון - השבעה באוקטובר
  "israel/haravotBarzel": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%9E%D7%9C%D7%97%D7%9E%D7%AA-%D7%94%D7%A9%D7%91%D7%99%D7%A2%D7%99-%D7%91%D7%90%D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8-zfw50h1smx", // מלחמת השביעי באוקטובר
  "sevenOct/memory": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%96%D7%9B%D7%A8%D7%95%D7%9F-%D7%94%D7%A9%D7%91%D7%A2%D7%94-%D7%91%D7%90%D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8-ilqkomna2k", // זכרון - השבעה באוקטובר
  "sevenOct/haravotBarzel": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%9E%D7%9C%D7%97%D7%9E%D7%AA-%D7%94%D7%A9%D7%91%D7%99%D7%A2%D7%99-%D7%91%D7%90%D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8-zfw50h1smx", // מלחמת השביעי באוקטובר
  "sevenOct/emotional": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%9E%D7%9C%D7%97%D7%9E%D7%94-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-%D7%9E%D7%94-%D7%94%D7%97%D7%96%D7%99%D7%A7-%D7%90%D7%95%D7%AA%D7%A0%D7%95-qmtp3iyzt6", // מלחמה בישראל – מה החזיק אותנו
  "israel/emotional": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l/%D7%9E%D7%9C%D7%97%D7%9E%D7%94-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-%D7%9E%D7%94-%D7%94%D7%97%D7%96%D7%99%D7%A7-%D7%90%D7%95%D7%AA%D7%A0%D7%95-qmtp3iyzt6", // מלחמה בישראל – מה החזיק אותנו
  "movies/movieJourney": "/library/%D7%A1%D7%A8%D7%98%D7%99%D7%9D-18yczh9adi/%D7%9E%D7%A1%D7%A2-%D7%91%D7%A2%D7%95%D7%9C%D7%9D-%D7%94%D7%A7%D7%95%D7%9C%D7%A0%D7%95%D7%A2-35z4fz1fnl", // מסע בעולם הקולנוע
  "movies/hollywoodInMiniature": "/library/%D7%A1%D7%A8%D7%98%D7%99%D7%9D-18yczh9adi/%D7%94%D7%95%D7%9C%D7%99%D7%95%D7%95%D7%93-%D7%91%D7%A7%D7%98%D7%9F-33i85izvtb", // הוליווד בקטן
  "teamwork/survival": "/library/%D7%A2%D7%91%D7%95%D7%93%D7%AA-%D7%A6%D7%95%D7%95%D7%AA-gnzeu5vg93/%D7%94%D7%99%D7%A9%D7%A8%D7%93%D7%95%D7%AA-%D7%A2%D7%9C-%D7%90%D7%99-%D7%91%D7%95%D7%93%D7%93-ql6qolf3gy", // הישרדות על אי בודד
  "seasons/summerAdventure": "/library/%D7%A2%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%A0%D7%94-g65uhq9m8x/%D7%A4%D7%A2%D7%95%D7%9C%D7%AA-%D7%A7%D7%99%D7%A5-b5d0ovz0w7", // פעולת קיץ
  "seasons/winterWorld": "/library/%D7%A2%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%A0%D7%94-g65uhq9m8x/%D7%A4%D7%A2%D7%95%D7%9C%D7%AA-%D7%97%D7%95%D7%A8%D7%A3-wv36tyc2sz", // פעולת חורף
  "seasons/autumnJourney": "/library/%D7%A2%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%A0%D7%94-g65uhq9m8x/%D7%A4%D7%A2%D7%95%D7%9C%D7%AA-%D7%A1%D7%AA%D7%99%D7%95-gz758wgo9z", // פעולת סתיו
  "seasons/springBlossom": "/library/%D7%A2%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%A0%D7%94-g65uhq9m8x/%D7%A4%D7%A2%D7%95%D7%9C%D7%AA-%D7%90%D7%91%D7%99%D7%91-mwhccgd5ih", // פעולת אביב
  "peak/escape": "/library/%D7%A4%D7%A2%D7%95%D7%9C%D7%95%D7%AA-%D7%A9%D7%99%D7%90-gszpvk3vrt/%D7%94%D7%91%D7%A8%D7%99%D7%97%D7%94-%D7%9E%D7%94%D7%9E%D7%A2%D7%A8%D7%94-o0fndwyrpb", // הבריחה מהמערה
  "peak/treasure": "/library/%D7%A4%D7%A2%D7%95%D7%9C%D7%95%D7%AA-%D7%A9%D7%99%D7%90-gszpvk3vrt/%D7%94%D7%9E%D7%A8%D7%93%D7%A3-%D7%90%D7%97%D7%A8-%D7%94%D7%90%D7%95%D7%A6%D7%A8-%D7%94%D7%90%D7%91%D7%95%D7%93-5ulms3lt6c", // המרדף אחר האוצר האבוד
  "peak/skyline": "/library/%D7%A4%D7%A2%D7%95%D7%9C%D7%95%D7%AA-%D7%A9%D7%99%D7%90-gszpvk3vrt/%D7%97%D7%99%D7%9C%D7%95%D7%A5-%D7%94%D7%A7%D7%95%D7%A4%D7%A1%D7%94-%D7%94%D7%9E%D7%A2%D7%95%D7%A4%D7%A4%D7%AA-1hrvsc86lu", // חילוץ הקופסה המעופפת
};

/** Old category slug → new category path. Old activities not listed above land on their category. */
export const LEGACY_CATEGORIES: Record<string, string> = {
  "games": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7", // משחקים
  "intro": "/library/%D7%9E%D7%A9%D7%97%D7%A7%D7%99%D7%9D-8zi9opdcu7", // משחקים
  "holidays": "/library/%D7%97%D7%92%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-icoq8h0x6l", // חגים ומועדים
  "responsibility": "/library/%D7%90%D7%97%D7%A8%D7%99%D7%95%D7%AA-8n4fpue2fs", // אחריות
  "environmental": "/library/%D7%90%D7%99%D7%9B%D7%95%D7%AA-%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94-ppfq0hq7tv", // איכות הסביבה
  "animals": "/library/%D7%91%D7%A2%D7%9C%D7%99-%D7%97%D7%99%D7%99%D7%9D-ieiltuo9z1", // בעלי חיים
  "superhero": "/library/%D7%92%D7%99%D7%91%D7%95%D7%A8%D7%99-%D7%A2%D7%9C-jlfd2i8d49", // גיבורי על
  "harassment": "/library/%D7%94%D7%98%D7%A8%D7%93%D7%94-%D7%9E%D7%99%D7%A0%D7%99%D7%AA-zs7ljlunse", // הטרדה מינית
  "traffic": "/library/%D7%96%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%91%D7%93%D7%A8%D7%9B%D7%99%D7%9D-qfzg4surb7", // זהירות בדרכים
  "friendship": "/library/%D7%97%D7%91%D7%A8%D7%95%D7%AA-yo3mi7os4g", // חברות
  "israel": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l", // ישראל
  "sevenOct": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l", // ישראל
  "personalities": "/library/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-84o36dqz6l", // ישראל
  "movies": "/library/%D7%A1%D7%A8%D7%98%D7%99%D7%9D-18yczh9adi", // סרטים
  "teamwork": "/library/%D7%A2%D7%91%D7%95%D7%93%D7%AA-%D7%A6%D7%95%D7%95%D7%AA-gnzeu5vg93", // עבודת צוות
  "seasons": "/library/%D7%A2%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%A0%D7%94-g65uhq9m8x", // עונות השנה
  "peak": "/library/%D7%A4%D7%A2%D7%95%D7%9C%D7%95%D7%AA-%D7%A9%D7%99%D7%90-gszpvk3vrt", // פעולות שיא
};
