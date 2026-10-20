-- The image name becomes the category's English key; artwork is now matched from the key.
ALTER TABLE `public_category` RENAME COLUMN `image` TO `key`;--> statement-breakpoint
-- Keys must be unique: if two categories were matched to the same image, keep it on the older one.
UPDATE `public_category` SET `key` = NULL
WHERE `key` IS NOT NULL AND `id` NOT IN (
	SELECT `id` FROM (
		SELECT `id`, ROW_NUMBER() OVER (PARTITION BY `key` ORDER BY `created_at`, `id`) AS `n`
		FROM `public_category` WHERE `key` IS NOT NULL
	) WHERE `n` = 1
);--> statement-breakpoint
CREATE UNIQUE INDEX `public_category_key_unique` ON `public_category` (`key`);
