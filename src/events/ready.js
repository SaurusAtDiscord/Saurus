'use strict';

const Event = require('@core/Event');
const { Constants } = require('eris');
const isEqual = require('lodash.isequal');

module.exports = class ready extends Event {
	
	/* Calling the method "execute" on Event class. */
	async execute() {
		const clientCommands = await (process.env.NODE_ENV === 'development' ? this.client.getGuildCommands(process.env.DEVELOPMENT) : this.client.getCommands());

		const newCommands = this.client.commands.filter(command => !clientCommands.some(cmd => cmd.name === command.name));
		const deletedCommands = clientCommands.filter(command => !this.client.commands.find(cmd => cmd.name === command.name));
		const changedCommands = clientCommands.filter(command => !this.client.commands.some(cmd => isEqual(command.options, cmd.options)));
		
		if (deletedCommands.length || newCommands.length) this.client.utils.createCommand(this.client.commands);
		if (changedCommands.length) changedCommands.forEach(command => this.client.utils.editCommand(this.client.commands.find(cmd => cmd.name === command.name), command.id));
		
		console.log(`[${this.client.user.username}] Online~!`);
		setInterval(() => {
            const statuses = [ `over ${this.client.guilds.size ?? 'NaN'} guilds`, 'zzz' ]
            this.client.editStatus('idle', {
                name: `${statuses[Math.floor(Math.random() * statuses.length)]}`,
                type: Constants.ActivityTypes.WATCHING
            });
        }, 30000);
	}
}