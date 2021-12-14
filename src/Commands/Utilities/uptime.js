'use strict';

const Command = require('@core/Command');
const Embed = require('@units/Embed');

const prettyMS = require('pretty-ms');

module.exports = class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            description: 'Tells the amount of time Saurus has been awake for',
            category: 'Utilities'
        });
    }

    execute(interaction) {
        return interaction.createFollowup(new Embed({ description: `\`${prettyMS(this.client.uptime, { verbose: true })}\`` }));
    }
}