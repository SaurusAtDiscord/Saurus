'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const { DateTime } = require('luxon');
const enc = require('crypto');

module.exports = class Warn extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            description: 'Warn a specified user',

            clientPermissions: ['moderateMembers'],
            subCommandUserPermissions: { add: ['moderateMembers'], remove: ['moderateMembers'], clear: ['moderateMembers'] },
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'add',
                description: 'Add warning to a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to warn',
                    required: true
                }, {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'reason',
                    description: 'The reason for the following warning'
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'list',
                description: 'List all warnings for a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to list warnings',
                    required: true
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'remove',
                description: 'Remove a warning from a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to remove a warn from',
                    required: true
                }, {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'id',
                    description: 'The id of the warning to remove, use list to view ids',
                    required: true
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'clear',
                description: 'Clear warnings from a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to clear warnings from',
                    required: true
                }]
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, data) {
        const { subCommand, args } = data;
        const guildId = interaction.guildID;

        const member = await this.client.utils.getMember(guildId, args.target).catch(() => null);
        const user = (member && await this.client.database.getUser(`${args.target}:${guildId}`));
        if (!user) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided user.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('Bots do not have warning data.'));

        if (['list', 'remove', 'clear'].indexOf(subCommand) !== -1 && !user.infractions?.length) return interaction.createFollowup(this.client.utils.errorEmbed('No warnings found for this user.'));
        switch(subCommand) {
          case 'add': {
            if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot warn yourself.'));
            const significantDifference = this.client.utils.differRoles(interaction.member, member);
            if (!significantDifference) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them having a higher position than you.'));
            
            await this.client.database.updateUser(`${args.target}:${guildId}`, {
                infractions: { push: {
                    reason: args.reason ?? 'No reason was provided',
                    infractionId: enc.randomUUID().substring(0, 10),
                    issuedBy: interaction.member.id,
                    createdAt: Date.now()
                }}
            });
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\` has been warned${args.reason ? (' for ' + args.reason) : '.'}`, color: 0xCDE9F6 }});
            break;
          }
          case 'list': {
            let description = '';
            
            user.infractions.forEach(infraction => { description += `**ID:** ${infraction.infractionId} | Issued By: <@${infraction.issuedBy}>\n\`${infraction.reason}\` - ${DateTime.fromMillis(infraction.createdAt).toFormat('DDD t')}\n\n` });
            interaction.createFollowup({ embed: { author: { name: `${member.username}#${member.discriminator} | ${user.infractions.length} warning(s)`, icon_url: member.avatarURL }, description }});
            break;
          }
          case 'remove': {
            const infraction = user.infractions.findIndex(infrac => infrac.infractionId === args.id);
            if (infraction === -1) return interaction.createFollowup(this.client.utils.errorEmbed(`\`${args.id}\` is not a valid id.`));
            
            await this.client.database.updateUser(`${args.target}:${guildId}`, { infractions: user.infractions.splice(infraction, 1) && user.infractions });
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\`'s warning has been removed.`, color: 0xCDE9F6 }});
            break;
          }
          case 'clear':
            await this.client.database.deleteUser(`${args.target}:${guildId}`);
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\`'s warnings have been cleared.`, color: 0xCDE9F6 }});
            break;
          default:
            interaction.createFollowup(this.client.utils.errorEmbed('Invalid sub-command.'));
            break;
        }
    }
}