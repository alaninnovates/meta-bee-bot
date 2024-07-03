const { Events, EmbedBuilder, Colors } = require('discord.js');
const parseCustomId = require('../util/customId');

const roles = {
	'hive-color': {
		blue: {
			roleId: '1067816025111928944',
			name: 'Blue Hive',
			emojiId: '1067889983924482188',
			color: Colors.Blue,
		},
		red: {
			roleId: '1067816067197579345',
			name: 'Red Hive',
			emojiId: '1067889963292688444',
			color: Colors.Red,
		},
		white: {
			roleId: '1067816104166162474',
			name: 'White Hive',
			emojiId: '1067889966400667699',
			color: Colors.White,
		},
		mixed: {
			roleId: '1067816127251615774',
			name: 'Mixed Hive',
			emojiId: '1067889968699166780',
			color: Colors.Yellow,
		},
	},
	'hive-level': {
		'13-under': {
			roleId: '1067818642248577134',
			name: 'Level >13 Hive',
			emojiId: '1012378169480855622',
			color: Colors.Blue,
		},
		'14-15': {
			roleId: '1067818731612418048',
			name: 'Level 14-15 Hive',
			emojiId: '1012378169480855622',
			color: Colors.Blue,
		},
		'16-17': {
			roleId: '1067818787958706246',
			name: 'Level 16-17 Hive',
			emojiId: '1012378169480855622',
			color: Colors.Blue,
		},
		'18-19': {
			roleId: '1067819032562118667',
			name: 'Level 18-19 Hive',
			emojiId: '1012378169480855622',
			color: Colors.Blue,
		},
		'20+': {
			roleId: '1069359531290800138',
			name: 'Level 20+ Hive',
			emojiId: '1012378169480855622',
			color: Colors.Blue,
		},
	},
};

const getIdsForNs = (ns) => Object.values(roles[ns]).map((role) => role.roleId);
const hasRole = (roles, roleId) => {
	if (Array.isArray(roles)) {
		let hasRole = false;
		for (const role of roles) {
			if (role.id === roleId) {
				hasRole = true;
				break;
			}
		}
		return hasRole;
	} else {
		return roles.cache.some((role) => role.id === roleId);
	}
};

module.exports = {
	event: Events.InteractionCreate,
	type: 'on',
	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 * @returns
	 */
	run: async (interaction) => {
		const parsedId = parseCustomId(interaction.customId, 'rr');
		if (interaction.isStringSelectMenu() && parsedId) {
			await interaction.deferReply({ ephemeral: true });
			const value = interaction.values[0];
			const ns = parsedId[1];
			const data = roles[ns][value];
			for (const id of getIdsForNs(ns)) {
				if (!hasRole(interaction.member.roles, id)) continue;
				await interaction.member.roles.remove(id);
			}
			await interaction.member.roles.add(data.roleId);
			const emoji = await interaction.guild.emojis.fetch(data.emojiId);
			interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							`**Added role:**  ${emoji} ${data.name}`,
						)
						.setColor(data.color),
				],
			});
		}
	},
};
