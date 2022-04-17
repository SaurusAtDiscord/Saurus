'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const modLogs = require('@units/ModLogs');
const { DateTime } = require('luxon');
const { randomUUID } = require('crypto');

module.exports = class Warn extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            description: 'Warn a specified member',

            clientPermissions: ['moderateMembers'],
            subCommandUserPermissions: { add: ['moderateMembers'], remove: ['moderateMembers'], clear: ['moderateMembers'] },
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'add',
                description: 'Add warning to a member',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'The member to warn',
                    required: true
                }, {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'reason',
                    description: 'The reason for the following warning'
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'list',
                description: 'List all warnings for a member',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'The member to list warnings',
                    required: true
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'remove',
                description: 'Remove a warning from a member',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'The member to remove a member from',
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
                description: 'Clear warnings from a member',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'The member to clear warnings from',
                    required: true
                }]
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, { subCommand, args }) {
        const guildId = interaction.guildID;

        const member = interaction.data.resolved?.members?.get(args.member);
        const bot = interaction.data.resolved?.members?.get(this.client.user.id);

        const uuid = this.client.database.toUUID(args.member, guildId);
        const user = member && await this.client.database.getUser(uuid);
        
        if (!user) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('I refuse to warn another bot.'));

        const stringedReason = args.reason ? ` for \`${args.reason}\`` : '';
        const isSuperior = (this.client.utils.superior(bot, member) && this.client.utils.superior(interaction.member, member));
        
        if (subCommand !== 'list' && !isSuperior) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than you or I.'));
        if (['list', 'remove', 'clear'].indexOf(subCommand) !== -1 && !user.infractions?.length) return interaction.createFollowup(this.client.utils.errorEmbed('No warnings found for this member.'));

        let modLogInfo;
        switch(subCommand) {
          case 'add': {
            if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot warn yourself, silly.'));
            await this.client.database.updateUser(uuid, {
                infractions: { push: {
                    reason: args.reason ?? 'No reason was provided',
                    infractionId: randomUUID().substring(0, 10),
                    issuedBy: member.id,
                    createdAt: Date.now()
                }}
            });

            modLogInfo = `${member.mention} was warned by ${interaction.member.mention}${stringedReason}`;
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\` has been warned${stringedReason}`, color: 0x77DD77 }});
            break;
          }
          case 'list': {
            let description = '';
            
            user.infractions.forEach(infraction => { description += `**ID:** ${infraction.infractionId} | Issued By: <@${infraction.issuedBy}>\n\`${infraction.reason}\` - ${DateTime.fromMillis(infraction.createdAt).toFormat('DDD t')}\n\n` });
            interaction.createFollowup({ embed: { author: { name: `${member.username}#${member.discriminator} | ${user.infractions.length} warning(s) | ${user.uuid}`, icon_url: member.avatarURL }, description }});
            break;
          }
          case 'remove': {
            const infraction = user.infractions.findIndex(infrac => infrac.infractionId === args.id);
            if (infraction === -1) return interaction.createFollowup(this.client.utils.errorEmbed(`\`${args.id}\` is not a valid id.`));
            
            await this.client.database.updateUser(uuid, { infractions: (user.infractions.splice(infraction, 1) && user.infractions) });
            modLogInfo = `${interaction.member.mention} removed warning \`${args.id}\` from ${member.mention}`;

            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\`'s warning has been removed.`, color: 0x77DD77 }});
            break;
          }
          case 'clear':
            await this.client.database.deleteUser(uuid);

            modLogInfo = `${interaction.member.mention} has cleared warnings from ${member.mention}`;
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\`'s warnings have been cleared.`, color: 0x77DD77 }});
            break;
          default:
            interaction.createFollowup(this.client.utils.errorEmbed('Invalid sub-command.'));
            break;
        }

        if (modLogInfo) return (new modLogs(this.client, interaction)).postModLog(modLogInfo, {
            name: 'Information',
            value: `• Moderator: \`${interaction.member.username}#${interaction.member.discriminator}\`\n• Action Against: \`${member.username}#${member.discriminator}\``
        });
    }
}