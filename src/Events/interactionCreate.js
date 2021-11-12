'use strict';

const Event = require('@structures/Event');

module.exports = class interactionCreate extends Event {
    async execute(Interaction) {
        if (Interaction.constructor.name !== 'CommandInteraction') return;
        
        const command = this.client.commands.find(cmd => cmd.name === Interaction.data.name.toLowerCase());
        if (!command) return;

        await Interaction.defer(Interaction.data.name === 'help' ? 64 : undefined);
        
        const Args = {};
        Interaction.data.options?.forEach(input => Args[input.name] = input.value);
        command.execute(Interaction, Args);
    }
}