'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            description: 'Get a members avatar',
            
            options: [{
                'name': 'member',
                'description': 'Fetch this members avatar',
                'type': Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const user = (args.member && await this.client.utils.getMember(interaction.guildID, args.member).catch(() => null)) ?? interaction.member;

        return interaction.createFollowup({ embed: {
            title: `${user.username}#${user.discriminator}'s Avatar`,
            image: { url: user.avatarURL } 
        }});
    }
}