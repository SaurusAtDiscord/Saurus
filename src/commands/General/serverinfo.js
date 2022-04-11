'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

const { DateTime } = require('luxon');

module.exports = class Serverinfo extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            description: 'Displays information about the server'
        });
    }

    /* Adding the method "execute" on Command class. */
    async execute(interaction) {
        const guild = interaction.member.guild;
        const guildOwner = await this.client.utils.getUser(guild.ownerID);
        const members = await guild.fetchMembers();

        const roles = guild.roles?.map(role => role)?.sort((a, b) => b?.position - a?.position).filter(role => role?.name !== '@everyone');
        const stringedRoles = roles?.map(role => `<@&${role?.id}>`);

        const createdAt = DateTime.fromMillis(guild.createdAt);
        return interaction.createFollowup({ embed: {
            author: {
				name: guild.name,
				icon_url: guild.iconURL
			},

			thumbnail: { url: guild.iconURL },

			fields: [
                {
					name: `Server Information`,
					value: `• Name: ${guild.name} (\`${guild.id}\`) \n• Owner: ${guildOwner.username}#${guildOwner.discriminator} \n• Created: ${createdAt.toFormat('DDD t')} (\`${createdAt.toRelative()}\`)`
				},
				{
					name: `Member Information`,
					value: `• Member Count: ${members.length} \n• Humans: ${members.filter(m => !m.bot).length} \n• Bots: ${members.filter(m => m.bot).length}`
				},
                {
                    name: `Miscellaneous`,
                    value: `• Roles: ${stringedRoles.join(' ')} \n• Text Channels: ${guild.channels.filter(channel => channel.type === Constants.ChannelTypes.GUILD_TEXT).length} \n• Voice Channels: ${guild.channels.filter(channel => channel.type === Constants.ChannelTypes.GUILD_VOICE).length} \n• Boosts Count: ${guild.premiumSubscriptionCount || '0'}`
                }
			]
        }});
    }
}