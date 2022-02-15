'use strict';

const Command = require('@core/Command');
const prettyMS = require('pretty-ms');

module.exports = class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            description: 'Tells the amount of time Saurus has been awake for'
        });
    }

    /* Calling the method "execute" on Command class. */
    execute(interaction) {
        return interaction.createFollowup({ embed: { description: `\`${prettyMS(this.client.uptime, { verbose: true })}\`` }});
    }
}