'use strict';

const Command = require('@core/Command');

module.exports = class Guilds extends Command {
    constructor(client) {
        super(client, {
            name: 'guilds',
            description: 'Tells the amount of servers Saurus is in'
        });
    }

    /* Calling the method "execute" on Command class. */
    execute(interaction) {
        interaction.createFollowup({ embed: { description: `I'm in \`${this.client.guilds.size ?? 'NaN'}\` guild(s) :partying_face:` }});
    }
}