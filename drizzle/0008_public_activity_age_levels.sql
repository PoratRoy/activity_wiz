-- Library ages move from three grade ranges to two levels: א-ה is the young level, ו-ט and י-יב the older one.
UPDATE `public_activity` SET `age` = 'שכבה צעירה' WHERE `age` = 'כיתות א - ה';
--> statement-breakpoint
UPDATE `public_activity` SET `age` = 'שכבה בוגרת' WHERE `age` IN ('כיתות ו - ט', 'כיתות י - יב');
