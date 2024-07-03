const {
	REST,
	Routes,
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const commands = [
	new ContextMenuCommandBuilder()
		.setName('Bot Documentation')
		.setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder()
		.setName('Hive Builder Downloads')
		.setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder()
		.setName('Meta Bee Site')
		.setType(ApplicationCommandType.User),
	new SlashCommandBuilder()
		.setName('rep')
		.setDescription('Reputation commands')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('give')
				.setDescription('Give reputation to a user')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to give reputation to')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription("View a user's reputation")
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to view reputation of'),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('leaderboard')
				.setDescription('Get the reputation leaderboard'),
		)
		.addSubcommandGroup((group) =>
			group
				.setName('admin')
				.setDescription('Admin commands')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('reset')
						.setDescription("Reset a user's reputation")
						.addUserOption((option) =>
							option
								.setName('user')
								.setDescription(
									'The user to reset reputation of',
								)
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('set')
						.setDescription("Set a user's reputation")
						.addUserOption((option) =>
							option
								.setName('user')
								.setDescription('The user to set reputation of')
								.setRequired(true),
						)
						.addIntegerOption((option) =>
							option
								.setName('amount')
								.setDescription(
									'The amount of reputation to set',
								)
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('subtract')
						.setDescription('Subtract reputation from a user')
						.addUserOption((option) =>
							option
								.setName('user')
								.setDescription(
									'The user to subtract reputation from',
								)
								.setRequired(true),
						)
						.addIntegerOption((option) =>
							option
								.setName('amount')
								.setDescription(
									'The amount of reputation to subtract',
								)
								.setRequired(true),
						),
				),
		),
];

const infoCommand = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Information about the server');

for (const command of require('./handlers/infoCommands/commands')) {
	const sub = new SlashCommandSubcommandBuilder()
		.setName(command.name)
		.setDescription(command.description)
		.addUserOption((option) =>
			option.setName('user').setDescription('The user to ping'),
		);
	if (command.options && command.options.length) {
		for (const opt of command.options) {
			sub.options.push(opt);
		}
	}
	sub.options.sort((a, b) =>
		a.required === b.required ? 0 : a.required ? -1 : 1,
	);
	infoCommand.addSubcommand(sub);
}

commands.push(infoCommand);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		// const cmds = await rest.get(
		// 	Routes.applicationGuildCommands(clientId, guildId),
		// );
		// for (const cmd of cmds) {
		// 	await rest.delete(
		// 		Routes.applicationGuildCommand(clientId, guildId, cmd.id),
		// 	);
		// }
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	} catch (error) {
		console.error(error);
	}
})();
