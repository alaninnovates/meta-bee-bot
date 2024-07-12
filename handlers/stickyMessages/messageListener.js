const { Colors, Events } = require('discord.js');
const stickyMessages = require('./messages');

module.exports = {
	event: Events.MessageCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Message} message
	 * @returns
	 */
	run: async (message) => {
		if (!stickyMessages[message.channel.id] || message.author.bot) return;
		const coll = message.client.db.collection('stickyMessages');
		if (await coll.has(message.channel.id)) {
			const msg = await message.channel.messages.fetch(
				await coll.get(message.channel.id),
			);
			if (msg) {
				try {
					await msg.delete();
				} catch (e) {
					console.error(e);
				}
			}
		}
		const msg = await message.channel.send({
			embeds: [
				stickyMessages[message.channel.id]
					.setThumbnail(
						'https://cdn.discordapp.com/attachments/1057919264151056414/1186106206012575744/beesmas_logo.png',
					)
					.setColor(Colors.DarkVividPink),
			],
		});
		await coll.set(message.channel.id, msg.id);
	},
};
