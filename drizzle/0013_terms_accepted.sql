ALTER TABLE `users` ADD `terms_accepted_at` integer;--> statement-breakpoint
-- Everyone who signed up so far accepted the old blocking terms popup first.
UPDATE `users` SET `terms_accepted_at` = `created_at` WHERE `terms_accepted_at` IS NULL;
