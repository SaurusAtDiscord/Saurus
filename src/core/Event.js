'use strict';

module.exports = class Event {
    /**
     * Event structure.
     * @param { Eris.Client } client The client.
     */
    constructor(client) {
        this.client = client;
    }
}