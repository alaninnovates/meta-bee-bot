// roles, level system info

const { stripIndent } = require('common-tags');
const {
	SlashCommandStringOption,
	EmbedBuilder,
	SlashCommandNumberOption,
} = require('discord.js');

module.exports = [
	{
		name: 'rules',
		description: 'Get the rules of the server',
		options: [
			new SlashCommandNumberOption()
				.setName('rule_number')
				.setDescription('The rule number')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(13),
		],
		execute: (interaction) => {
			const rules = [
				'Follow the Discord TOS. Not following the Discord TOS will result in termination (i.e: using auto-typers, DM advertising, using a modified client, or being under the age of 13). https://discord.com/terms',
				'Engaging in chat floods/spamming or copypasta will result in punishments. Most of the time automod will do its job, but bypassing it will lead to an even bigger punishment.',
				"Refrain from bullying and being toxic with other server members, we wish to create a positive space here. This often leads to a few hours mute, but if it's used constantly, we will have to enforce bigger punishment.",
				'NSFW or Gore is not permitted within the server. This breaks Discord ToS, resulting in a permanent ban.',
				'Be appropriate. Extreme behavior will not be tolerated and light inappropriate jokes are allowed.',
				'Profanity is allowed, but abusing it to offend anyone is not. Bypassing the filter will lead to warning and mute, depending on the severity.',
				'Racial slurs and NSFW swear words and terms are not tolerated, bypassing will result in a permanent ban.',
				'Do not attempt to doxx/send malicious links to hack other server members. This breaks Discord ToS resulting in a permanent ban. However, if you are hacked or u have seen someone sending "bot messages" in direct messages, please contact us to kick the user until the problem is solved.',
				'Use common sense. All inappropriate profile pictures and names will be removed.',
				'Advertisements are not permitted unless permission is granted by our server admins.',
				"Use the channels for their purpose. Don't spam general chats with images or embeds, instead use channels made for it.",
				'Do not annoy our staff team with unimportant pings or messages. Arguing will lead to mute, if you think that someone from the staff team is not doing their job or is abusing its role, please contact our admin or creator.',
				'English Only. Communicating in other languages will result in a mute and a warning.',
			];
			return new EmbedBuilder()
				.setTitle(
					`Rule #${interaction.options.get('rule_number').value}`,
				)
				.setDescription(
					rules[interaction.options.get('rule_number').value - 1],
				)
				.setColor('#ff0000');
		},
	},
	{
		name: 'server',
		description: 'Get information about the server',
		execute: (interaction) => {
			return new EmbedBuilder().setTitle('Server Info')
				.setDescription(stripIndent`
                Server Information
:metabeelogo: Welcome to Meta Bee, the ultimate destination for Bee Swarm Simulator players looking to improve their skills and stay up-to-date on the current meta in the game. Our community is dedicated to helping each other learn and grow, and we offer a variety of resources and tools to help you succeed.

:metabeelogo: One of the key features of our server is the "Meta Bee Academy" where experienced players share their knowledge and strategies with newer players. Whether you're just starting out or you've been playing for a while, you'll find plenty of helpful advice and tips to take your game to the next level.

:metabeelogo: In addition to the Meta Bee Academy, we also have channels for general discussion, trading, and events. Our friendly and active community is always ready to lend a helping hand, and we encourage everyone to participate and contribute.

:metabeelogo: Important Channels to read:

- <#996125313518026792>
- <#997209767204356207>
- <#1051473758088593478>
- <#997208257577885856>

:metabeelogo: Want to get featured?
Upload a video using the Hive Builder talking about it for the chance to get server recognition, roles, and more!

:metabeelogo: Staff Applications
You can always fill out a staff application whenever you want with this link: https://forms.gle/4GtmDRCi7B1qWGZw8`);
		},
	},
	{
		name: 'website',
		description: 'Get information about the website',
		execute: (interaction) => {
			return new EmbedBuilder()
				.setTitle('Website')
				.setDescription('https://meta-bee.my.to');
		},
	},
	{
		name: 'hivebuilder',
		description: 'Get information about the hive builder bot',
		execute: (interaction) => {
			return new EmbedBuilder().setTitle('Hive Builder')
				.setDescription(stripIndent`
                Hive Builder Bot is a tool that allows users to easily create and customize virtual hives in the game Bee Swarm Simulator within the Discord platform. The bot allows users to add bees, mutations, and beequips to their hives, and also provides guides and resources to help players improve their gameplay. Hive Builder Bot was developed by alaninnovates#0123 and is specifically designed for use in Discord.

Check out our documentation at http://hive-builder.alaninnovates.com/ for more information.

Invite link:
https://tinyurl.com/hivebuilder`);
		},
	},
	{
		name: 'download',
		description: 'Get hive builder downloads',
		execute: (interaction) => {
			return new EmbedBuilder().setTitle('Download').addFields(
				{
					name: 'PC Version',
					value: 'https://www.mediafire.com/file/qo1lp2re1a8byyw/Hive_Builder_1.1_Setup_%28x86%29.exe/file',
				},
				{
					name: 'Mobile Version',
					value: 'https://play.google.com/store/apps/details?id=com.ArgasTechnologyLimited.HiveBuilder',
				},
			);
		},
	},
	{
		name: 'perks',
		description: 'Get information about the server perks',
		execute: (interaction) => {
			return [
				new EmbedBuilder().setTitle('Server Booster Perks')
					.setDescription(stripIndent`
✨ Embed permissions: Allow the user to use embeds in their messages, which can make them more visually appealing and easier to read.
✨ Thread permissions: Allow the user to create and participate in message threads, which can be useful for organizing conversations and keeping track of specific topics.
✨ Special giveaways: Offer the user exclusive access to special giveaways or contests that are only available to Server Boosters.
✨ Special events: Invite the user to participate in special events or activities that are only available to Server Boosters. These could include Q&A sessions with server staff, early access to new features or content, or other special perks.
`),
				new EmbedBuilder().setTitle('Server Supporter Perks')
					.setDescription(stripIndent`
✨ Embed permissions: Allow the user to use embeds in their messages, which can make them more visually appealing and easier to read.
✨ Thread permissions: Allow the user to create and participate in message threads, which can be useful for organizing conversations and keeping track of specific topics.
✨ Special giveaways: Offer the user exclusive access to special giveaways or contests that are only available to Server Supporters.
✨ Special events: Invite the user to participate in special events or activities that are only available to Server Supporters. These could include Q&A sessions with server staff, early access to new features or content, or other special perks.
`),
			];
		},
	},
];
