const { stripIndent } = require('common-tags');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	'1052316363227660290': new EmbedBuilder().setDescription(stripIndent`
Hello, Thank you for donating/boosting!
Be sure to contact staff to claim perks.
To list a few perks:
:sparkles: Embed permissions: You can now send images and embed links in any channel!
:sparkles: Special giveaways: Offer the user exclusive access to special giveaways or contests that are only available to Server Boosters.

You can find more information about perks with the </info perks:1185768728751783956> command.
`) /*
	'1065685975071719425': new EmbedBuilder().setDescription(stripIndent`
Hey there! In this channel you can promote your coaching for BSS.
Please use following format while making an advertisement:
- CV (everything about yourself)
- Payment:
- Notes:
*To get Coach role you have to contact staff and be at least level 5.*
`),*/,
	'1058044633420152842': new EmbedBuilder().setDescription(stripIndent`
Hey there! In this channel we promote small BSS youtubers. 
Requirements:
<:yt:1058471302828138576> The video must be related to Bee Swarm Simulator. This means it should be focused on gameplay, strategies, or other aspects of the game.
<:yt:1058471302828138576> The video must promote our Discord server. This could be through a mention in the video, a link in the description, or any other way that encourages viewers to join our community.
<:yt:1058471302828138576> The channel must have at least 1,000 subscribers. This helps ensure that the content shared on our Discord channel is of high quality and reaches a wide audience.
*If your video meets these requirements, please contact staff to get the role.*
`),
	'1074337367252533329': new EmbedBuilder().setDescription(stripIndent`
Hey there! In this channel you can share your VIP server to macro/grind with other. You are free to set requirements and kick/ban people. 
Please use the following format while making a post:
- Requirements
- Server Link
- Notes
`),
	'1070168053205192704': new EmbedBuilder().setDescription(stripIndent`
Hey there! In this channel you can ask people if you should keep/replace your amulet. The channel automatically makes a post. 
The requirement for the post is: 
- Message must contain an image
- You must state your gameplan (blue, red, white, mixed etc.)
`),
};
