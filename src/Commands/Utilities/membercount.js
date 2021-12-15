'use strict';

const Command = require('@core/Command');
const Embed = require('@units/Embed');

module.exports = class Membercount extends Command {
    constructor(client) {
        super(client, {
            name: 'membercount',
            description: 'Statistics of the amount of members & bots',
            category: 'Utilities'
        });
    }

    async execute(interaction) {
        const guild = await interaction.getGuild();
        return interaction.createFollowup(new Embed({ fields: [
            { name: 'Members', value: await guild.fetchAllMembers(), inline: true },
            { name: 'Bots', value: guild.members.filter(m => m.bot).length, inline: true }
        ]}).load());
    }
}