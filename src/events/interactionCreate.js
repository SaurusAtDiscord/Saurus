'use strict';

const Event = require('@core/Event');
const { Constants } = require('eris');

module.exports = class interactionCreate extends Event {

    /* Calling the method "execute" on Event class. */
    async execute(interaction) {
        await interaction.acknowledge(interaction.data?.name === 'help' && Constants.MessageFlags.EPHEMERAL);

        if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND) {
            const command = this.client.commands.find(cmd => cmd.name === interaction.data.name?.toLowerCase());
            if (!command) return;

            if (command.clientPermissions || command.userPermissions) {
                const clientChannelPermissions = interaction.channel.permissionsOf(this.client.user.id);
                const userChannelPermissions = interaction.channel.permissionsOf(interaction.member.id);

                const clientPermissions = command.clientPermissions?.filter(p => !clientChannelPermissions?.has(p));
                const userPermissions = command.userPermissions?.filter(p => !userChannelPermissions?.has(p));
                const missing = (userPermissions ?? clientPermissions);
                if (missing?.length) {
                    return interaction.createFollowup({ 
                        embed: {
                            author: { name: `${this.client.stringUtils.upperFirst(command.name)}  ―  Lacking Permissions`, icon_url: interaction.member.avatarURL, },
                            description: `${clientPermissions?.length ? 'I' : 'You'} do not have the required permissions to preform this command.\n\`${missing.join(', ')}\``
                        }
                    });
                }
            }

            const args = {};
            interaction.data.options?.forEach(input => { args[input.name] = input.value });
            command.execute(interaction, args);
        }
    }
}