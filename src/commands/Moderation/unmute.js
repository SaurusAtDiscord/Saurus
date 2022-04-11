'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const modLogs = require('@units/ModLogs');

module.exports = class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            description: 'Unmute a specified member',

            clientPermissions: ['moderateMembers'],
            userPermissions: ['moderateMembers'],
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.USER,
                name: 'member',
                description: 'The member to unmute',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const guild = interaction.member.guild;
        const member = interaction.data.resolved?.members?.get(args.member);

        if (!member) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('Unmuting/muting a bot is not permitted.'));
        if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot unmute yourself, silly.'));
        if (!member.communicationDisabledUntil) return interaction.createFollowup(this.client.utils.errorEmbed('This member is not muted.'));

        const success = await guild.editMember(member.id, { communicationDisabledUntil: null });
        if (!success) return interaction.editOriginalMessage(this.client.utils.errorEmbed('Could not unmute member.'));

        interaction.editOriginalMessage({ embed: { description: `Unmuted \`${member.username}#${member.discriminator}\``, color: 0x77DD77 }});
        return (new modLogs(this.client, { interaction, guilty: member })).postModLog(`${interaction.member.mention} has unmuted ${member.mention}`, {
            name: 'Information',
            value: `• Moderator: \`${interaction.member.username}#${interaction.member.discriminator}\`\n• Action Against: \`${member.username}#${member.discriminator}\``
        });
    }
}