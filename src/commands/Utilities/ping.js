'use strict';

const Command = require('@core/Command');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Informs you of my ping'
        });
    }

    /* Calling the method "execute" on Command class. */
    execute(interaction) {
        return interaction.createFollowup({ embed: { description: `Pong! \`${interaction.member?.guild?.shard?.latency ?? 'NaN'} ms\`` }});
    }
}