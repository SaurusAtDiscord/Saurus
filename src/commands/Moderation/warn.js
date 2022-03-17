'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

const ModLogs = require('@units/ModLogs');
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
    async execute(interaction, data) {
        const { subCommand, args } = data;
        const guildId = interaction.guildID;

        const member = await this.client.utils.getMember(guildId, args.member).catch(() => null);
        const user = member && await this.client.database.getUser(`${args.member}:${guildId}`);
        const bot = await this.client.utils.getMember(interaction.guildID, this.client.user.id).catch(() => null);
        
        if (!user) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('Bots do not have warning data.'));

        const stringedReason = args.reason ? ` for \`${args.reason}\`` : '';
        const logs = new ModLogs(this.client, { interaction, guilty: member });
        const modLogInfo = {}
        
        const botDifference = this.client.utils.differRoles(member, bot);
        const significantDifference =  this.client.utils.differRoles(interaction.member, member);
        
        if (!botDifference) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than me.'));
        if (!significantDifference) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than you.'));
        
        if (['list', 'remove', 'clear'].indexOf(subCommand) !== -1 && !user.infractions?.length) return interaction.createFollowup(this.client.utils.errorEmbed('No warnings found for this member.'));
        switch(subCommand) {
          case 'add': {
            if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot warn yourself.'));
            await this.client.database.updateUser(`${args.member}:${guildId}`, {
                infractions: { push: {
                    reason: args.reason ?? 'No reason was provided',
                    infractionId: randomUUID().substring(0, 10),
                    issuedBy: interaction.member.id,
                    createdAt: Date.now()
                }}
            });

            modLogInfo.log = `${member.mention} was warned by ${interaction.member.mention}${stringedReason}`;
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\` has been warned${stringedReason}`, color: 0xCDE9F6 }});
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
            
            await this.client.database.updateUser(`${args.member}:${guildId}`, { infractions: (user.infractions.splice(infraction, 1) && user.infractions) });
            modLogInfo.log = `${interaction.member.mention} removed warning \`${args.id}\` from ${member.mention}`;

            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\`'s warning has been removed.`, color: 0xCDE9F6 }});
            break;
          }
          case 'clear':
            await this.client.database.deleteUser(`${args.member}:${guildId}`);

            modLogInfo.log = `${interaction.member.mention} has cleared warnings from ${member.mention}`;
            interaction.createFollowup({ embed: { description: `\`${member.username}#${member.discriminator}\`'s warnings have been cleared.`, color: 0xCDE9F6 }});
            break;
          default:
            interaction.createFollowup(this.client.utils.errorEmbed('Invalid sub-command.'));
            break;
        }

        if (modLogInfo.log && await logs.modLogsEnabled()) logs.postModLog(modLogInfo.log);
    }
}