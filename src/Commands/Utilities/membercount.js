'use strict';

const Command = require('@core/Command');

module.exports = class Membercount extends Command {
    constructor(client) {
        super(client, {
            name: 'membercount',
            description: 'Statistics of the amount of members & bots'
        });
    }

    async execute(interaction) {
        const guild = await interaction.getGuild();
        return interaction.createFollowup({ embed: { fields: [
            { name: 'Members', value: await guild.fetchAllMembers(), inline: true },
            { name: 'Bots', value: guild.members.filter(m => m.bot).length, inline: true }
        ]}});
    }
}