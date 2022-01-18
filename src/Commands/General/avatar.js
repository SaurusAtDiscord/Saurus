'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            description: 'Get a users avatar',
            
            options: [{
                'name': 'user',
                'description': 'Fetch this users avatar',
                'type': Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }   

    async execute(interaction, args) {
        const user = (args.user && await this.client.utils.getMember(interaction.guildID, args.user)) ?? interaction.member;

        return interaction.createFollowup({ embed: {
            title: `${user.username}#${user.discriminator}'s Avatar`,
            image: { url: user.avatarURL } 
        }});
    }
}