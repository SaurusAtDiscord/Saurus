// so what if this is the most ugly code I've ever written for functions in my whole life, should I care? no lmao I'll redo this later

/* eslint-disable no-async-promise-executor */
'use strict';

module.exports = class Eris {
    constructor(client) {
        this.client = client;
        this.baseURL = 'https://discord.com/api/v9';
    }

    deleteCommand(commandId) {
        if (process.env.NODE_ENV === 'development') this.client.deleteGuildCommand('887396392497184778', commandId)
        else this.client.deleteCommand(commandId);
    }

    createCommand(context) {
        if (process.env.NODE_ENV === 'development') this.client.bulkEditGuildCommands('887396392497184778', context)
        else this.client.bulkEditCommands(context);
    }

    getGuild(guildId) {
        if (!guildId) return;
        return this.client.guilds.get(guildId) ?? new Promise(async () => {
            const restGuild = await this.client.getRESTGuild(guildId);
            return restGuild && this.client.guilds.add(restGuild);
        });
    }

    getUser(userId) {
        if (!userId) return;
        return this.client.users.get(userId) ?? new Promise(async () => {
            const restUser = await this.client.getRESTUser(userId);
            return restUser && this.client.users.add(restUser);
        });
    }

    async getMember(guildId, memberId) {
        if (!guildId || !memberId) return;
        return (await this.getGuild(guildId)).members.get(memberId) ?? new Promise(async () => {
            const restMember = await this.client.getRESTGuildMember(guildId, memberId);
            return restMember && (await this.getGuild(guildId)).members.add(restMember);
        });
    }
}