'use strict';

module.exports = class Embed {
    constructor(embed) {
        this.embed = { embed }
    }

    addComponent(component) {
        this.embed.components = component ?? [];
        return this.embed;
    }

    load() {
        return this.embed;
    }
}