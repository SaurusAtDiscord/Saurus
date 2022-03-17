'use strict';

const Command = require('@core/Command');
const modLogs = require('@units/ModLogs');
const { Constants } = require('eris');

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
        const guild = await this.client.utils.getGuild(interaction.guildID);
        const member = await this.client.utils.getMember(interaction.guildID, args.member).catch(() => null);
        const bot = await this.client.utils.getMember(interaction.guildID, this.client.user.id).catch(() => null);

        if (!member) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('Unmuting/muting a bot is not permitted.'));
        if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot unmute yourself.'));
        
        const botDifference = this.client.utils.differRoles(member, bot);
        const significantDifference =  this.client.utils.differRoles(interaction.member, member);
        
        if (!botDifference) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than me.'));
        if (!significantDifference) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than you.'));
        
        if (!member.communicationDisabledUntil) return interaction.createFollowup(this.client.utils.errorEmbed('This member is not muted.'));

        const logs = new modLogs(this.client, { interaction, guilty: member });
        const success = await guild.editMember(member.id, { communicationDisabledUntil: null });
        if (!success) return interaction.editOriginalMessage(this.client.utils.errorEmbed('Could not unmute member.'));

        if (await logs.modLogsEnabled()) logs.postModLog(`**${interaction.member.username}#${interaction.member.discriminator}** has unmuted **${member.username}#${member.discriminator}**`);
        return interaction.editOriginalMessage({ 
            embed: { 
                description: `Unmuted \`${member.username}#${member.discriminator}\`` ,
                color: 0xCDE9F6
            }
        });
    }
}