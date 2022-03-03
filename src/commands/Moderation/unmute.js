'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            description: 'Unmute a specified user',

            clientPermissions: ['moderateMembers'],
            userPermissions: ['moderateMembers'],
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.USER,
                name: 'target',
                description: 'The user to unmute',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const guild = await this.client.utils.getGuild(interaction.guildID);
        const member = await this.client.utils.getMember(interaction.guildID, args.target).catch(() => null);
        
        if (!member) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided user.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('Unmuting/muting a bot is not permitted.'));
        if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot unmute yourself.'));
        if (!member.communicationDisabledUntil) return interaction.createFollowup(this.client.utils.errorEmbed('This user is not muted.'));

        const success = await guild.editMember(member.id, { communicationDisabledUntil: null });
        if (!success) return interaction.editOriginalMessage(this.client.utils.errorEmbed('Could not unmute user.'));

        return interaction.editOriginalMessage({ 
            embed: { 
                description: `Successfully unmuted \`${member.username}#${member.discriminator}\`` ,
                color: 0xCDE9F6
            },
        });
    }
}