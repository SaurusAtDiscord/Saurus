'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const modLogs = require('@units/ModLogs');

module.exports = class Purge extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            description: 'Delete an amount of messages',

            clientPermissions: ['manageMessages'],
            userPermissions: ['manageMessages'],
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                name: 'amount',
                description: 'The amount of messages to delete, minimizing at 1, maximum 100',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const amount = Math.max(1, Math.min(args.amount, 100));
        const channel = interaction.channel;
        (await channel.getMessages({ limit: amount + 1 }))?.forEach(message => channel.deleteMessage(message?.id));
        
        return (new modLogs(this.client, { interaction })).postModLog(`${interaction.member.mention} purged ${amount} messages`, {
            name: 'Information',
            value: `• Moderator: \`${interaction.member.username}#${interaction.member.discriminator}\`\n• Channel: ${channel.mention}`
        });
    }
}