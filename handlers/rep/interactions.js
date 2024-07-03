const { Events, EmbedBuilder, Colors, bold } = require('discord.js');
const { modules } = require('../../config.json');
const { sendRepLog } = require('./utils');
const config = modules.rep;

module.exports = {
	event: Events.InteractionCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 * @returns
	 */
	run: async (interaction) => {
		if (!interaction.isCommand() || interaction.commandName !== 'rep') {
			return;
		}
		const group = await interaction.options.getSubcommandGroup(false);
		if (group === 'admin') {
			if (!config.admins.includes(interaction.user.id)) {
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Error!')
							.setDescription(
								'You do not have permission to use this command!',
							)
							.setColor(Colors.Red),
					],
				});
			}
			const subcommand = await interaction.options.getSubcommand();
			switch (subcommand) {
				case 'reset': {
					const user = interaction.options.getUser('user', true);
					const coll = interaction.client.db.collection('rep');
					await coll.delete(user.id);
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('Success!')
								.setDescription(
									`${bold(user.tag)}'s rep has been reset!`,
								)
								.setColor(Colors.Green),
						],
					});
					break;
				}
				case 'set': {
					const user = interaction.options.getUser('user', true);
					const amount = interaction.options.getInteger(
						'amount',
						true,
					);
					const coll = interaction.client.db.collection('rep');
					await coll.set(user.id, amount);
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('Success!')
								.setDescription(
									`${bold(
										user.tag,
									)}'s rep has been set to ${amount}!`,
								)
								.setColor(Colors.Green),
						],
					});
					break;
				}
				case 'subtract': {
					const user = interaction.options.getUser('user', true);
					const amount = interaction.options.getInteger(
						'amount',
						true,
					);
					const coll = interaction.client.db.collection('rep');
					if (!(await coll.has(user.id))) {
						return await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('Error!')
									.setDescription(
										`${bold(
											user.tag,
										)} does not have any rep!`,
									)
									.setColor(Colors.Red),
							],
						});
					}
					const repAmt = await coll.get(user.id);
					if (repAmt < amount) {
						return await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('Error!')
									.setDescription(
										`${bold(
											user.tag,
										)} does not have enough rep!`,
									)
									.setColor(Colors.Red),
							],
						});
					}
					await coll.set(user.id, repAmt - amount);
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('Success!')
								.setDescription(
									`${bold(
										user.tag,
									)} has had ${amount} rep subtracted!`,
								)
								.setColor(Colors.Green),
						],
					});
					break;
				}
			}
		}
		const command = interaction.options.getSubcommand();
		switch (command) {
			case 'give': {
				const getCooldown = async (userId) => {
					const coll =
						interaction.client.db.collection('repCooldown');
					if (await coll.has(userId)) {
						return Date.now() - (await coll.get(userId));
					}
					return 0;
				};
				const cd = await getCooldown(interaction.user.id);
				if (cd !== 0 && cd < config.vouchCooldown) {
					await interaction.reply(
						`You must wait ${Math.ceil(
							(config.vouchCooldown - cd) / 1000,
						)} seconds before vouching again!`,
					);
					return;
				}
				const user = interaction.options.getUser('user', true);
				const coll = interaction.client.db.collection('rep');
				let repAmt = 0;
				if (await coll.has(user.id)) {
					repAmt = await coll.get(user.id);
				}
				repAmt++;
				await coll.set(user.id, repAmt);
				await sendRepLog(
					interaction,
					user,
					1,
					`Helping out ${interaction.user.tag}`,
				);
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Success!')
							.setDescription(
								`You have given 1 rep to ${user.tag}!`,
							)
							.setColor(Colors.Green),
					],
				});
				await cooldownColl.set(interaction.user.id, Date.now());
				break;
			}
			case 'view': {
				const user =
					interaction.options.getUser('user', false) ||
					interaction.user;
				let repAmt = 0;
				const coll = interaction.client.db.collection('rep');
				if (await coll.has(user.id)) {
					repAmt = await coll.get(user.id);
				}
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setDescription(
								`${bold(user.tag)} has ${repAmt} rep!`,
							)
							.setColor(Colors.Blue),
					],
				});
				break;
			}
			case 'leaderboard': {
				const coll = interaction.client.db.collection('rep');
				const data = coll.list();
				const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
				const top10 = sorted.slice(0, 10);
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Rep Leaderboard')
							.setDescription(
								top10
									.map(
										([id, rep], i) =>
											`${i + 1}. <@${id}> - ${rep}`,
									)
									.join('\n'),
							)
							.setColor(Colors.Blue),
					],
				});
				break;
			}
		}
	},
};
