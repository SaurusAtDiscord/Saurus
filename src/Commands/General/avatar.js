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

    async execute(Interaction, Args) {
        const user = (Args.target && await this.client.getRESTUser(Args.target)) ?? (Interaction.member || Interaction.user);
        
        return Interaction.createFollowup(new Embed({
            title: `${user.username}#${user.discriminator}'s Avatar`,
            image: { url: user.avatarURL } 
        }).parse());
    }
}