const { stripIndent } = require('common-tags/lib');
const {
	Events,
	userMention,
	EmbedBuilder,
	Colors,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ThreadAutoArchiveDuration,
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
		const member = message.member;
		const chan = await message.startThread({
			name: `${
				member.nickname ?? member.user.username
			} Keep/Replace Help`,
			autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
			reason: 'User needs help deciding whether to keep or replace',
		});
		await chan.send({
			embeds: [
				new EmbedBuilder()
					.setDescription(
						stripIndent`
            ${userMention(
				member.id,
			)} needs help on deciding whether to keep or replace!`,
					)
					.setColor(Colors.Blue)
					.setThumbnail(member.avatarURL()),
			],
		});
		await message.react('🇰'); // :regional_indicator_k:
		await message.react('🇷'); // :regional_indicator_r:
	},
};
