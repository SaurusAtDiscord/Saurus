'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Modules extends Command {
    constructor(client) {
        super(client, {
            name: 'modules',
            description: 'Configure server modules',

            clientPermissions: ['manageChannels', 'manageWebhooks'],
            userPermissions: ['manageGuild'],

            options: [
                {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'module',
                    description: 'The target module',
                    choices: [{ name: 'ModLogs', value: 'modLogs' }],
                    required: true
                },
                {
                    type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                    name: 'toggle',
                    description: 'Whether to enable or disable the module',
                    required: true
                }
            ]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const guild = await this.client.database.getGuild(interaction.guildID);
        if (!guild) return interaction.createFollowup(this.client.utils.errorEmbed('Failed to retrieve guild settings.'));

        const guildModule = guild.modules?.[args.module];
        if (guildModule === args.toggle) return interaction.createFollowup(this.client.utils.errorEmbed(`\`${args.module}\` is already ${args.toggle ? 'enabled' : 'disabled'}.`));
        
        await this.client.database.updateGuild(interaction.guildID, { modules: { [args.module]: args.toggle }});
        return interaction.createFollowup({ embed: {
            description: `\`${args.module}\` has been ${args.toggle ? 'enabled' : 'disabled'}.`,
            color: 0x77DD77
        }});
    }
}