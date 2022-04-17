'use strict';

const Event = require('@core/Event');
const { Constants } = require('eris');

module.exports = class interactionCreate extends Event {

    /* Calling the method "execute" on Event class. */
    async execute(interaction) {
        if (interaction.type !== Constants.InteractionTypes.MODAL_SUBMIT)
        await interaction.acknowledge((interaction.data.name === 'help' || interaction.data.options?.[0]?.name === 'list') && Constants.MessageFlags.EPHEMERAL);

        if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND) {
            const command = this.client.commands.find(cmd => cmd.name === interaction.data.name.toLowerCase());
            if (command.clientPermissions || command.userPermissions || command.subCommandUserPermissions) {
                const clientChannelPermissions = interaction.channel.permissionsOf(this.client.user.id);
                const userChannelPermissions = interaction.channel.permissionsOf(interaction.member.id);

                const clientPermissions = command.clientPermissions.filter(p => !clientChannelPermissions?.has(p));
                const userPermissions = command.userPermissions.filter(p => !userChannelPermissions?.has(p));

                const subCommand = interaction.data.options?.[0]?.name;
                const subCommandUserPermissions = command.subCommandUserPermissions[subCommand]?.filter(p => !userChannelPermissions?.has(p));

                const missing = (subCommandUserPermissions ?? userPermissions ?? clientPermissions);
                if (missing?.length) return interaction.createFollowup(this.client.utils.errorEmbed(`${clientPermissions?.length ? 'I' : 'You'} do not have the required permissions to preform this command.\n\`${missing.join(', ')}\``));
            }

            const data = {}
            interaction.data.options?.forEach(input => {
                switch (input.type) {
                  case Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP: {
                    const args = {}
                    input.options?.forEach(subGroup => subGroup.options?.forEach(subInput => { args[subInput.name] = subInput.value }));
                    Object.assign(data, { subGroup: input.name, subCommand: input.options?.[0]?.name, args });
                    break;
                  }
                  case Constants.ApplicationCommandOptionTypes.SUB_COMMAND: {
                    const args = {}
                    input.options?.forEach(subInput => { args[subInput.name] = subInput.value});
                    Object.assign(data, { subCommand: input.name, args });
                    break;
                  }
                  default:
                    data[input.name] = input.value;
                    break;
                }
            });
            
            command.execute(interaction, data);
        }
    }
}