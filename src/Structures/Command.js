module.exports = class Command {
    constructor(client, options) {
        this.client = client;

        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.usage = options.usage;

        this.userPermissions = options.userPermissions; 
        this.clientPermissions = options.clientPermissions;

        this.nsfw = options.nsfw;
        this.ownerOnly = options.ownerOnly;

        this.options = options.options;
    }
}