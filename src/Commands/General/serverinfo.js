'use strict';

const { Constants } = require('eris');
const Command = require('@core/Command');

const Embed = require('@units/Embed');
const moment = require('moment');

module.exports = class Serverinfo extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            description: 'Displays information about the server',
            category: 'General'
        });
    }

    async execute(interaction) {
        const guild = await interaction.getGuild();
        const guildOwner = await interaction.getUser(guild.ownerID);

        const roles = guild.roles.map(role => role).sort((a, b) => b.position - a.position).map(role => role.name ===  '@everyone' ? role.name : `<@&${role.id}>`);
        return interaction.createFollowup(new Embed({
            author: {
				name: guild.name,
				icon_url: guild.iconURL ?? null
			},

			thumbnail: { url: guild.iconURL ?? null },

			fields: [
                {
					name: `Server Information`,
					value: '• Name: ' + `${guild.name} (\`${guild.id}\`)` + '\n• Owner: ' + `${guildOwner.username}#${guildOwner.discriminator}` + '\n• Created: ' + `${moment(new Date(guild.createdAt)).format('LL')} (\`${moment(guild.createdAt).fromNow()}\`)`
				},
				{
					name: `Member Information`,
					value: '• Member Count: ' + await guild.fetchAllMembers() + '\n• Humans: ' + guild.members.filter(m => !m.bot).length + '\n• Bots: ' + guild.members.filter(m => m.bot).length
				},
                {
                    name: `Miscellaneous`,
                    value: `• Roles: ` + roles.join(' ') + '\n• Text Channels: ' + guild.channels.filter(channel => channel.type === Constants.ChannelTypes.GUILD_TEXT).length + '\n• Voice Channels: ' + guild.channels.filter(channel => channel.type === Constants.ChannelTypes.GUILD_VOICE).length + '\n• Boosts Count: ' + guild.premiumSubscriptionCount || '0'
                }
			]
        }));
    }
}