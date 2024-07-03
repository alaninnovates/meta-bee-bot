const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  event: Events.InteractionCreate,
  type: "on",
  /**
   *
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (interaction) => {
    if (!interaction.isUserContextMenuCommand()) return;
    const userMention = `<@${interaction.targetId}>`;
    switch (interaction.commandName) {
      case "Bot Documentation":
        await interaction.reply({
          content: userMention,
          embeds: [
            new EmbedBuilder()
              .setTitle("Hive Builder Bot Documentation")
              .setURL("https://hive-builder.alaninnovates.com")
              .setColor("Orange"),
          ],
        });
        break;
      case "Hive Builder Downloads":
        await interaction.reply({
          content: userMention,
          embeds: [
            new EmbedBuilder()
              .setTitle("Hive Builder Downloads")
              .setDescription(
                `
						PC Version: [Click Here](https://www.mediafire.com/file/qo1lp2re1a8byyw/Hive_Builder_1.1_Setup_%2528x86%2529.exe/file)
						Mobile Version: [Click Here](https://play.google.com/store/apps/details?id=com.ArgasTechnologyLimited.HiveBuilder)
						`
              )
              .setColor("Orange"),
          ],
        });
        break;
      case "Meta Bee Site":
        await interaction.reply({
          content: userMention,
          embeds: [
            new EmbedBuilder()
              .setTitle("Meta Bee Site")
              .setURL("https://meta-bee.my.to")
              .setColor("Orange"),
          ],
        });
        break;
    }
  },
};
