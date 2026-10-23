ALTER TABLE `public_activity` ADD `view_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `public_activity_views_idx` ON `public_activity` (`view_count`,`created_at`);