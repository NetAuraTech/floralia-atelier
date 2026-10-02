import { test } from '@japa/runner';
import { LOCALES, loadLang } from '#tests/helpers/i18n_lang_loader';

/**
 * Key-parity guard for the locale lang trees.
 *
 * The admin UI, the public pages and the mail templates resolve their copy
 * from the request locale, and a key that is present in one locale but
 * missing in the other renders as the raw key path. These tests assert that
 * the `en` and `fr` trees carry exactly the same set of keys, so dropping or
 * adding a translation on one side without the other fails the suite.
 */
test.group('i18n lang key parity', () => {
	const [reference, other] = LOCALES;

	test(`every key in ${reference} exists in ${other}`, ({ assert }) => {
		const referenceKeys = loadLang(reference);
		const otherKeys = loadLang(other);

		const missing = Object.keys(referenceKeys).filter((key) => !(key in otherKeys));

		assert.deepEqual(missing, [], `keys present in ${reference} but missing in ${other}: ${missing.join(', ')}`);
	});

	test(`every key in ${other} exists in ${reference}`, ({ assert }) => {
		const referenceKeys = loadLang(reference);
		const otherKeys = loadLang(other);

		const orphan = Object.keys(otherKeys).filter((key) => !(key in referenceKeys));

		assert.deepEqual(orphan, [], `keys present in ${other} but missing in ${reference}: ${orphan.join(', ')}`);
	});
});
