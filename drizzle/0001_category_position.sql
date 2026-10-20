ALTER TABLE `public_category` ADD `position` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Keep the current order (oldest first) for existing categories.
UPDATE `public_category` SET `position` = (
	SELECT COUNT(*) FROM `public_category` AS `p`
	WHERE `p`.`created_at` < `public_category`.`created_at`
		OR (`p`.`created_at` = `public_category`.`created_at` AND `p`.`id` < `public_category`.`id`)
);
