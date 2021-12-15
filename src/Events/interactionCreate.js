'use strict';

const Event = require('@core/Event');
//const Embed = require('@units/Embed');

const { Constants } = require('eris');

module.exports = class interactionCreate extends Event {
    async execute(interaction) {
        if (interaction.constructor.name !== 'CommandInteraction') return;
        const command = this.client.commands.find(cmd => cmd.name === interaction.data.name?.toLowerCase());
        if (!command) return;

        await interaction.acknowledge(command.name === 'help' && Constants.MessageFlags.EPHEMERAL);
        // if (command.userPermissions) {
        //     const perms = interaction.channel.permissionsOf(this.client.user.id);
        //     const missingUserPerms = command.userPermissions.filter(perm => !perms.has(perm));
        //     return interaction.createFollowup(new Embed({ description: missingUserPerms }).load());
        // }

        const args = {};
        interaction.data.options?.forEach(input => args[input.name] = input.value);
        command.execute(interaction, args);
    }
}