'use strict';

const Command = require('@core/Command');
//const Embed = require('@units/Embed');
const { Constants } = require('eris');

module.exports = class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: 'Kicks the provided user out of the server',
            category: 'Moderation',
            //userPermissions: 'kickMembers',

            options: [
                {
                    'name': 'target',
                    'description': 'The provided user',
                    'type': Constants.ApplicationCommandOptionTypes.USER,
                    'required': true
                },
                {
                    'name': 'reason',
                    'description': 'Reason for kicking',
                    'type': Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        });
    }

    async execute(interaction, args) {
        const user = (await interaction.getMember(interaction.guildID, args.target));
        console.log(user);
    }
}