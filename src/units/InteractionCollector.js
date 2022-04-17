'use strict';

const eventEmitter = require('eventemitter3');

module.exports = class createMessageComponentCollector extends eventEmitter {
    constructor(core, options) {
        super();
        this.ended = false;
		this.client = core.client;
		this.channel = core.channel;

		this.timeLimit = options.timeLimit;
		this.filter = options.filter;
		this.maxIndex = options.maxIndex;

		this.collected = [];
        this.listener = this.#interaction.bind(this);

        this.client.on('interactionCreate', this.listener);
		this.on('collect', this.#collect);

        if (this.timeLimit) setTimeout(() => this.end('time'), this.timeLimit);
    }

    /**
     * If the interaction matches the filter, emit the interaction and increment the collected count.
     * @param intr The interaction object that was just emitted.
     */
    #interaction(intr) {
		if (!this.filter(intr) || this.channel.id !== intr.channel.id) return;
		this.emit('collect', intr);
    }

	/**
	 * Pushes the interaction to the collected array.
	 * @param intr - The value of the current iteration.
	 */
	#collect(intr) {
		this.collected.push({ intr });
		if (this.maxIndex && this.maxIndex === this.collected.length) return this.end('maxIndex');
	}

    /**
     * Stops listening to client for new interactions.
     * @param { String } reason Reason for why the collector ended.
     */
    end(reason) {
		if (this.ended) return;
		this.ended = true;

		this.client.removeListener('interactionCreate', this.#interaction);
		this.removeListener('collect', this.#collect);
		this.emit('end', this.collected, reason);
    }
}