'use strict';

const Command = require('@core/Command');
const Embed = require('@units/Embed');

const { Constants } = require('eris');

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            description: 'Get a users avatar',
            usage: 'avatar (user)',
            category: 'General',
            
            options: [{
                'name': 'target',
                'description': 'Fetch this users avatar',
                'type': Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }   

    async execute(interaction, args) {
        const user = (args.target && await interaction.getMember(interaction.guildID, args.target)) ?? interaction.member;

        return interaction.createFollowup(new Embed({
            title: `${user.username}#${user.discriminator}'s Avatar`,
            image: { url: user.avatarURL } 
        }).load());
    }
}