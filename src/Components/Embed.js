module.exports = class Embed {
    constructor(obj) {
        this.embed = [{ embeds: [obj] }];
    }

    addComponents(component) {
        this.embed[0].components = component ?? [];
        return this.embed[0];
    }

    parse() {
        return this.embed[0];
    }
}