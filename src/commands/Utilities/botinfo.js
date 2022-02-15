'use strict';

const Command = require('@core/Command');

module.exports = class Botinfo extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            description: 'Tells the bot\'s info'
        });
    }

    /* Calling the method "execute" on Command class. */
    execute(interaction) {
        return interaction.createFollowup({ embed: { description: `I'm a bot made by <@${process.env.MASTER}>` }});
    }
}