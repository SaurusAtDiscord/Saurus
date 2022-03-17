'use strict';

const { Constants } = require('eris');

module.exports = class ModLogs {
    constructor(client, data) {
        this.client = client;
        this.data = data;
        this.interaction = data.interaction;
        this.guildId = data.interaction.guildID;
    }

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

    async #getWebhook() {
        const channel = await this.#getPostChannel();
        let webhook = await channel.getWebhooks();
        webhook = webhook.find(w => w.name === 'ᴹᵒᵈᴸᵒᵍˢ');

        return webhook ?? channel.createWebhook({ name: 'ᴹᵒᵈᴸᵒᵍˢ' }, 'No previous webhooks existed.');
    }

    async modLogsEnabled() {
        return (await this.client.database.getGuild(this.guildId)).modules.modLogs;
    }

    async postModLog(message) {
        const guilty = this.data.guilty;
        const guiltyText = guilty ? `\n• Action Against: \`${guilty.username}#${guilty.discriminator}\`` : '';

        this.#getWebhook()?.then(webhook => this.client.executeWebhook(webhook.id, webhook.token, { embed: {
            author: { name: 'Moderation Log', icon_url: (guilty ?? this.interaction.member).avatarURL },
            description: message,
            fields : [{
                name: 'Information',
                value: `• Moderator: \`${this.interaction.member.username}#${this.interaction.member.discriminator}\`${guiltyText}`,
            }]
        }}));
    }
}