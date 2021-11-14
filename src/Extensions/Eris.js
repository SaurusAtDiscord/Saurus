'use strict';

module.exports = class Eris {
    constructor(client) {
        this.client = client;
    }

    deleteCommand(commandId) {
        if (process.env.NODE_ENV === 'development') this.client.deleteGuildCommand('887396392497184778', commandId)
        else this.client.deleteCommand(commandId);
    }

    createCommand(context) {
        if (process.env.NODE_ENV === 'development') this.client.bulkEditGuildCommands('887396392497184778', context)
        else this.client.bulkEditCommands(context);
    }

    async getGuild(guildId) {
        if (!guildId) return;

        const guild = this.client.guilds.get(guildId);
        if (guild) return guild;

        const restGuild = await this.client.getRESTGuild(guildId);
        if (restGuild) return restGuild && this.client.guilds.add(restGuild);
    }

    async getUser(userId) {
        if (!userId) return;

        const user = this.client.users.get(userId);
        if (user) return user;

        const restUser = await this.client.getRESTUser(userId);
        if (restUser) return restUser && this.client.users.add(restUser);
    }

    async getMember(guildId, memberId) {
        if (!guildId || !memberId) return;

        const member = (await this.getGuild(guildId)).members.get(memberId);
        if (member) return member;

        const restMember = await this.client.getRESTGuildMember(guildId, memberId);
        if (restMember) return restMember && (await this.getGuild(guildId)).members.add(restMember);
    }
}