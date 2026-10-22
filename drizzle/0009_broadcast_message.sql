CREATE TABLE `broadcast_message` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`with_form` integer DEFAULT false NOT NULL,
	`sent_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `last_seen_message_id` text;