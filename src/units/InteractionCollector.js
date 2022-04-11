'use strict';

const eventEmitter = require('eventemitter3');

module.exports = class createMessageComponentCollector extends eventEmitter {
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
     * Collects and returns the most recent interaction.
     * @returns { Promise<Object> } The promise is resolved when the end event is emitted.
     */
    get lastInteraction() {
        return Promise.resolve(this.once('end'));
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


// module.exports = class createMessageComponentCollector extends eventEmitter {
// 	constructor(core, options) {
// 		super();
// 		this.client = core.client;
// 		this.channel = core.channel;

// 		this.timeLimit = options.timeLimit;
// 		this.filter = options.filter;
// 		this.maxIndex = options.maxIndex;

// 		this.collected = [];
// 		this.ended = false;
// 		this.begin();
// 	}

// 	begin() {
// 		this.client.on('interactionCreate', this.interaction);
// 		this.on('collect', this.collect);
// 		if (this.timeLimit) setTimeout(() => this.end('timeLimit'), this.timeLimit);
// 	}

// 	/**
// 	 * Stops listening to the client for new interactions.
// 	 * @param { String } reason The reason the collector ended.
// 	 */
// 	end(reason) {
// 		if (this.ended) return;
// 		this.ended = true;

// 		this.client.removeListener('interactionCreate', this.#interaction);
// 		this.removeListener('collect', this.collect);

// 		this.emit('end', this.collected, reason);
// 		return this;
// 	}

// 	interaction(interaction)  {
// 		if (!this.filter?.(interaction) || this.channel.id !== interaction.channel.id) return;
// 		this.emit('collect', interaction);
// 	}

// 	collect(interaction) {
// 		if (this.maxIndex && this.maxIndex === this.collected.length) return this.end('maxIndex');
// 		this.collected.push({ interaction });
// 	}
// }