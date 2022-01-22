'use strict';

const Event = require('@core/Event');
const { Constants } = require('eris');

module.exports = class interactionCreate extends Event {

    /* Calling the method "execute" on Event class. */
    async execute(interaction) {
        if (interaction.constructor.name === 'CommandInteraction') {
            const command = this.client.commands.find(cmd => cmd.name === interaction.data.name?.toLowerCase());
            if (!command) return;

            await interaction.acknowledge(command.name === 'help' && Constants.MessageFlags.EPHEMERAL);
            // if (comma) {
            //     const perms = interaction.channel.permissionsOf(this.client.user.id);
            //     const missingPerms = command.permissions.filter(perm => !perms.has(perm));
            //     const missingUserPerms = command.userPermissions.filter(perm => !perms.has(perm));

            //     if (missingUserPerms.length) return interaction.createFollowup({ embed: { description: missingUserPerms }});
            // }

            const args = {};
            interaction.data.options?.forEach(input => args[input.name] = input.value);
            command.execute(interaction, args);
        }
    }
}