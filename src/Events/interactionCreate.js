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
            
            // const channelPermissions = interaction.channel?.permissionsOf(this.client.user.id);
            // const clientPermissions = command.clientPermissions?.filter(p => !channelPermissions.has(p));
            // const userPermissions = command.userPermissions?.filter(p => !channelPermissions.has(p));
            
            // const dodo = clientPermissions || userPermissions;
            // console.log(dodo);
            // if (dodo.length > 0) return interaction.createFollowup({ embed: { description: `MISSING PERMISSIONS\n\`${dodo.join(' ,')}\`` }});

            const args = {};
            interaction.data.options?.forEach(input => args[input.name] = input.value);
            command.execute(interaction, args);
        }
    }
}