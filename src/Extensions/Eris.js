'use strict';

module.exports = class ErisExtensions {
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
        return this.client.guilds.get(guildId) ?? (async function(client) {
            const restGuild = await client.getRESTGuild(guildId);
            return restGuild && client.guilds.add(restGuild);
        })(this.client);
    }

    getUser(userId) {
        if (!userId) return;
        return this.client.users.get(userId) ?? (async function(client) {
            const restUser = await client.getRESTUser(userId);
            return restUser && client.users.add(restUser);
        })(this.client);
    }

    async getMember(guildId, memberId) {
        if (!guildId || !memberId) return;
        return (await this.getGuild(guildId)).members.get(memberId) ?? (async function(client) {
            const restMember = await client.getRESTGuildMember(guildId, memberId);
            return restMember && (await this.getGuild(guildId)).members.add(restMember);
        })(this.client);
    }
}