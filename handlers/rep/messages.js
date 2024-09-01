const { Events, EmbedBuilder, Colors } = require('discord.js');
const { modules } = require('../../config.json');
const { sendRepLog } = require('./utils');
const config = modules.rep;

module.exports = {
	event: Events.MessageCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Message} message
	 * @returns
	 */
	run: async (message) => {
		const cooldownColl = message.client.db.collection('repCooldown');
		const giveRep = async (userId, amount) => {
			if (userId in config.blacklist) {
				await message.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription(
								'You cannot give rep as you are blacklisted for `rep abuse`.',
							),
					],
				});
				return false;
			}
			const coll = message.client.db.collection('rep');
			if (await coll.has(userId)) {
				await coll.set(userId, (await coll.get(userId)) + amount);
			} else {
				await coll.set(userId, amount);
			}
			return true;
		};
		const getCooldown = async (userId) => {
			if (await cooldownColl.has(userId)) {
				return Date.now() - (await cooldownColl.get(userId));
			}
			return 0;
		};
		switch (message.channelId) {
			case config.ytChannelId: {
				if (
					message.author.bot ||
					!message.content.includes('youtube.com') ||
					!message.content.includes('youtu.be')
				) {
					return;
				}
				const success = await giveRep(
					message.author.id,
					config.ytPoints,
				);
				if (!success) return;
				await sendRepLog(
					message,
					message.author,
					config.ytPoints,
					'YT Video',
				);
				await message.react('🔥');
				return;
			}
			case config.bumpChannelId: {
				if (
					message.author.id !== '302050872383242240' ||
					!message.interaction ||
					message.interaction.commandName !== 'bump'
				) {
					return;
				}
				const success = await giveRep(
					message.interaction.user.id,
					config.bumpPoints,
				);
				if (!success) return;
				await sendRepLog(
					message,
					message.interaction.user,
					config.bumpPoints,
					'Bumping the server',
				);
				return;
			}
			case config.levelChannelId: {
				if (
					message.author.id !== '437808476106784770' ||
					!message.mentions.users.first() ||
					!message.author.bot
				) {
					return;
				}
				const matches = [...message.content.matchAll(/\d+/g)];
				if (!matches.length) return;
				const level = parseInt(matches[1]);
				const success = await giveRep(
					message.mentions.users.first().id,
					Math.ceil(level / 10),
				);
				if (!success) return;
				await sendRepLog(
					message,
					message.mentions.users.first(),
					Math.ceil(level / 10),
					`Leveling up to level ${level}`,
				);
				return;
			}
			case config.vouchChannelId: {
				if (message.author.bot) {
					return;
				}
				const cd = await getCooldown(message.author.id);
				console.log(cd);
				if (cd !== 0 && cd < config.vouchCooldown) {
					const m = await message.reply(
						`You must wait ${Math.ceil(
							(config.vouchCooldown - cd) / 1000,
						)} seconds before vouching again!`,
					);
					setTimeout(async () => {
						try {
							await m.delete();
						} catch (e) {}
					}, 5000);
					return;
				}
				if (!message.mentions.users.first()) {
					const m = await message.reply(
						'You must mention the user(s) you are vouching for!',
					);
					setTimeout(async () => {
						try {
							await m.delete();
						} catch (e) {}
					}, 5000);
					return;
				}
				if (message.mentions.users.has(message.author.id)) {
					const m = await message.reply(
						'You cannot vouch for yourself!',
					);
					setTimeout(async () => {
						try {
							await m.delete();
						} catch (e) {}
					}, 5000);
					return;
				}
				for (const userId of message.mentions.users.keys()) {
					const success = await giveRep(userId, config.vouchPoints);
					if (!success) return;
					await sendRepLog(
						message,
						message.mentions.users.get(userId),
						config.vouchPoints,
						`Vouch for user from ${message.author.tag}`,
					);
				}
				await message.react('👍');
				await cooldownColl.set(message.author.id, Date.now());
				return;
			}
		}
		// handle thread case
		if (
			message.channel.isThread() &&
			message.channel.parentId === config.hiveSupportChannelId
		) {
			const op = await message.channel.fetchOwner();
			if (message.author.id !== op.id) return;
			if (
				!config.repTriggerWords.some((word) =>
					message.content.toLowerCase().split(' ').includes(word),
				)
			) {
				return;
			}
			const cd = await getCooldown(op.id);
			if (cd !== 0 && cd < config.vouchCooldown) {
				const m = await message.reply(
					`You must wait ${Math.ceil(
						(config.vouchCooldown - cd) / 1000,
					)} seconds before vouching again!`,
				);
				setTimeout(async () => {
					try {
						await m.delete();
					} catch (e) {}
				}, 5000);
				return;
			}
			const threadUsers = await message.channel.members.fetch();
			const userIds = [];
			for (const userId of threadUsers.keys()) {
				const u = await message.client.users.fetch(userId);
				if (u.bot) continue;
				if (u.id === op.id) continue;
				const success = await giveRep(userId, config.hiveSupportPoints);
				if (!success) return;
				await sendRepLog(
					message,
					u,
					config.hiveSupportPoints,
					`Helping out in a support thread by ${op.user.tag}`,
				);
				userIds.push(userId);
			}
			await message.channel.send({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.Green)
						.setDescription(
							`Thanks for helping out <@${
								op.id
							}>!\nAdded 1 rep to ${userIds
								.map((uid) => `<@${uid}>`)
								.join(', ')}`,
						),
				],
			});
			await cooldownColl.set(message.author.id, Date.now());
		}
		if (
			config.repTriggerWords.some((word) =>
				message.content.toLowerCase().split(' ').includes(word),
			) &&
			message.author.id !== '1016024810918269010' // Meta Bee Manager
		) {
			let targetUser;
			if (message.mentions.users.first()) {
				targetUser = message.mentions.users.first();
			} else if (message.reference) {
				const replied = (await message.fetchReference()).author.id;
				targetUser = message.client.users.cache.get(replied);
			} else {
				return;
			}
			if (targetUser.id === message.author.id) {
				await message.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("You can't rep yourself!"),
					],
				});
				return;
			}
			const cd = await getCooldown(message.author.id);
			if (cd !== 0 && cd < config.vouchCooldown) {
				const m = await message.reply(
					`You must wait ${Math.ceil(
						(config.vouchCooldown - cd) / 1000,
					)} seconds before giving rep again!`,
				);
				setTimeout(async () => {
					try {
						await m.delete();
					} catch (e) {}
				}, 5000);
				return;
			}
			const success = await giveRep(targetUser.id, config.thanksPoints);
			if (!success) return;
			await sendRepLog(
				message,
				targetUser,
				config.thanksPoints,
				`Helping out ${message.author.tag}`,
			);
			await cooldownColl.set(message.author.id, Date.now());
			await message.react('👍');
			const m = await message.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.Green)
						.setDescription(
							`Rep given to ${targetUser.tag}! Thanks for helping out!`,
						),
				],
			});
			setTimeout(async () => {
				try {
					await m.delete();
				} catch (e) {}
			}, 5000);
		}
	},
};
