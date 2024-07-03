const parseCustomId = (customId, namespace) => {
	if (!customId) return;
	const parsed = customId.split(':');
	if (parsed.length < 2 || parsed[0] !== namespace) return;
	return parsed;
};

module.exports = parseCustomId;
