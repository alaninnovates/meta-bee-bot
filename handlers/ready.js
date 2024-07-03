const {
	EmbedBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
} = require('@discordjs/builders');
const { Events, Colors } = require('discord.js');

module.exports = {
	event: Events.ClientReady,
	type: 'once',
	/**
	 *
	 * @param {import('discord.js').Client} c
	 */
	run: async (c) => {
		console.log('Ready!');
		return;
		const testChan = await c.channels.fetch('997209088847003648');
		if (!testChan || !testChan.isTextBased()) return;
		await testChan.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Select your hive color')
					.setColor(Colors.White),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setCustomId('rr:hive-color')
						.setOptions([
							new SelectMenuOptionBuilder()
								.setLabel('Blue Hive')
								.setValue('blue')
								.setEmoji({
									id: '1067889983924482188',
								}),
							new SelectMenuOptionBuilder()
								.setLabel('Red Hive')
								.setValue('red')
								.setEmoji({
									id: '1067889963292688444',
								}),
							new SelectMenuOptionBuilder()
								.setLabel('White Hive')
								.setValue('white')
								.setEmoji({
									id: '1067889966400667699',
								}),
							new SelectMenuOptionBuilder()
								.setLabel('Mixed Hive')
								.setValue('mixed')
								.setEmoji({
									id: '1067889968699166780',
								}),
						]),
				),
			],
		});
		await testChan.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Select your hive level')
					.setColor(Colors.Grey),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setCustomId('rr:hive-level')
						.setOptions([
							new SelectMenuOptionBuilder()
								.setLabel('Level >13 Hive')
								.setValue('13-under')
								.setEmoji({
									name: '1️⃣',
								}),
							new SelectMenuOptionBuilder()
								.setLabel('Level 14-15 Hive')
								.setValue('14-15')
								.setEmoji({
									name: '2️⃣',
								}),
							new SelectMenuOptionBuilder()

								.setLabel('Level 16-17 Hive')
								.setValue('16-17')
								.setEmoji({
									name: '3️⃣',
								}),
							new SelectMenuOptionBuilder()
								.setLabel('Level 18-19 Hive')
								.setValue('18-19')
								.setEmoji({
									name: '4️⃣',
								}),
							new SelectMenuOptionBuilder()
								.setLabel('Level 20+ Hive')
								.setValue('20+')
								.setEmoji({
									name: '5️⃣',
								}),
						]),
				),
			],
		});
	},
};
