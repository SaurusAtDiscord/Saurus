'use strict';

const EventEmitter = require('eventemitter3');

module.exports = class createMessageComponentCollector extends EventEmitter {
	constructor(client, options) {
		super();
		
		this.client = client;
		this.options = options;

		this.ended = false;
		this.collected = 0;
		this.listener = this.checkPreConditions.bind(this);
		
		client.on('interactionCreate', this.listener);
		if (options.time) setTimeout(() => this.stopListening('time'), options.time);
	}

	checkPreConditions(interaction) {
		if (this.options.filter(interaction)) {
			this.emit('collect', interaction);
			this.collected++;

			if (this.options.maxMatches && this.collected >= this.options.maxMatches) {
				this.stopListening('maxMatches');
				return true;
			}
		}

		return false;
	}

	stopListening(reason) {
		if (this.ended) return;
		this.ended = true;

		this.client.removeListener('interactionCreate', this.listener);
		this.emit('end', this.collected, reason);
	}
}