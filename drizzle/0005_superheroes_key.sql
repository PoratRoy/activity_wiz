-- The superheroes artwork was renamed from "Superheros" to "Superheroes"; keys match artwork ignoring case, so only this one moves.
UPDATE `public_category` SET `key` = 'Superheroes' WHERE lower(`key`) = 'superheros';
