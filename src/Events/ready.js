'use strict';

const Event = require('@core/Event');

module.exports = class ready extends Event {
	async execute() {
		const clientCommands = await (process.env.NODE_ENV === 'development' ? this.client.getGuildCommands('671691366102990848') : this.client.getCommands());

		//const newCommands = this.client.commands.filter(command => !clientCommands.some(cmd => cmd.name === command.name));
		const deletedCommands = clientCommands.filter(command => !this.client.commands.find(cmd => cmd.name === command.name));
		if (deletedCommands.length) deletedCommands.forEach(cmd => this.client.utils.deleteCommand(cmd.id));

		//console.log(newCommands);
		this.client.utils.createCommand(this.client.commands);
	}
}