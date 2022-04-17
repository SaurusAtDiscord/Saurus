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
    async execute(interaction) {
        return interaction.createFollowup({ embed: { description: `I'm in \`${(await this.client.getRESTGuilds()).length}\` guild(s) :partying_face:` }});
    }
}