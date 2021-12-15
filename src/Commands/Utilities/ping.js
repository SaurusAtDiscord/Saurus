'use strict';

const Command = require('@core/Command');
const Embed = require('@units/Embed');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Informs you of my ping',
            category: 'Utilities'
        });
    }

    execute(interaction) {
        return interaction.createFollowup(new Embed({ description: `Pong! \`${interaction.member ? interaction.member.guild.shard.latency : 'NaN'} ms\`` }).load());
    }
}