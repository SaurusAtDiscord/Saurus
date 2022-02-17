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
        
        if (!member) return interaction.createFollowup({ embed: { description: 'Could not find provided user.' }});
        if (member.bot) return interaction.createFollowup({ embed: { description: 'Unmuting/muting a bot is not permitted.' }});
        if (member.id === interaction.member.id) return interaction.createFollowup({ embed: { description: 'You cannot unmute yourself.' }});
        if (!member.communicationDisabledUntil) return interaction.createFollowup({ embed: { description: 'This user is not muted.' }});

        const success = await guild.editMember(member.id, { communicationDisabledUntil: null });
        if (!success) return interaction.editOriginalMessage({ embed: { description: 'Could not unmute user.' }, components: [] });

        return interaction.editOriginalMessage({ 
            embed: { 
                description: `Successfully unmuted \`${member.username}#${member.discriminator}\`` 
            },
            components: []
        });
    }
}