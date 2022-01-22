'use strict';

const Command = require('@core/Command');

module.exports = class Membercount extends Command {
    constructor(client) {
        super(client, {
            name: 'membercount',
            description: 'Statistics of the amount of members & bots'
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction) {
        const guild = await this.client.utils.getGuild(interaction.guildID);
        const members = await guild.fetchMembers();

        return interaction.createFollowup({ embed: { fields: [
            { name: 'Members', value: members.filter(m => !m.bot).length, inline: true },
            { name: 'Bots', value: members.filter(m => m.bot).length, inline: true }
        ]}});
    }
}