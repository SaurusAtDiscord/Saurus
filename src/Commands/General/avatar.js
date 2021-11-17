'use strict';

const Command = require('@structures/Command');
const Embed = require('@components/Embed');

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
        const user = (await interaction.getUser(args.target)) ?? (interaction.member || interaction.user);

        return interaction.createFollowup(new Embed({
            title: `${user.username}#${user.discriminator}'s Avatar`,
            image: { url: user.avatarURL } 
        }).parse());
    }
}