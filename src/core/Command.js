'use strict';

module.exports = class Command {
    /**
     * Command structure.
     * @param { Eris.Client } client The client.
     * @param { Object } options Options for the command.
     */
    constructor(client, options) {
        this.client = client;

        this.name = options.name;
        this.description = options.description;
        this.category = options.category;

        this.userPermissions = options.userPermissions; 
        this.clientPermissions = options.clientPermissions;

        this.nsfw = options.nsfw;
        this.ownerOnly = options.ownerOnly;

        this.options = options.options;
    }
}