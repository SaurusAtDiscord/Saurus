'use strict';

module.exports = class Command {
    constructor(client, options) {
        this.client = client;

        this.name = options.name;
        this.description = options.description;
        this.category = options.category;

        this.userPermissions = options.userPermissions ?? ['sendMessages', 'viewChannel']
        this.clientPermissions = options.clientPermissions ?? ['sendMessages', 'viewChannel']
        this.subCommandUserPermissions = options.subCommandUserPermissions ?? {};

        this.nsfw = options.nsfw;
        this.ownerOnly = options.ownerOnly;

        this.options = options.options;
    }
}