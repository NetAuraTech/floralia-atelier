import app from '@adonisjs/core/services/app';
import { test } from '@japa/runner';
import edge from 'edge.js';
import { ContactMailService } from '#cms/services/contact_mail_service';
import { restoreMailClient, swapMailClient } from '#tests/helpers/mail';

test.group('ContactMailService', () => {
	test('sendContactFormEmail() passes the submission fields as a renderable record', async ({ assert }) => {
		const mail = swapMailClient();
		const service = await app.container.make(ContactMailService);

		await service.sendContactFormEmail({
			lastname: 'Dupont',
			firstname: 'Marie',
			email: 'marie@example.com',
			message: 'Bonjour, je souhaiterais un devis pour un bouquet de mariage.',
		});
		restoreMailClient();

		assert.equal(mail.sent.length, 1);
		const message = mail.sent[0];
		assert.equal(message.to, 'contact@example.com');
		assert.equal(message.template, 'emails/contact_form_email');

		// The fields travel nested under `fields` (not spread at the top level):
		// the template iterates that record to render the request content.
		const data = message.data as Record<string, any>;
		assert.deepEqual(data.fields, {
			lastname: 'Lastname: Dupont',
			firstname: 'Firstname: Marie',
			email: 'Email: marie@example.com',
			message: 'Message: Bonjour, je souhaiterais un devis pour un bouquet de mariage.',
		});
		assert.notProperty(data, 'lastname');
	});

	test('sendContactFormEmail() renders a mail body containing the request content', async ({ assert }) => {
		const mail = swapMailClient();
		const service = await app.container.make(ContactMailService);

		await service.sendContactFormEmail({
			lastname: 'Durand',
			firstname: 'Paul',
			email: 'paul@example.com',
			message: 'Bonjour, pourriez-vous prendre en charge l’entretien de la sépulture familiale ?',
		});
		restoreMailClient();

		// Render the exact template with the exact data the mail client would
		// hand to the view engine (same call as AdonisMailClient.htmlView), so a
		// template/data mismatch surfaces here instead of in a real inbox.
		const data = mail.sent[0].data as Record<string, any>;
		const html = await edge.render('emails/contact_form_email', data);

		assert.include(html, 'Lastname: Durand');
		assert.include(html, 'Firstname: Paul');
		assert.include(html, 'Email: paul@example.com');
		assert.include(html, 'Bonjour, pourriez-vous prendre en charge l’entretien de la sépulture familiale ?');
	});
});
