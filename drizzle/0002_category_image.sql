ALTER TABLE `public_category` ADD `image` text;--> statement-breakpoint
-- Best-effort match of existing categories to the bundled artwork by Hebrew title; the rest can be set in /admin.
UPDATE `public_category` SET `image` = CASE trim(`title`)
	WHEN 'משחקים' THEN 'games'
	WHEN 'בעלי חיים' THEN 'animales'
	WHEN 'שנה חדשה' THEN 'newyear'
	WHEN 'ראש השנה' THEN 'newyear'
	WHEN 'חגים' THEN 'holidays'
	WHEN 'חגים ומועדים' THEN 'holidays'
	WHEN 'איכות הסביבה' THEN 'EnvironmentalQuality'
	WHEN 'מנהיגות' THEN 'Leaders'
	WHEN 'מנהיגים' THEN 'Leaders'
	WHEN 'גיבורי על' THEN 'Superheros'
	WHEN 'גיבורי-על' THEN 'Superheros'
	WHEN 'גיבורים' THEN 'Superheros'
	WHEN 'אחריות' THEN 'responsibility'
	WHEN 'אחריות אישית' THEN 'responsibility'
END
WHERE `image` IS NULL;
