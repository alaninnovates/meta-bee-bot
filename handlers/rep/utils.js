const { Colors, EmbedBuilder, bold, codeBlock } = require('discord.js');

/**
 *
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').User} user
 * @param {number} amount
 * @param {string} reason
 */
module.exports.sendRepLog = async (message, user, amount, reason) => {
	const channel = await message.client.channels.fetch('1257738813275504772');
	await channel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle(
					amount > 0 ? 'Reputation Given' : 'Reputation Removed',
				)
				.setDescription(
					`${bold(user.tag)} has been ${
						amount > 0 ? 'given' : 'removed'
					} ${amount} reputation for ${codeBlock(reason)}`,
				)
				.setColor(amount > 0 ? Colors.Green : Colors.Red),
		],
	});
};
