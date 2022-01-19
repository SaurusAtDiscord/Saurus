'use strict';

const EventEmitter = require('eventemitter3');

module.exports = class createMessageComponentCollector extends EventEmitter {
	/**
	 * @param { Eris.Client } client The client that is listening for interactions.
	 * @param { Object } options Options for the collector.
	 */
	constructor(client, options) {
		super();
		
		this.client = client;
		this.options = options;

		this.ended = false;
		this.collected = 0;
		this.listener = this.#checkPreConditions.bind(this);
		
		client.on('interactionCreate', this.listener);
		if (options.time) setTimeout(() => this.stopListening('time'), options.time);
	}

	/**
	 * If the interaction matches the filter, emit the interaction and increment the collected count. If
	the collected count is greater than or equal to the maxMatches option, stop listening for new
	interactions.
	 * @param interaction The interaction object that was just emitted.
	 * @returns { Boolean } Condition requirements are met.
	 */
	#checkPreConditions(interaction) {
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

	/**
	 * Stops listening to the client for new interactions.
	 * @param reason The reason the collector ended.
	 */
	stopListening(reason) {
		if (this.ended) return;
		this.ended = true;

		this.client.removeListener('interactionCreate', this.listener);
		this.emit('end', this.collected, reason);
	}
}