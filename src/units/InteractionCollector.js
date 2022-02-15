'use strict';

const eventEmitter = require('eventemitter3');
const { Constants } = require('eris');

module.exports = class createMessageComponentCollector extends eventEmitter {
	/**
	 * @param { Eris.Client } client The client that is listening for interactions.
	 * @param { Object } options Options for the collector.
	 */
	constructor(client, options) {
		super();
		
		this.client = client;
		this.options = options;

		this.ended = false;
		this.collected = [];
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
		if(interaction.data?.component_type !== Constants.ComponentTypes.BUTTON) return false;
		if (this.options.filter(interaction)) {
			this.emit('collect', interaction);
			this.collected.push({ interaction });

			if (this.options.maxMatches && this.collected.length >= this.options.maxMatches) {
				this.stopListening('maxMatches');
			}
		}
		
		return this.ended;
	}

	/**
	 * Mainly used for the mute command. Will be removed in the future.
	 * It returns a promise that resolves to the same object
	 * @returns The object itself.
	 */
	collectInteractions() {
		return new Promise(resolve => this.once('end', resolve));
	}
 
	/**
	 * Stops listening to the client for new interactions.
	 * @param { String } reason The reason the collector ended.
	 */
	stopListening(reason) {
		if (this.ended) return;
		this.ended = true;

		this.client.removeListener('interactionCreate', this.listener);
		this.emit('end', this.collected, reason);
	}
}