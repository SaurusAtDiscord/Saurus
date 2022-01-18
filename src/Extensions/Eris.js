'use strict';

module.exports = class Eris {
    constructor(client) {
        this.client = client;
    }

    deleteCommand(commandId) {
        if (process.env.NODE_ENV === 'development') this.client.deleteGuildCommand('671691366102990848', commandId)
        else this.client.deleteCommand(commandId);
    }

    createCommand(context) {
        if (process.env.NODE_ENV === 'development') this.client.bulkEditGuildCommands('671691366102990848', context)
        else this.client.bulkEditCommands(context);
    }

    async getGuild(guildId) {
        return this.client.guilds.get(guildId) ?? this.client.guilds.add(await this.client.getRESTGuild(guildId));
    }

    async getUser(userId) {
        return this.client.users.get(userId) ?? this.client.users.add(await this.client.getRESTUser(userId));
    }

    async getMember(guildId, memberId) {
        const guild = await this.getGuild(guildId);
        return guild && (guild.members.get(memberId) ?? guild.members.add(await this.client.getRESTGuildMember(guildId, memberId)));
    }
}