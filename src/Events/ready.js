'use strict';

const Event = require('@core/Event');
const { isEqual } = require('lodash');

module.exports = class ready extends Event {
	
	/* Calling the method "execute" on Event class. */
	async execute() {
		const clientCommands = await (process.env.NODE_ENV === 'development' ? this.client.getGuildCommands(process.env.DEVELOPMENT) : this.client.getCommands());

		const newCommands = this.client.commands.filter(command => !clientCommands.some(cmd => cmd.name === command.name));
		const deletedCommands = clientCommands.filter(command => !this.client.commands.find(cmd => cmd.name === command.name));
		const changedCommands = clientCommands.filter(command => !this.client.commands.some(cmd => isEqual(command.options, cmd.options)));

		if (changedCommands.length) changedCommands.forEach(command => this.client.utils.editCommand(this.client.commands.find(cmd => cmd.name === command.name), command.id));
		if (deletedCommands.length) deletedCommands.forEach(cmd => this.client.utils.deleteCommand(cmd.id));
		if (newCommands.length) this.client.utils.createCommand(this.client.commands);
	}
}