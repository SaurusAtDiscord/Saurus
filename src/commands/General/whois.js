'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const { DateTime } = require('luxon');

module.exports = class Whois extends Command {
    constructor(client) {
        super(client, {
            name: 'whois',
            description: 'Gives information about the provided user',
            
            options: [{
                'name': 'user',
                'description': 'Get information on a specific user',
                'type': Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const user = (args.user && await this.client.utils.getMember(interaction.guildID, args.user).catch(() => {})) ?? interaction.member;
        const roles = user.roles && user.roles.map(role => user.guild.roles.get(role)).sort((a, b) => b.position - a.position);
        const stringedMappedRoles = roles.map(role => `<@&${role.id}>`);
        const stringedRole = stringedMappedRoles.length ? `\n• Roles: ${stringedMappedRoles.join(' ')}` : '';
        
        const joinedAt = DateTime.fromISO(new Date(user.joinedAt).toISOString());
        const createdAt = DateTime.fromISO(new Date(user.createdAt).toISOString());
        return interaction.createFollowup({ embed: {
            author: { name: `${user.username}#${user.discriminator}`, icon_url: user.avatarURL },
            fields: [
                {
                    name: 'Guild Details',
                    value: `• Nickname: ${user.nick ?? 'No Nickname'}\n• Joined at: ${joinedAt.toFormat('DDD')} (\`${joinedAt.toRelative()}\`)${stringedRole}`
                },
                {
                    name: 'User Details',
                    value: `• Identity: ${user.username}#${user.discriminator} (\`${user.id}\`)\n• Registered: ${createdAt.toFormat('DDD')} (\`${createdAt.toRelative()}\`)`
                }
            ],
            thumbnail: { url: user.avatarURL },
            color: roles.length && roles[0].color
        }});
    }
}