const {
	Events,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	EmbedBuilder,
	Colors,
} = require('discord.js');
const { stripIndent } = require('common-tags');
const parseCustomId = require('../../util/customId');

module.exports = {
	event: Events.InteractionCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 * @returns
	 */
	run: async (interaction) => {
		const parsedId = parseCustomId(interaction.customId, 'keepReplace');
		if (!parsedId) return;
		const action = parsedId[1];
		const userId = parsedId[2];
		if (interaction.isButton()) {
			if (action === 'keep' || action === 'replace') {
				await interaction.showModal(
					new ModalBuilder()
						.setTitle('Keep or Replace Reason')
						.setCustomId(`keepReplace:${action}:${userId}`)
						.setComponents(
							new ActionRowBuilder().setComponents(
								new TextInputBuilder()
									.setCustomId('reason')
									.setLabel('Reason')
									.setPlaceholder(
										`Why should the ${action} this amulet?`,
									)
									.setMinLength(10)
									.setRequired(false)
									.setStyle(TextInputStyle.Paragraph),
							),
						),
				);
			} else if (action === 'delete') {
				if (interaction.user.id !== userId) {
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('Error')
								.setDescription(
									'Only the user who posted this amulet can delete it.',
								)
								.setColor(Colors.Red),
						],
						ephemeral: true,
					});
				}
				await interaction.message.delete();
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Amulet deleted')
							.setDescription('The amulet has been deleted.')
							.setColor(Colors.Green),
					],
					ephemeral: true,
				});
			}
		} else if (interaction.isModalSubmit()) {
			const reason = interaction.components[0].components[0].value;
			const targetUser = await interaction.client.users.fetch(userId);
			try {
				await targetUser.send({
					embeds: [
						new EmbedBuilder()
							.setTitle(
								`New amulet suggestion from ${interaction.user.tag}`,
							)
							.setDescription(
								stripIndent`
A user believes that you should ${action} your amulet.
${
	reason
		? stripIndent`Here is their reason:
\`\`\`
${reason}
\`\`\``
		: 'No reason was provided.'
}`,
							)
							.setColor(
								action === 'keep' ? Colors.Red : Colors.Green,
							),
					],
				});
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Message sent')
							.setDescription(
								`The user has been notified of your suggestion.`,
							)
							.setColor(Colors.Green),
					],
					ephemeral: true,
				});
			} catch (e) {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Failed to send message')
							.setDescription(
								'The user has their DMs disabled. Please let them know.',
							)
							.setColor(Colors.Red),
					],
					ephemeral: true,
				});
			}
		}
	},
};
