"use strict";

module.exports = class Embed {
    constructor(obj) {
        this.embed = { embeds: [obj] };
    }

    addComponents(component) {
        this.embed.components = component ?? [];
        return this.embed;
    }

    parse() {
        return this.embed;
    }
}