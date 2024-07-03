const { Client, IntentsBitField, Partials } = require('discord.js');
const { token } = require('./config.json');
const walk = require('./util/walk');
const Database = require('./util/database');

const db = new Database('./database.json');
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.MessageContent,
	],
	partials: [
		Partials.Reaction,
		Partials.ThreadMember,
		Partials.GuildMember,
		Partials.User,
	],
});
client.db = db;

const handlers = walk('./handlers').map((h) => require(h));
for (const handler of handlers) {
	if (!handler.type) continue;
	client[handler.type](handler.event, handler.run);
}

client.login(token);
