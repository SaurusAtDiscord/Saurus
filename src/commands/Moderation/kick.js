'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const modLogs = require('@units/ModLogs');

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: 'Kick an member',

            clientPermissions: ['kickMembers'],
            userPermissions: ['kickMembers'],
            
            options: [
                {
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'The member to kick',
                    required: true
                },
                {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'reason',
                    description: 'The reason for the kick'
                }
            ]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const member = interaction.data.resolved?.members?.get(args.member);
        const bot = interaction.data.resolved?.members?.get(this.client.user.id);
        
        if (!member) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('I refuse to kick another bot.'));
        if (interaction.member.id === member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot kick yourself, silly.'));

        const isSuperior =  (this.client.utils.superior(bot, member) && this.client.utils.superior(interaction.member, member));
        if (!isSuperior) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than you or I.'));

        const reason = args.reason ? `for \`${args.reason}\`` : '';
        const sigh = args.reason ? `\n• Reason: ${args.reason}` : '';

        try {
            await member.kick(args.reason);
        } catch {
            return interaction.createFollowup(this.client.utils.errorEmbed('Failed to kick member.'));
        }

        interaction.createFollowup({ embed: { description: `${member.mention} has been kicked ${reason}`, color: 0x77DD77 }});
        return (new modLogs(this.client, interaction)).postModLog(`${interaction.member.mention} kicked ${member.mention} ${reason}`, {
            name: 'Information',
            value: `• Moderator: \`${interaction.member.username}#${interaction.member.discriminator}\`\n• Action Against: \`${member.username}#${member.discriminator}\`${sigh}`
        });
    }
}