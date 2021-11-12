const Event = require('@structures/Event');

module.exports = class ready extends Event {
	async execute() {
		const clientCommands = await (process.env.NODE_ENV === 'development' ? this.client.getGuildCommands('887396392497184778') : this.client.getCommands());
		
		const deletedCommands = clientCommands.filter(command => !this.client.commands.find(cmd => cmd.name === command.name));
		if (deletedCommands.length) deletedCommands.forEach(cmd => this.client.extensions.library.deleteCommand(cmd.id));

		this.client.extensions.library.createCommand(this.client.commands);
	}
}