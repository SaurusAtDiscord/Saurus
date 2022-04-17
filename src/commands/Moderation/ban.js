'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const modLogs = require('@units/ModLogs');

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Ban an member',

            clientPermissions: ['banMembers'],
            userPermissions: ['banMembers'],
            
            options: [
                {
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'The member to ban',
                    required: true
                },
                {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'reason',
                    description: 'The reason for the ban'
                },
                {
                    type: Constants.ApplicationCommandOptionTypes.NUMBER,
                    name: 'delete_messages',
                    description: 'The number of days messages will be deleted for, max 7 days, 0 for none'
                }
            ]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const resolved = interaction.data.resolved.members;
        const member = resolved.get(args.member);
        const bot = resolved.get(this.client.user.id);
        
        if (!member) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('I refuse to ban another bot.'));
        if (interaction.member.id === member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot ban yourself, silly.'));

        const isSuperior = (this.client.utils.superior(bot, member) && this.client.utils.superior(interaction.member, member));
        if (!isSuperior) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than you or I.'));

        const reason = args.reason ? `for \`${args.reason}\`` : '';
        const sigh = args.reason ? `\n• Reason: ${args.reason}` : '';

        try {
            await member.ban(Math.max(0, Math.min(args.delete_messages ?? 0, 7)), args.reason);
        } catch {
            return interaction.createFollowup(this.client.utils.errorEmbed('Failed to ban member.'));
        }
        
        interaction.createFollowup({ embed: { description: `${member.mention} has been banned ${reason}`, color: 0x77DD77 }});
        return (new modLogs(this.client, interaction)).postModLog(`${interaction.member.mention} banned ${member.mention} ${reason}`, {
            name: 'Information',
            value: `• Moderator: \`${interaction.member.username}#${interaction.member.discriminator}\`\n• Action Against: \`${member.username}#${member.discriminator}\`${sigh}`
        });
    }
}