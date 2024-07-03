const { Events } = require('discord.js');
const commands = require('./commands');

module.exports = {
	event: Events.InteractionCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 * @returns
	 */
	run: async (interaction) => {
		if (!interaction.isCommand() || interaction.commandName !== 'info')
			return;
		const command = interaction.options.getSubcommand();
		const user = interaction.options.getUser('user', false);
		for (const cmd of commands) {
			if (cmd.name === command) {
				const res = cmd.execute(interaction, user);
				interaction.reply({
					content: user ? `<@${user.id}>` : undefined,
					embeds: res.length ? res : [res],
					ephemeral: !user,
				});
				return;
			}
		}
	},
};
