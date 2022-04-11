'use strict';

const { Constants } = require('eris');

module.exports = class ModLogs {
    constructor(client, data) {
        this.client = client;
        this.interaction = data.interaction;
        this.guildId = data.interaction.guildID;
    }

    /**
     * Creates a channel called "mod-logs" if it doesn't exist, and then returns the channel object.
     * @returns { Eris.Channel } The channel object.
     */
    async #getPostChannel() {
        const guild = await this.client.utils.getGuild(this.guildId);
        const modLogChannel = guild.channels.find(channel => channel.name === 'mod-logs');
        return modLogChannel ?? guild.createChannel('mod-logs', 0, 'Saurus ModLogs').then(channel =>
        this.client.editChannel(channel.id, {
            permissionOverwrites: [{
                id: this.guildId,
                type: 0,
                allow: null,
                deny: Constants.Permissions.viewChannel
            }]
        }));
    }

    /**
     * Gets the webhook for the post channel, or creates one if it doesn't exist
     * @return { Eris.Webhook } The webhook object.
     */
    async #getWebhook() {
        const channel = await this.#getPostChannel();
        const webhook = (await channel.getWebhooks()).find(w => w.name === 'ᴹᵒᵈᴸᵒᵍˢ');
        return webhook ?? channel.createWebhook({ name: 'ᴹᵒᵈᴸᵒᵍˢ' }, 'No previous webhooks existed.');
    }

    /**
     * Returns whether the modlogs module is enabled for this guild or not.
     * @return { Promise<Boolean> } Whether the modlogs module is enabled for this guild or not.
     */
    async modLogsEnabled() {
        return (await this.client.database.getGuild(this.guildId))?.modules.modLogs;
    }

    /**
     * Send a mod log to the mod log channel
     * @param { String } text The text to send to the modlog.
     */
    async postModLog(text, info) {
        if (!await this.modLogsEnabled()) return;
        this.#getWebhook()?.then(webhook => this.client.executeWebhook(webhook?.id, webhook?.token, { embed: {
            author: { name: 'Moderation Log' },
            description: text,
            fields : [info]
        }}));
    }
}