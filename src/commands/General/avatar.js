'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            description: 'Get a members avatar',
            
            options: [{
                name: 'member',
                description: 'Fetch this members avatar',
                type: Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const member = interaction.data.resolved?.members?.get(args.member) ?? interaction.member;

        return interaction.createFollowup({ embed: {
            title: `${member.username}#${member.discriminator}'s Avatar`,
            image: { url: member.avatarURL } 
        }});
    }
}