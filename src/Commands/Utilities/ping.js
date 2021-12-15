'use strict';

const Command = require('@core/Command');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Informs you of my ping',
            category: 'Utilities'
        });
    }

    execute(interaction) {
        return interaction.createFollowup({ embed: { description: `Pong! \`${interaction.member ? interaction.member.guild.shard.latency : 'NaN'} ms\`` }});
    }
}