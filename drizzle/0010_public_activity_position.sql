ALTER TABLE `public_activity` ADD `position` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Keep the current order (newest first) within each category.
UPDATE `public_activity` SET `position` = (
	SELECT COUNT(*) FROM `public_activity` AS `p`
	WHERE `p`.`category_id` = `public_activity`.`category_id`
		AND (`p`.`created_at` > `public_activity`.`created_at`
			OR (`p`.`created_at` = `public_activity`.`created_at` AND `p`.`id` > `public_activity`.`id`))
);
