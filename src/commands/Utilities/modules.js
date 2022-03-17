'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Modules extends Command {
    constructor(client) {
        super(client, {
            name: 'modules',
            description: 'Configure server modules such as mod logs, etc.',

            options: [
                {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'module',
                    description: 'The module to configure',
                    choices: [{ name: 'modLogs', value: 'modLogs' }],
                    required: true
                },
                {
                    type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                    name: 'enabled',
                    description: 'Whether to enable or disable the module',
                    required: true
                }
            ]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const guild = await this.client.database.getGuild(interaction.guildID);
        const guildModule = guild.modules[args.module];
        if (guildModule === args.enabled) return interaction.createFollowup(this.client.utils.errorEmbed(`\`${args.module}\` is already ${args.enabled ? 'enabled' : 'disabled'}.`));
        
        await this.client.database.updateGuild(interaction.guildID, { modules: { [args.module]: args.enabled }});
        return interaction.createFollowup({ embed: {
            description: `\`${args.module}\` has been ${args.enabled ? 'enabled' : 'disabled'}.`,
            color: 0xCDE9F6
        }});
    }
}