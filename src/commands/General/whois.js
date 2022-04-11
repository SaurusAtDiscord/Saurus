'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const { DateTime } = require('luxon');

module.exports = class Whois extends Command {
    constructor(client) {
        super(client, {
            name: 'whois',
            description: 'Gives information about the provided member',
            
            options: [{
                name: 'member',
                description: 'Get information on a specific member',
                type: Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const member = interaction.data.resolved?.members?.get(args.member) ?? interaction.member;
        
        const roles = member.roles && member.roles.map(role => member.guild.roles.get(role)).sort((a, b) => b.position - a.position);
        const stringedMappedRoles = roles.map(role => `<@&${role.id}>`);
        const stringedRole = stringedMappedRoles.length ? `\n• Roles: ${stringedMappedRoles.join(' ')}` : '';
        
        const joinedAt = DateTime.fromMillis(member.joinedAt);
        const createdAt = DateTime.fromMillis(member.createdAt);
        return interaction.createFollowup({ embed: {
            author: { name: `${member.username}#${member.discriminator}`, icon_url: member.avatarURL },
            fields: [
                {
                    name: 'Guild Details',
                    value: `• Nickname: ${member.nick ?? 'No Nickname'}\n• Joined at: ${joinedAt.toFormat('DDD t')} (\`${joinedAt.toRelative()}\`)${stringedRole}`
                },
                {
                    name: 'User Details',
                    value: `• Identity: ${member.username}#${member.discriminator} (\`${member.id}\`)\n• Registered: ${createdAt.toFormat('DDD t')} (\`${createdAt.toRelative()}\`)`
                }
            ],
            thumbnail: { url: member.avatarURL },
            color: roles.length && roles[0]?.color
        }});
    }
}