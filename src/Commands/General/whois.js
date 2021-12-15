'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const moment = require('moment');

module.exports = class Whois extends Command {
    constructor(client) {
        super(client, {
            name: 'whois',
            description: 'Gives information about the provided user',
            usage: 'whois (user)',
            category: 'General',
            
            options: [{
                'name': 'target',
                'description': 'Get information on a specific user',
                'type': Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }   

    async execute(interaction, args) {
        const user = (args.target && await interaction.getMember(interaction.guildID, args.target)) ?? interaction.member;
        const roles = user.roles.map(role => user.guild?.roles.get(role)).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);

        return interaction.createFollowup({ embed: {
            author: { name: `${user.username}#${user.discriminator}`, icon_url: user.avatarURL },
            fields: [
                {
                    name: 'Guild Details',
                    value: `• Nickname: ${user.nick ?? 'No Nickname'}\n• Joined at: ${moment(new Date(user.joinedAt)).format('LL')} (\`${moment(user.joinedAt).fromNow()}\`)${roles.length ? '\n• Roles: ' + roles.join(' ') : ''}` // skipcq JS-0246
                },
                {
                    name: 'User Details',
                    value: `• Identity: ${user.username}#${user.discriminator} (\`${user.id}\`)\n• Registered: ${moment(new Date(user.createdAt)).format('LL')} (\`${moment(user.createdAt).fromNow()}\`)`
                }
            ],
            thumbnail: { url: user.avatarURL },
            color: roles.length ? user.guild?.roles.get(this.client.extensions.string.splitNumbers(roles[0])).color : null
        }});
    }
}