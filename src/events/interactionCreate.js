/* eslint-disable sonarjs/cognitive-complexity */
'use strict';

const Event = require('@core/Event');
const { Constants } = require('eris');

module.exports = class interactionCreate extends Event {

    /* Calling the method "execute" on Event class. */
    async execute(interaction) {
        await interaction.acknowledge(interaction.data.name === 'help' && Constants.MessageFlags.EPHEMERAL);

        if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND) {
            const command = this.client.commands.find(cmd => cmd.name === interaction.data.name.toLowerCase());
            
            if (command.clientPermissions || command.userPermissions || command.subCommandUserPermissions) {
                const clientChannelPermissions = interaction.channel.permissionsOf(this.client.user.id);
                const userChannelPermissions = interaction.channel.permissionsOf(interaction.member.id);

                const clientPermissions = command.clientPermissions?.filter(p => !clientChannelPermissions?.has(p));
                const userPermissions = command.userPermissions?.filter(p => !userChannelPermissions?.has(p));

                const subCommand = interaction.data.options[0]?.name;
                const subCommandUserPermissions = command.subCommandUserPermissions[subCommand]?.filter(p => !userChannelPermissions?.has(p));

                const missing = (subCommandUserPermissions ?? userPermissions ?? clientPermissions);
                if (missing?.length) return interaction.createFollowup({ embed: {
                    author: { name: `${this.client.stringUtils.upperFirst(command.name)}  ―  Lacking Permissions`, icon_url: interaction.member.avatarURL, },
                    description: `${clientPermissions?.length ? 'I' : 'You'} do not have the required permissions to preform this command.\n\`${missing.join(', ')}\``
                }});
            }

            const data = {};
            interaction.data.options?.forEach(async input => {
                switch (input.type) {
                  case Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP: // FIXME: Sub command group is not a value.
                    input.options.forEach(subGroup => subGroup.options?.forEach(subInput => { data[subInput.name] = subInput.value }));
                    break;
                  case Constants.ApplicationCommandOptionTypes.SUB_COMMAND:
                    input.options.forEach(subInput => Object.assign(data, { subCommand: input.name, args: subInput.value }));
                    break;
                  default:
                    data[input.name] = input.value;
                    break;
                }
            });
            
            command.execute(interaction, data);
        }
    }
}