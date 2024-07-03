const { stripIndent } = require('common-tags/lib');
const {
	Events,
	userMention,
	EmbedBuilder,
	Colors,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { modules } = require('../../config.json');
const config = modules.keepReplace;

module.exports = {
	event: Events.MessageCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Message} message
	 */
	run: async (message) => {
		if (message.author.bot || message.channelId !== config.channelId)
			return;
		if (!message.attachments.size) {
			await message.delete();
			const m = await message.channel.send({
				content: userMention(message.member.id),
				embeds: [
					new EmbedBuilder()
						.setDescription(
							'Only images are allowed in this channel!',
						)
						.setColor(Colors.Red),
				],
			});
			setTimeout(() => m.delete(), 3000);
			return;
		}
		try {
			await message.member.createDM();
		} catch (e) {
			await message.delete();
			const m = await message.channel.send({
				content: userMention(message.member.id),
				embeds: [
					new EmbedBuilder()
						.setDescription(
							'You need to enable DMs from server members to use this channel!',
						)
						.setColor(Colors.Red),
				],
			});
			setTimeout(() => m.delete(), 3000);
			return;
		}
		const member = message.member;
		await message.channel.send({
			username: member.nickname,
			avatarURL: member.avatarURL(),
			content: stripIndent`
            **${userMention(
				member.id,
			)} needs help on deciding whether to keep or replace!**
            ${
				message.content.length
					? `Here's what they say: ${message.content}`
					: ''
			}`,
			files: message.attachments.map((a) => a.url),
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`keepReplace:keep:${member.id}`)
						.setLabel('Keep')
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId(`keepReplace:replace:${member.id}`)
						.setLabel('Replace')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId(`keepReplace:delete:${member.id}`)
						.setLabel('Delete')
						.setStyle(ButtonStyle.Secondary),
				),
			],
		});
		await message.delete();
	},
};
