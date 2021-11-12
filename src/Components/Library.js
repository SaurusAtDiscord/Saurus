const SuperAgent = require("superagent");

module.exports = class Library {
    constructor(client) {
        this.client = client;
    }

    async deleteCommand(commandId) {
        if (!commandId) return;
        return await (process.env.NODE_ENV === "development" ? this.client.deleteGuildCommand("887396392497184778", commandId) : this.client.deleteCommand(commandId));
    }

    async createCommand(context) {
        if (!context) return;
        return await (process.env.NODE_ENV === "development" ? this.client.bulkEditGuildCommands("887396392497184778", context) : this.client.bulkEditCommands(context));
    }

    async getGuild(guildId) {
        if (!guildId) return;
        return await this.client.guilds.get(guildId) ?? (await SuperAgent.get(`https://discord.com/api/v9/guilds/${guildId}`).set("Authorization", `Bot ${process.env.KEY}`)).body;
    }

    async getUser(userId) {
        if (!userId) return;
        return await this.client.users.get(userId) ?? (await SuperAgent.get(`https://discord.com/api/v9/users/${userId}`).set("Authorization", `Bot ${process.env.KEY}`)).body;
    }

    async getMember(userId, guildId) {
        if (!userId) return;
        return (await SuperAgent.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`).set("Authorization", `Bot ${process.env.KEY}`)).body;
    }
}