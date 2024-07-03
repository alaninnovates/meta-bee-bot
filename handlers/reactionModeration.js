const { Events } = require('discord.js');
const Filter = require('bad-words');

const filter = new Filter();
filter.addWords('bruh');

module.exports = {
	event: Events.MessageReactionAdd,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').MessageReaction} reaction
	 * @param {import('discord.js').User} user
	 * @returns
	 */
	run: async (reaction, user) => {
		// console.log(reaction.emoji);
		if (!reaction.emoji.name.startsWith('regional_indicator')) return;
		const message = reaction.message;
		const letters = [];
		for (const { emoji } of message.reactions.cache.values()) {
			if (emoji.name.startsWith('regional_indicator')) {
				letters.push(emoji.name.split('_')[1]);
			}
		}
		const word = letters.join('');
		if (filter.isProfane(word)) {
			reaction.message.channel.send('test');
		}
	},
};
