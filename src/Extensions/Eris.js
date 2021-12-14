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
        if (!guildId) return;

        let guild = this.client.guilds.get(guildId);
        if (guild) return guild;
      
        guild = await this.client.getRESTGuild(guildId);
        this.client.guilds.add(guild);
        return guild;
    }

    async getUser(userId) {
        if (!userId) return;
        
        let user = this.client.users.get(userId);
        if (user) return user;
      
        user = await this.client.getRESTUser(userId);
        this.client.users.add(user);
        return user;
    }

    async getMember(guildId, memberId) {
        if (!guildId || !memberId) return;

        let member = (await this.getGuild(guildId)).members.get(memberId);
        if (member) return member;

        member = await this.client.getRESTGuildMember(guildId, memberId);
        (await this.getGuild(guildId)).members.add(member);
        return member;
    }
}