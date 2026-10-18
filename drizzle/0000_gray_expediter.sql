CREATE TABLE `activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`body_md` text NOT NULL,
	`type` text,
	`subject` text,
	`place` text,
	`duration` text,
	`equipment` text,
	`teams` text,
	`shabbat` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activity_user_created_idx` ON `activity` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `public_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`title` text NOT NULL,
	`body_md` text NOT NULL,
	`type` text NOT NULL,
	`subject` text NOT NULL,
	`place` text NOT NULL,
	`duration` text NOT NULL,
	`equipment` text,
	`teams` text,
	`shabbat` text,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `public_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `public_activity_category_created_idx` ON `public_activity` (`category_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `public_category` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`google_sub` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`movement` text,
	`grade` text,
	`group_size` text,
	`gender` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_sub_unique` ON `users` (`google_sub`);