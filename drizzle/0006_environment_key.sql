-- The environmental-quality artwork was replaced by "Environment"; move that category's key so it keeps its artwork.
UPDATE `public_category` SET `key` = 'Environment'
WHERE lower(`key`) = 'environmentalquality'
	AND NOT EXISTS (SELECT 1 FROM `public_category` WHERE lower(`key`) = 'environment');
