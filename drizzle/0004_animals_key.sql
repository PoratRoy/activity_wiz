-- The animals artwork was renamed from "animales" to "Animals"; keys match artwork ignoring case, so only this one moves.
UPDATE `public_category` SET `key` = 'Animals' WHERE lower(`key`) = 'animales';
